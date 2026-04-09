import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./ProviderDashboard.css";

export default function ProviderDashboard({ API }) {
  const [providerId, setProviderId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");

  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loginProvider = (e) => {
    e.preventDefault();
    if (!providerId) return;
    setIsLoggedIn(true);
    fetchJobs(providerId);
  };

  const fetchJobs = async (pid) => {
    setLoading(true);
    try {
      const resp = await fetch(`${API}/provider/bookings?provider_id=${pid}`);
      const data = await resp.json();
      if (resp.ok) setJobs(data.bookings);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (jobId, newStatus) => {
    try {
      const resp = await fetch(`${API}/provider/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: jobId, status: newStatus })
      });
      if (resp.ok) {
        showToast(`Job marked as ${newStatus}!`);
        fetchJobs(providerId);
      }
    } catch(err) {
      console.error(err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="section provider-login">
        <div className="auth-card">
          <div className="auth-logo">Provider<span></span></div>
          <h2>Partner Portal</h2>
          <p className="auth-sub">Enter your Provider ID to view active jobs.</p>
          <form onSubmit={loginProvider}>
            <div className="form-group">
              <input type="text" placeholder="Provider Name or ID" value={providerId} onChange={e => setProviderId(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary full-width">Enter Portal</button>
          </form>
          <div className="demo-hint mt-4" style={{fontSize: 12, color: '#666', textAlign: 'center'}}>
            Demo: Try entering 'Anand Verma' or 'Deepak Kulkarni' if you booked them!
          </div>
        </div>
      </div>
    );
  }

  // Calculate Mock Earnings
  const computeEarnings = () => {
    const data = [
      { name: 'Mon', earn: 0 }, { name: 'Tue', earn: 0 }, { name: 'Wed', earn: 0 },
      { name: 'Thu', earn: 0 }, { name: 'Fri', earn: 0 }, { name: 'Sat', earn: 0 },
      { name: 'Sun', earn: 0 }
    ];
    // Map completed jobs to current day mock
    let total = 0;
    jobs.forEach(j => {
      const price = parseInt(j.price) || 0;
      if (j.status === "Completed") total += price;
    });
    // Just mock distribution for the bar chart
    data[6].earn = total; 
    if (total > 0) {
      data[5].earn = Math.floor(total * 0.4);
      data[4].earn = Math.floor(total * 0.8);
    }
    return data;
  };

  return (
    <div className="section provider-dashboard">
      {toast && <div className="toast">{toast}</div>}
      
      <div className="provider-header">
        <div>
          <h2>Partner Portal</h2>
          <p>Logged in as: <strong>{providerId}</strong></p>
        </div>
        <div className="provider-tabs">
          <button className={activeTab === "jobs" ? "active" : ""} onClick={() => setActiveTab("jobs")}>Active Jobs</button>
          <button className={activeTab === "analytics" ? "active" : ""} onClick={() => setActiveTab("analytics")}>Earnings</button>
        </div>
      </div>

      {loading && <div className="loader-fill"></div>}

      {activeTab === "jobs" && (
        <div className="jobs-list">
          {jobs.length === 0 ? <p style={{color: '#888'}}>No jobs assigned to you right now.</p> : null}
          {jobs.map(job => (
            <div key={job._id} className="job-card">
              <div className="job-top">
                <div>
                  <h4>{job.service}</h4>
                  <p>User: {job.user_email}</p>
                </div>
                <div className="job-price">₹{job.price}</div>
              </div>
              <p className="job-desc">Problem: "{job.problem_desc}"</p>
              
              {job.image_url && (
                <div className="job-image">
                  <a href={job.image_url} target="_blank" rel="noreferrer">
                    <img src={job.image_url} alt="Attached Reference" />
                  </a>
                </div>
              )}

              <div className="job-actions">
                <span className="status-badge" style={{marginRight: 15}}>{job.status}</span>
                {job.status === "Assigned" && <button className="btn-outline" onClick={() => updateStatus(job._id, "On the Way")}>Accept & Start Route</button>}
                {job.status === "On the Way" && <button className="btn-outline" onClick={() => updateStatus(job._id, "Working")}>Arrived & Start Work</button>}
                {job.status === "Working" && <button className="btn-primary" onClick={() => updateStatus(job._id, "Completed")}>Mark Completed</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="analytics-view">
          <div className="stat-boxes">
            <div className="stat-box">
              <h3>Total Earned</h3>
              <div className="stat-num">₹{jobs.filter(j => j.status==="Completed").reduce((a, b) => a + parseInt(b.price), 0)}</div>
            </div>
            <div className="stat-box">
              <h3>Jobs Completed</h3>
              <div className="stat-num">{jobs.filter(j => j.status==="Completed").length}</div>
            </div>
          </div>
          
          <div className="chart-container" style={{ width: '100%', height: 300, background: 'var(--card-bg)', padding: 20, borderRadius: 16, border: '1px solid var(--card-border)'}}>
            <ResponsiveContainer>
              <BarChart data={computeEarnings()}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{background: '#111', border: '1px solid #333', borderRadius: 8}} />
                <Bar dataKey="earn" fill="var(--orange)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
