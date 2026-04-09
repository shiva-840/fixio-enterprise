import { useState } from "react";
import { SERVICES } from "../data/services";
import { REVIEWS } from "../data/reviews";
import "./HomePage.css";

const HomePage = ({
  problem,
  setProblem,
  searchService,
  loading,
  error,
}) => {
  const [isDictating, setIsDictating] = useState(false);

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsDictating(true);
    recognition.onspeechend = () => {
      recognition.stop();
      setIsDictating(false);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setProblem(transcript);
      // Auto-trigger search after a short delay so user sees text
      setTimeout(() => {
        searchService(transcript);
      }, 500);
    };
    recognition.start();
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">⭐ Trusted by 5 lakh+ customers</div>

          <h1>
            Home services,<br />
            <span className="accent">done right.</span>
          </h1>

          <p className="hero-sub">
            Book verified professionals for cleaning, repairs and more — at your doorstep.
          </p>

          {/* SEARCH */}
          <div className="hero-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="What do you need help with? e.g. 'My fan is making a weird noise'"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchService()}
            />
            <button className="mic-btn" onClick={startVoiceSearch} style={{background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 20}}>
              {isDictating ? "🔴" : "🎤"}
            </button>
            <button
              className="btn-primary hero-search-btn"
              onClick={() => searchService()}
              disabled={loading}
            >
              {loading ? "..." : "Search"}
            </button>
          </div>

          {error && <p className="error-msg">{error}</p>}
        </div>

        {/* RIGHT IMAGES */}
        <div className="hero-right">
          {[
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
          ].map((src, i) => (
            <div key={i} className={`hero-img ${i % 2 ? "shifted" : ""}`}>
              <img src={src} alt="service" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-bar">
        {[
          { v: "5L+", l: "Happy Customers" },
          { v: "1200+", l: "Verified Pros" },
          { v: "50+", l: "Services" },
          { v: "4.8★", l: "Avg Rating" },
        ].map((s) => (
          <div key={s.l} className="stat">
            <strong>{s.v}</strong>
            <span>{s.l}</span>
          </div>
        ))}
      </section>

      {/* SERVICES */}
      <section className="section">
        <div className="section-header">
          <div>
            <p className="section-tag">What we offer</p>
            <h2>Our Services</h2>
          </div>
        </div>

        <div className="service-grid">
          {SERVICES.map((s) => (
            <div
              key={s.key}
              className="service-card"
              onClick={() => searchService(s.key)}
            >
              <div className="service-icon">{s.icon}</div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-header centered">
          <p className="section-tag">Simple process</p>
          <h2>How Fixio works</h2>
        </div>

        <div className="steps">
          {[
            { icon: "🔍", step: "01", title: "Search", desc: "Find the service you need" },
            { icon: "📅", step: "02", title: "Book", desc: "Pick a time that works" },
            { icon: "✅", step: "03", title: "Confirm", desc: "Get a verified pro assigned" },
            { icon: "🏠", step: "04", title: "Done", desc: "Sit back and relax" },
          ].map((item, i) => (
            <div key={i} className="step">
              <div className="step-icon">{item.icon}</div>
              <div className="step-num">STEP {item.step}</div>
              <div className="step-title">{item.title}</div>
              <div className="step-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section">
        <div className="section-header centered">
          <p className="section-tag">Customers love us</p>
          <h2>What people are saying</h2>
        </div>

        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className="review-card">
              <div className="stars">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>
              <p>"{r.text}"</p>

              <div className="review-footer">
                <div>
                  <strong>{r.name}</strong>
                  <small>{r.city}</small>
                </div>
                <span className="review-badge">{r.service}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <h2>Ready to book a service?</h2>
        <p>Join lakhs of happy customers. First booking? Get ₹200 off.</p>
        <button className="btn-white">Book Now →</button>
      </section>
    </>
  );
};

export default HomePage;