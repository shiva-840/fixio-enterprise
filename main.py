from fastapi import FastAPI, HTTPException, Depends, Header, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from pydantic import BaseModel
from database import providers_collection, db
from ai.matcher import classify_problem, estimate_price
import bcrypt
import jwt
import datetime
import time
import os

SECRET_KEY = "super_secret_fixio_key_123"
ALGORITHM = "HS256"

app = FastAPI(title="Fixio API", version="2.0.0")

# Mount uploads dir
import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── WEBSOCKET MANAGER ────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, ws: WebSocket, user_email: str):
        await ws.accept()
        self.active_connections[user_email] = ws

    def disconnect(self, user_email: str):
        if user_email in self.active_connections:
            del self.active_connections[user_email]

    async def send_personal_message(self, message: dict, user_email: str):
        ws = self.active_connections.get(user_email)
        if ws:
            await ws.send_json(message)

manager = ConnectionManager()
# ────────────────────────────────────────────────────────

# ─── MODELS ─────────────────────────────────────────────

class ProblemRequest(BaseModel):
    problem: str

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class BookingRequest(BaseModel):
    provider_id: str
    service: str
    price: str
    problem_desc: str
    image_url: str = None

class StatusUpdateRequest(BaseModel):
    booking_id: str
    status: str

def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ─── HEALTH CHECK ───────────────────────────────────────

@app.get("/health")
def health_check():
    return {"status": "Fixio API is running!"}


# ─── AI MATCHING (FINAL UPGRADED) ───────────────────────

@app.post("/match")
def match_service(req: ProblemRequest):
    if not req.problem.strip():
        raise HTTPException(
            status_code=400,
            detail="Problem description cannot be empty."
        )

    try:
        # 🔥 Step 1: Get ALL matching services
        results = classify_problem(req.problem)

        if not results:
            raise HTTPException(
                status_code=404,
                detail="No service found"
            )

        # 🔥 Step 2: Pick TOP service
        top_service = results[0]["name"]
        price = results[0]["price"]

        # 🔥 Step 3: Normalize for DB
        service_key = top_service.lower()

        # 🔥 Step 4: Fetch providers
        providers = list(
            providers_collection.find({"service": service_key})
        )

        message = None

        # 🔥 Step 5: Fallback if no providers
        if not providers:
            message = f"No providers available for {top_service}. Showing general services."

            providers = list(
                providers_collection.find({"service": "general"})
            )

        # 🔥 Step 6: Sort best providers
        providers = sorted(
            providers,
            key=lambda x: x.get("rating", 0),
            reverse=True
        )[:3]

        # 🔥 Step 7: Fix ObjectId
        for p in providers:
            p["_id"] = str(p["_id"])

        # 🔥 Step 8: Response (WITH SUGGESTIONS 🚀)
        return {
            "service": top_service,
            "estimated_price": price,
            "providers": providers,
            "suggestions": results[:3],  # 🔥 NEW FEATURE
            "message": message,
            "success": True
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── GET ALL SERVICES ───────────────────────────────────

@app.get("/services")
def get_all_services():
    services = providers_collection.distinct("service")
    return {"services": services}


# ─── GET PROVIDERS BY SERVICE ───────────────────────────

@app.get("/providers/{service}")
def get_providers_by_service(service: str):
    providers = list(
        providers_collection.find({"service": service.lower()})
    )

    if not providers:
        raise HTTPException(
            status_code=404,
            detail="No providers found for this service."
        )

    for p in providers:
        p["_id"] = str(p["_id"])

    return {
        "service": service,
        "estimated_price": 299,
        "providers": providers
    }


# ─── AUTH ───────────────────────────────────────────────

@app.post("/auth/signup")
def signup(req: SignupRequest):
    users = db["users"]

    existing = users.find_one({"email": req.email})
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    # Hash the password directly using bcrypt
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(req.password.encode('utf-8'), salt).decode('utf-8')

    users.insert_one({
        "name": req.name,
        "email": req.email,
        "password": hashed_pw
    })

    return {
        "success": True,
        "message": f"Welcome to Fixio, {req.name}!"
    }


@app.post("/auth/login")
def login(req: LoginRequest):
    users = db["users"]

    user = users.find_one({"email": req.email})
    
    # Verify hash directly
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )
        
    try:
        is_valid = bcrypt.checkpw(req.password.encode('utf-8'), user.get("password", "").encode('utf-8'))
    except ValueError:
        is_valid = False

    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    # Issue JWT Token
    expiration = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    token_payload = {
        "user_email": user["email"],
        "user_name": user["name"],
        "exp": expiration
    }
    token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "success": True,
        "name": user["name"],
        "email": user["email"],
        "token": token
    }


