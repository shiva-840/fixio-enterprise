import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./DashboardPage.css";

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// A custom SVG car icon for the provider
const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3204/3204936.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const WEBSOCKET_PROTOCOL = window.location.protocol === "https:" ? "wss:" : "ws:";
const WS_URL = window.location.hostname === "localhost" 
  ? "ws://127.0.0.1:8000/ws" 
  : `${WEBSOCKET_PROTOCOL}//${window.location.host}/ws`;

const DashboardPage = ({ token, API, setPage }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map simulated coordinates based on statuses
  const baseLat = 12.9716; // Example: Bangalore
  const baseLng = 77.5946;

  // Track WebSockets
  const wsRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    const payload = JSON.parse(atob(token.split(".")[1]));
    
    // Connect WS
    const socket = new WebSocket(`${WS_URL}/${payload.user_email}`);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "STATUS_UPDATE") {
        setBookings(prev => prev.map(b => 
          b._id === data.booking_id ? { ...b, status: data.status } : b
        ));
      }
    };
    wsRef.current = socket;

    fetchBookings(token);

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchBookings = async (authToken) => {
    try {
      const resp = await fetch(`${API}/bookings`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (!resp.ok) {
        if (resp.status === 401) {
          localStorage.removeItem("fixio_token");
          setPage("login");
          return;
        }
      }
      const data = await resp.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if(!token) return null;

  if (loading) {
    return (
      <div className="section dashboard-page">
        <div className="loader-fill"></div>
      </div>
    );
  }

  // Helper to map status to GPS
  const getCarPosition = (status, idx) => {
    // We add slight offsets based on index so multiple bookings don't overlap
    const offset = idx * 0.005;
    if (status === "Assigned") return [baseLat + 0.05 + offset, baseLng + 0.05 + offset];
    if (status === "On the Way") return [baseLat + 0.02 + offset, baseLng + 0.02 + offset];
    if (status === "Working") return [baseLat, baseLng]; // At your house
    if (status === "Completed") return [baseLat, baseLng]; 
    return [baseLat + 0.05, baseLng + 0.05];
  };

  return (
    <div className="section dashboard-page">
      <div className="dashboard-header text-center mb-5">
        <h1>My Bookings</h1>
        <p>Real-time live map tracking via WebSockets</p>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings text-center">
          <h2>No upcoming services.</h2>
          <button className="btn-primary" onClick={() => setPage("home")}>Book a service</button>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking, idx) => {
            const carPos = getCarPosition(booking.status, idx);
            const userPos = [baseLat, baseLng]; // Hardcoded user pos for demo

            return (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div style={{display: 'flex', gap: '20px', alignItems: 'flex-start'}}>
                    {booking.image_url && (
                      <img src={booking.image_url} alt="Reference" style={{width: 60, height: 60, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)'}} />
                    )}
                    <div>
                      <h3>{booking.service}</h3>
                      <p className="booking-desc">"{booking.problem_desc}"</p>
                    </div>
                  </div>
                  <div className="booking-price">₹{booking.price}</div>
                </div>

                {/* THE LIVE MAP (Uber style) */}
                <div className="map-container-wrapper" style={{ height: "300px", width: "100%", marginTop: "20px", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--card-border)"}}>
                  <MapContainer center={userPos} zoom={12} style={{ height: "100%", width: "100%", filter: "invert(90%) hue-rotate(180deg)" }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap'
                    />
                    <Marker position={userPos}>
                      <Popup>Your Service Location</Popup>
                    </Marker>
                    {booking.status !== "Completed" && (
                      <Marker position={carPos} icon={carIcon}>
                        <Popup>{booking.status}</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>

                <div className="tracker-box mt-4">
                  <div className={`t-step ${["Assigned", "On the Way", "Working", "Completed"].includes(booking.status) ? "active" : ""}`}>
                    <div className="t-dot"></div><span>Assigned</span>
                  </div>
                  <div className="t-line"></div>
                  <div className={`t-step ${["On the Way", "Working", "Completed"].includes(booking.status) ? "active" : ""}`}>
                    <div className="t-dot"></div><span>On the Way</span>
                  </div>
                  <div className="t-line"></div>
                  <div className={`t-step ${["Working", "Completed"].includes(booking.status) ? "active" : ""}`}>
                    <div className="t-dot"></div><span>Working</span>
                  </div>
                  <div className="t-line"></div>
                  <div className={`t-step ${["Completed"].includes(booking.status) ? "active" : ""}`}>
                    <div className="t-dot"></div><span>Completed</span>
                  </div>
                </div>

                <div className="booking-footer mt-4">
                  <span>Provider ID: <strong>{booking.provider_id.substring(0, 12)}...</strong></span>
                  <span className={`status-badge ${booking.status.replace(/ /g, "").toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
