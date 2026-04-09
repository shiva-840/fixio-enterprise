import "./SignupPage.css";
const SignupPage = ({
  authForm,
  setAuthForm,
  handleSignup,
  authError,
  authLoading,
  setPage,
  setAuthError,
}) => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Fixio</div>

        <h2>Create account</h2>
        <p className="auth-sub">Join lakhs of happy customers</p>

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              required
              placeholder="Rahul Sharma"
              value={authForm.name}
              onChange={(e) =>
                setAuthForm({ ...authForm, name: e.target.value })
              }
            />
          </div>

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
              placeholder="Create a password"
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
            {authLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <span
            onClick={() => {
              setAuthError("");
              setPage("login");
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;