# ─── BOOKINGS ───────────────────────────────────────────

@app.post("/book")
def add_booking(req: BookingRequest, user_token: dict = Depends(verify_token)):
    bookings = db["bookings"]
    
    # Save booking to DB
    new_booking = {
        "user_email": user_token["user_email"],
        "provider_id": req.provider_id,
        "service": req.service,
        "price": req.price,
        "problem_desc": req.problem_desc,
        "image_url": req.image_url,
        "created_at": time.time(),
        "status": "Assigned"
    }
    
    res = bookings.insert_one(new_booking)
    
    return {"success": True, "booking_id": str(res.inserted_id)}

@app.get("/bookings")
def get_bookings(user_token: dict = Depends(verify_token)):
    bookings = db["bookings"]
    
    user_books = list(bookings.find({"user_email": user_token["user_email"]}).sort("created_at", -1))
    
    # MOCK TRACKER LOGIC: Update status dynamically based on elapsed time
    current_time = time.time()
    for b in user_books:
        b["_id"] = str(b["_id"])
        elapsed = current_time - b["created_at"]
        
        # Simulated live tracking progress:
        if b["status"] != "Completed" and not b.get("provider_updated"):
            if elapsed > 180:
                b["status"] = "Completed"
            elif elapsed > 120:
                b["status"] = "Working"
            elif elapsed > 60:
                b["status"] = "On the Way"
            else:
                b["status"] = "Assigned"
                
            # If changed historically, conceptually update to keep tracker dynamic:
            bookings.update_one({"_id": b["_id"]}, {"$set": {"status": b["status"]}})
            
    return {"bookings": user_books}

# ─── MEDIA UPLOADS ──────────────────────────────────────

import shutil
import uuid

@app.post("/upload")
def upload_image(file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = f"uploads/{filename}"
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"http://127.0.0.1:8000/static/{filename}"}

# ─── PROVIDER APIS ──────────────────────────────────────

@app.get("/provider/bookings")
def get_provider_bookings(provider_id: str):
    bookings = db["bookings"]
    # We will simulate the provider logged in by passing query param
    provider_jobs = list(bookings.find({"provider_id": provider_id}).sort("created_at", -1))
    
    for b in provider_jobs:
        b["_id"] = str(b["_id"])
        
    return {"bookings": provider_jobs}

@app.post("/provider/update-status")
async def update_provider_booking_status(req: StatusUpdateRequest):
    bookings = db["bookings"]
    from bson.objectid import ObjectId
    
    # Need to fetch the booking first to get user_email to broadcast to
    booking = bookings.find_one({"_id": ObjectId(req.booking_id)})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    res = bookings.update_one(
        {"_id": ObjectId(req.booking_id)},
        {"$set": {"status": req.status, "provider_updated": True}}
    )
    
    if res.modified_count == 0:
        pass # Might be same status, but we broadcast anyway

    # BROADCAST VIA WEBSOCKET
    await manager.send_personal_message({
        "type": "STATUS_UPDATE",
        "booking_id": req.booking_id,
        "status": req.status
    }, booking["user_email"])

    return {"success": True}

# ─── WEBSOCKET ROUTE ────────────────────────────────────

@app.websocket("/ws/{user_email}")
async def websocket_endpoint(websocket: WebSocket, user_email: str):
    await manager.connect(websocket, user_email)
    try:
        while True:
            data = await websocket.receive_text()
            # We don't really expect clients to send, just listen.
    except WebSocketDisconnect:
        manager.disconnect(user_email)

# ─── MONOLITHIC REACT MOUNT ─────────────────────────────────

frontend_path = os.path.join(os.path.dirname(__file__), 'frontend', 'build')
if os.path.isdir(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")