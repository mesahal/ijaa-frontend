import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Import custom styles

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/users"); // Redirect to users list if logged in
    }
  }, [navigate]);

  async function login(event) {
    event.preventDefault();
    try {
      await axios
        .post("http://localhost:8081/ijaa/login", {
          username: username,
          password: password,
        })
        .then((res) => {
          const token = res.data;
          if (token == "User is not active") {
            setErrorMessage("User is not active"); // Set error message on failure
          } else if (token == "Wrong username or password") {
            setErrorMessage("Invalid username or password"); // Set error message on failure
          } else {
            localStorage.setItem("token", token);
            navigate("/users");
          }
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage("Login failed. Please try again."); // Handle server or network error
        });
    } catch (err) {
      setErrorMessage("An error occurred: " + err);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Login</h2>
          <hr />
        </div>

        <div className="login-body">
          {/* Show error message if it exists */}
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}

          <form onSubmit={login}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
