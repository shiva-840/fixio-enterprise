# 🛠️ Fixio: The AI-Powered Service Marketplace

Fixio is a robust, full-stack, two-sided marketplace designed to bridge the gap between users with home maintenance issues and verified service professionals. 

Built using a modern **Python FastAPI** and **React** stack, Fixio leverages autonomous Machine Learning layers and continuous Native Web APIs to provide a seamless, enterprise-grade mock booking experience.

## ✨ Core Features & Technical Highlights

*   **🧠 Autonomous AI Routing:** Built-in integration with the HuggingFace `sentence-transformers` NLP engine. Users can type unstructured text (or literally use the Microphone for Native Audio Search), and the Python logic will calculate intent vectorization and aggressively route the user to the exact required service.
*   **🌐 Real-Time Sockets:** Standard HTTP polling was entirely stripped out during the Phase 4 upgrade. Fixio uses stateful `fastapi.WebSocket` streams for instantaneous data continuity between the User's live GPS map and the actual Provider's dashboard terminal. 
*   **🗺️ Interactive Native Maps:** Built on `react-leaflet`, mapping Live Provider coordinates locally onto the end-user's UI. This pairs directly with the system's HTML5 Reverse-Geocoding mechanisms.
*   **🔐 Best-in-Class Security Protocols:** Secured by raw `bcrypt` hashing algorithms, preventing local credential bleeding, and fully gated using modern Stateless JSON Web Tokens (`PyJWT`).
*   **💳 Encrypted Payment Gateways:** Complete integration of complex React-State dynamic multi-step Checkout modals supporting simulated Stripe/Razorpay validation.

## 🏗️ The Technology Stack
**Frontend Layer:** React.js, Leaflet, Recharts, CSS Variables (Dark/Light Modes)
**Server Control Layer:** FastAPI, Uvicorn ASGI, WebSockets, Python-Multipart
**Machine Learning:** Python `sentence-transformers` & `torch`
**Persistance Layer:** MongoDB (`pymotor`), `gridfs` logic frameworks

## 🚀 Quick Start (Local Setup)

To spin up the ecosystem locally, clone the repository and run the automated execution script:

```bash
# Clone the repository
git clone https://github.com/your-username/fixio.git
cd fixio

# Automatically spin up both the FastAPI backend and React frontend
./start.bat
```
*(Ensure you have successfully built your `venv` requirements and installed your `npm` dependencies beforehand).*
