import "./LoginPage.css";
const LoginPage = ({
  authForm,
  setAuthForm,
  handleLogin,
  authError,
  authLoading,
  setPage,
  setAuthError,
}) => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Fixio</div>

        <h2>Welcome back</h2>
        <p className="auth-sub">Sign in to your account</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm({ ...authForm, email: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="Your password"
              value={authForm.password}
              onChange={(e) =>
                setAuthForm({ ...authForm, password: e.target.value })
              }
            />
          </div>

          {authError && <p className="auth-error">{authError}</p>}

          <button
            type="submit"
            className="btn-primary full"
            disabled={authLoading}
          >
            {authLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <span
            onClick={() => {
              setAuthError("");
              setPage("signup");
            }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;