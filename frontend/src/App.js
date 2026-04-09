import Loader from "./components/Loader";
import { useEffect, useState } from "react";

import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ResultsPage from "./pages/ResultsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProviderDashboard from "./pages/ProviderDashboard";
import InfoPage from "./pages/InfoPage";

const API = "http://127.0.0.1:8000";

export default function App() {
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [page, setPage] = useState("home");
  
  // Auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("fixio_theme") || "dark");

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem("fixio_theme", theme);
  }, [theme]);

  const [problem, setProblem] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [infoTitle, setInfoTitle] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });

  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [bookingDone, setBookingDone] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("fixio_token");
    const savedUser = localStorage.getItem("fixio_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Force scroll to top on every page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const searchService = async (query) => {
    const q = query || problem;
    if (!q.trim()) {
      showToast("Please enter a problem");
      return;
    }
    setProblem(q);
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`${API}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: q }),
      });
      if (!res.ok) throw new Error("Server error");
      const result = await res.json();
      if (!result || !result.providers) throw new Error("Invalid response");
      
      setData(result);
      setPage("results");
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      setError("Search failed. Try again.");
      showToast("⚠️ Search failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.detail);

      setToken(result.token);
      let userData = { name: result.name, email: result.email };
      setUser(userData);
      
      localStorage.setItem("fixio_token", result.token);
      localStorage.setItem("fixio_user", JSON.stringify(userData));
      
      setPage("home");
      showToast(`Welcome back, ${result.name}! 👋`);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.detail);

      showToast(result.message);
      setPage("login");
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fixio_user");
    localStorage.removeItem("fixio_token");
    setPage("home");
    showToast("Logged out successfully.");
  };

  const handleBook = async (provider) => {
    if (!token) {
      showToast("Please login first to book a service!");
      setPage("login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          provider_id: provider._id || provider.name,
          service: data.service,
          price: provider.price ? provider.price.toString() : "299",
          problem_desc: problem
        })
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.detail || "Booking failed");
      
      setBookingDone(provider);
      showToast(`✅ Booking confirmed with ${provider.name}!`);
    } catch(err) {
      showToast(`⚠️ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingScreen) return <Loader />;

  return (
    <div className="app">
      <Navbar
        scrolled={scrolled}
        setPage={setPage}
        user={user}
        handleLogout={handleLogout}
        problem={problem}
        setProblem={setProblem}
        searchService={searchService}
        setAuthError={setAuthError}
        theme={theme}
        setTheme={setTheme}
      />

      {toast && <div className="toast">{toast}</div>}

      <main>
        {page === "home" && <HomePage problem={problem} setProblem={setProblem} searchService={searchService} loading={loading} error={error} />}
        {page === "services" && <ServicesPage searchService={searchService} />}
        {page === "results" && <ResultsPage data={data} loading={loading} problem={problem} setProblem={setProblem} searchService={searchService} handleBook={handleBook} bookingDone={bookingDone} setBookingDone={setBookingDone} setPage={setPage} />}
        {page === "login" && <LoginPage authForm={loginForm} setAuthForm={setLoginForm} handleLogin={handleLogin} authError={authError} authLoading={authLoading} setPage={setPage} setAuthError={setAuthError} />}
        {page === "signup" && <SignupPage authForm={signupForm} setAuthForm={setSignupForm} handleSignup={handleSignup} authError={authError} authLoading={authLoading} setPage={setPage} setAuthError={setAuthError} />}
        {page === "dashboard" && <DashboardPage token={token} API={API} setPage={setPage} />}
        {page === "provider" && <ProviderDashboard API={API} />}
        {page === "info" && <InfoPage title={infoTitle} />}
      </main>

      <Footer setPage={setPage} searchService={searchService} setInfoTitle={setInfoTitle} />
    </div>
  );
}