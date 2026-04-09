import React from "react";
import "./HomePage.css"; // Reuse hero styles

const mockContent = {
  "About Us": "We are Fixio, India's most advanced AI-powered service matching platform. Founded in 2025, our goal is to eliminate the friction between broken homes and professional fixers using machine learning and real-time websockets.",
  "Careers": "We are not currently hiring, but we are always looking for 10x Full Stack Engineers who can build real-time AI architectures using React and FastAPI.",
  "Press": "Fixio recently made headlines for revolutionizing the gig economy with its autonomous AI negotiation models and live WebSockets routing.",
  "Blog": "Check back later for articles on Home Maintenance, DIY Plumbing fixes, and inside looks at our Python/FastAPI backend architecture.",
  "Help Center": "Having trouble? Remember that you can use the Microphone icon on the Home Page to speak your problem aloud, and our AI will automatically route you to the correct provider.",
  "Safety Guidelines": "All Fixio providers undergo strict background checks. Live GPS tracking in the dashboard ensures you always know when your provider is on the way.",
  "Terms of Service": "By using Fixio, you agree to awesomeness. This is a portfolio demonstration project.",
  "Privacy Policy": "We take privacy seriously. Your location data is only used locally in your browser via OpenStreetMap to reverse-geocode your city. We do not store your GPS data."
};

const InfoPage = ({ title }) => {
  const content = mockContent[title] || "Detailed information for this section is currently being updated by our team. Check back soon!";

  return (
    <div className="section" style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div className="glass-panel" style={{ padding: "60px 40px", maxWidth: "800px", borderRadius: "var(--radius-lg)" }}>
        <h1 style={{ fontSize: "42px", color: "var(--text)", marginBottom: "24px" }}>
          {title}
        </h1>
        <p style={{ fontSize: "18px", color: "var(--text-muted)", lineHeight: "1.8" }}>
          {content}
        </p>
      </div>
    </div>
  );
};

export default InfoPage;
