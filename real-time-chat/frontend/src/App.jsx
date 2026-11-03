import { useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import { API_URL, apiRequest } from "./api";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const endpoint = isLogin
        ? `${API_URL}/api/auth/login`
        : `${API_URL}/api/auth/register`;

      const data = await apiRequest(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (isLogin) {
        setLoggedInUser({ ...data.user, accessToken: data.token });
      } else {
        setIsLogin(true);
        setFormData((previous) => ({ ...previous, password: "" }));
        setMessage("Account created. You can now sign in.");
      }
    } catch (error) {
      setMessage(error.message || "Unable to connect to the server");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loggedInUser) {
    return (
      <Dashboard
        user={loggedInUser}
        onLogout={() => setLoggedInUser(null)}
      />
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <h1>ChatConnect</h1>
          <p>REAL-TIME CHAT &amp; GROUP COMMUNICATION</p>
        </div>
        <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
        <p className="auth-intro">{isLogin ? "Sign in to continue to your workspace." : "Join your team and start a conversation."}</p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        {message && <p className={`message ${message.startsWith("Account created") ? "success" : ""}`} role="status">{message}</p>}

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="switch-button"
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;