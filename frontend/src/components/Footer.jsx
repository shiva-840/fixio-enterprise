import React from "react";
import "./Footer.css";
const Footer = ({ setPage, searchService, setInfoTitle }) => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">Fixio</div>
          <p>
            India's trusted platform for home services. Verified professionals,
            guaranteed quality.
          </p>
          <div className="footer-socials">
            {["📱", "🐦", "📘", "📸"].map((ic, i) => (
              <span key={i}>{ic}</span>
            ))}
          </div>
        </div>

        {[
          { heading: "Company", links: ["About Us", "Careers", "Press", "Blog"] },
          { heading: "Services", links: ["🧹 Cleaning", "❄️ AC Repair", "⚡ Electrician", "🚰 Plumbing", "🎨 Painting"] },
          { heading: "Support", links: ["Help Center", "Safety Guidelines", "Terms of Service", "Privacy Policy"] },
          { heading: "Cities", links: ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai"] },
        ].map(({ heading, links }) => (
          <div key={heading} className="footer-col">
            <h4>{heading}</h4>
            {links.map((l) => (
              <a onClick={(e) => { 
                e.preventDefault(); 
                if (heading === "Services") {
                  searchService(l.replace(/[\u1000-\uFFFF]/g, '').trim());
                } else if (heading === "Cities") {
                  alert("Currently operating locally or expanding to " + l);
                } else {
                  setInfoTitle(l);
                  setPage("info");
                }
              }} href="#" key={l} style={{color: "inherit", textDecoration: "none", cursor: "pointer"}}>{l}</a>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <span>© 2025 Fixio Technologies Pvt. Ltd. All rights reserved.</span>
        <div className="footer-apps">
          <span onClick={() => alert('Opening App Store...')} style={{cursor: "pointer"}}>📱 App Store</span>
          <span onClick={() => alert('Opening Google Play...')} style={{cursor: "pointer"}}>🤖 Google Play</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;