import { useState } from "react";
import "./ResultsPage.css";

const API = "http://127.0.0.1:8000";

const ResultsPage = ({ data, loading, problem, setProblem, searchService, handleBook, bookingDone, setBookingDone, setPage }) => {
  const [modalProvider, setModalProvider] = useState(null);
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [paymentData, setPaymentData] = useState({ card: "", expiry: "", cvv: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  // If no search is completed yet...
  if (!data && !loading && !bookingDone) {
    return (
      <div className="section results-page">
        <div className="no-results">
          <h2>No results yet.</h2>
          <p>Please enter a problem on the home page.</p>
        </div>
      </div>
    );
  }

  // Handle Image Upload First
  const handleUploadAndProceed = async () => {
    setIsProcessing(true);
    let uploadedUrl = "";
    
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      try {
        const res = await fetch(`${API}/upload`, {
          method: "POST",
          body: formData
        });
        if (res.ok) {
          const ret = await res.json();
          uploadedUrl = ret.url;
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
    setImageUrl(uploadedUrl);
    setIsProcessing(false);
    setStep(2); // Move to Payment Step
  };

  // Perform the Booking via our mock checkout
  const confirmBooking = async () => {
    setIsProcessing(true);
    // Add fake delay for realism
    await new Promise(r => setTimeout(r, 1500));
    
    const token = localStorage.getItem("fixio_token");
    if (!token) {
      setPage("login");
      return;
    }

    try {
      const resp = await fetch(`${API}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          provider_id: modalProvider._id || modalProvider.name,
          service: data.service,
          price: modalProvider.price ? modalProvider.price.toString() : "299",
          problem_desc: problem,
          image_url: imageUrl
        })
      });
      if (resp.ok) {
        setBookingDone(modalProvider);
        setModalProvider(null);
      }
    } catch(err) {
      console.error(err);
    }
    setIsProcessing(false);
  };

  if (loading) {
    return (
      <div className="section results-page">
        <div className="loader-bar">
          <div className="loader-fill"></div>
        </div>
      </div>
    );
  }

  if (bookingDone) {
    return (
      <div className="section results-page">
        <div className="booking-success">
          <div className="success-icon">🎉</div>
          <h3>Payment Successful!</h3>
          <p>Your booking with <strong>{bookingDone.name}</strong> is confirmed.</p>
          <p>Service: <strong>{data?.service || "General"}</strong></p>
          
          <button className="btn-primary" onClick={() => {
            setBookingDone(null);
            setPage("dashboard");
          }}>View My Bookings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="section results-page">
      <div className="page-hero">
        <h1>Results for "{problem}"</h1>
        <p>We detected: <strong>{data.service} 🔧</strong></p>
        <p><small>Estimated starting price: ₹{data.estimated_price} - ₹{data.estimated_price * 4}</small></p>
      </div>

      <div className="providers-grid">
        {data.providers && data.providers.length > 0 ? (
          data.providers.map((p, idx) => (
            <div key={idx} className="provider-card">
              <img src={p.image || "https://randomuser.me/api/portraits/men/32.jpg"} alt={p.name} className="provider-photo" />
              <div className="provider-info">
                <h3>{p.name}</h3>
                <p className="provider-bio">{p.description || "Expert service provider."}</p>
                <div className="provider-meta">
                  <span>⭐ {p.rating} / 5</span>
                  <span>📍 {p.location || "Local"}</span>
                  <span>✅ {p.jobs_completed || 200}+ jobs</span>
                </div>
              </div>
              <div className="provider-right">
                <div className="provider-price">₹{p.price || 499}</div>
                <small>per visit</small>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setModalProvider(p);
                    setStep(1);
                    setImageFile(null);
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No exact providers found for this category. Stay tuned!</div>
        )}
      </div>

      <div className="results-search-again">
        <input
          type="text"
          placeholder="New problem?"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchService()}
        />
        <button
          className="btn-primary"
          onClick={() => searchService()}
          disabled={loading}
        >
          Search
        </button>
      </div>

      {/* MULTI_STEP BOOKING MODAL */}
      {modalProvider && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <button className="modal-close" onClick={() => setModalProvider(null)}>✕</button>
            <div className="modal-header">
              <h3>Book {modalProvider.name}</h3>
              <p>{data.service} • ₹{modalProvider.price}</p>
            </div>

            {step === 1 && (
              <div className="modal-body step-1">
                <h4>Upload Reference Photo (Optional)</h4>
                <p className="subtext">Help the provider understand the scope of the job.</p>
                <div className="file-upload-box">
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                  {imageFile && <p className="file-selected">Selected: {imageFile.name}</p>}
                </div>
                <button className="btn-primary full-width mt-4" onClick={handleUploadAndProceed} disabled={isProcessing}>
                  {isProcessing ? "Uploading..." : "Continue to Payment ➔"}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="modal-body step-2">
                <h4>💳 Secure Checkout</h4>
                <div className="cc-form">
                  <input type="text" placeholder="Card Number (mock 1234...)" maxLength={16} value={paymentData.card} onChange={e => setPaymentData({...paymentData, card: e.target.value})} />
                  <div className="cc-row">
                    <input type="text" placeholder="MM/YY" maxLength={5} value={paymentData.expiry} onChange={e => setPaymentData({...paymentData, expiry: e.target.value})} />
                    <input type="password" placeholder="CVV" maxLength={3} value={paymentData.cvv} onChange={e => setPaymentData({...paymentData, cvv: e.target.value})} />
                  </div>
                </div>
                <button className="btn-primary full-width mt-4" onClick={confirmBooking} disabled={isProcessing || paymentData.card.length < 15}>
                  {isProcessing ? "Processing Secure Payment..." : `Pay ₹${modalProvider.price} & Book`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;