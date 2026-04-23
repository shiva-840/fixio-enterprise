# 🛠️ Fixio: The AI-Powered Service Marketplace

![Live Deployment](https://img.shields.io/badge/Status-LIVE-brightgreen?style=for-the-badge)
**🚀 Live Demo:** [https://fixio-enterprise.onrender.com](https://fixio-enterprise.onrender.com)

Fixio is a robust, full-stack, two-sided marketplace designed to bridge the gap between users with home maintenance issues and verified service professionals. 

Built using a modern **Python FastAPI** and **React** stack, Fixio leverages autonomous Machine Learning layers and continuous Native Web APIs to provide a seamless, enterprise-grade mock booking experience.

## ✨ Core Features & Technical Highlights

*   **🧠 Autonomous AI Routing:** Built-in integration with highly optimized NLP engines. Users can type unstructured text (or literally use the Microphone for Native Audio Search), and the Python logic uses Scikit-Learn TF-IDF vectorization to calculate intent and aggressively route the user to the exact required service.
*   **🌐 Real-Time Sockets:** Standard HTTP polling was entirely stripped out during the Phase 4 upgrade. Fixio uses stateful `fastapi.WebSocket` streams for instantaneous data continuity between the User's live GPS map and the actual Provider's dashboard terminal. 
*   **🗺️ Interactive Native Maps:** Built on `react-leaflet`, mapping Live Provider coordinates locally onto the end-user's UI. This pairs directly with the system's HTML5 Reverse-Geocoding mechanisms.
*   **🔐 Best-in-Class Security Protocols:** Secured by raw `bcrypt` hashing algorithms, preventing local credential bleeding, and fully gated using modern Stateless JSON Web Tokens (`PyJWT`).
*   **💳 Encrypted Payment Gateways:** Complete integration of complex React-State dynamic multi-step Checkout modals supporting simulated Stripe/Razorpay validation.

## 🏗️ The Technology Stack
*   **Frontend Layer:** React.js, Leaflet, Recharts, CSS Variables (Dark/Light Modes)
*   **Server Control Layer:** FastAPI, Uvicorn ASGI, WebSockets, Python-Multipart
*   **Machine Learning:** Scikit-Learn (`TF-IDF Vectorizer`, `Cosine Similarity`)
*   **Persistence Layer:** MongoDB Atlas (Cloud)

## 🚀 Quick Start (Local Setup)

To spin up the ecosystem locally, clone the repository and execute the environment:

```bash
# Clone the repository
git clone https://github.com/shiva-840/fixio-enterprise.git
cd fixio-enterprise

# Automatically spin up both the FastAPI backend and React frontend
./start.bat
```
*(Ensure you have successfully built your `venv` requirements and installed your `npm` dependencies beforehand).*

## 🖼️ Gallery
<img width="1919" height="924" alt="Screenshot 1" src="https://github.com/user-attachments/assets/19aeafeb-b60a-4512-a3a0-444e2c9efaeb" />
<img width="1890" height="818" alt="Screenshot 2" src="https://github.com/user-attachments/assets/60325da4-e8a0-45e9-96b4-507fad04d8ff" />
