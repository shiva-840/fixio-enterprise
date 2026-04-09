import React, { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = ({
  scrolled,
  setPage,
  user,
  handleLogout,
  problem,
  setProblem,
  searchService,
  setAuthError,
  theme,
  setTheme
}) => {
  const [location, setLocation] = useState("Detecting Location...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || "Unknown Area";
            setLocation(`📍 ${city}`);
          } catch (e) {
            setLocation("📍 Location Unknown");
          }
        },
        () => {
          setLocation("📍 Location Access Denied");
        }
      );
    } else {
      setLocation("📍 GPS Unavailable");
    }
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      
      {/* LOGO */}
      <div className="nav-logo" onClick={() => setPage("home")}>
        Fixio<span className="dot">.</span>
        <div style={{fontSize: 10, color: "var(--orange)", marginTop: 2}}>{location}</div>
      </div>

      {/* SEARCH BAR */}
      <div className="nav-search">
        <div className="nav-search-wrapper">
          <span className="nav-search-icon">🔍</span>

          <input
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchService();
              }
            }}
            placeholder="Search services..."
          />
        </div>

        <button
          className="nav-search-btn"
          onClick={() => searchService()}
        >
          Search
        </button>
      </div>

      {/* NAV LINKS */}
      <div className="nav-links">
        <button
          className="nav-link-btn"
          style={{fontSize: 20}}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <button
          className="nav-link-btn"
          onClick={() => setPage("home")}
        >
          Home
        </button>

        <button
          className="nav-link-btn"
          onClick={() => setPage("services")}
        >
          Services
        </button>

        {user ? (
          <>
            <span className="nav-user">
              Hi, {user.name.split(" ")[0]} 👋
            </span>

            <button
              className="nav-link-btn"
              onClick={() => setPage("dashboard")}
            >
              My Bookings
            </button>

            <button
              className="btn-outline"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="nav-link-btn"
              onClick={() => setPage("provider")}
              style={{color: "var(--orange)", fontWeight: "600"}}
            >
              Provider Portal
            </button>

            <button
              className="btn-outline"
              onClick={() => {
                setAuthError("");
                setPage("login");
              }}
            >
              Login
            </button>

            <button
              className="btn-primary"
              onClick={() => {
                setAuthError("");
                setPage("signup");
              }}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;