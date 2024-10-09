import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"; // Import custom styles

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added confirmPassword
  const [registrationNo, setRegistrationNo] = useState(""); // Added registrationNo
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const navigate = useNavigate();

  async function save(event) {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match"); // Set the error message
      setSuccessMessage(""); // Clear success message if there's an error
      return;
    } else {
      setErrorMessage(""); // Clear the error message if passwords match
    }

    try {
      await axios
        .post("http://localhost:8081/ijaa/register", {
          username: username,
          email: email,
          password: password,
          registrationNo: registrationNo, // Added registrationNo to payload
        })
        .then(
          (res) => {
            console.log(res.data);
            if (res.data === "Successfully registered") {
              setSuccessMessage("User Registration Successful"); // Set success message
              setErrorMessage(""); // Clear any error message
              // Optionally redirect after a delay
              setTimeout(() => {
                navigate("/");
              }, 2000);
            } else if (res.data === "username already exists") {
              setErrorMessage("Username already exists");
              setSuccessMessage(""); // Clear success message if there's an error
            } else if (res.data.message === "Invalid Email") {
              setErrorMessage("Invalid Email");
              setSuccessMessage(""); // Clear success message if there's an error
            } else {
              setErrorMessage(res.data.message);
              setSuccessMessage(""); // Clear success message if there's an error
            }
          },
          (fail) => {
            console.error(fail);
            setErrorMessage(fail.response.data);
            setSuccessMessage(""); // Clear success message if there's an error
          }
        );
    } catch (err) {
      setErrorMessage(err.message);
      setSuccessMessage(""); // Clear success message if there's an error
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-header">Sign Up</h1>
        <hr />
        <form>
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
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Registration Number</label>{" "}
            {/* Added registrationNo field */}
            <input
              type="text"
              className="form-control"
              placeholder="Enter Registration No"
              value={registrationNo}
              onChange={(event) => setRegistrationNo(event.target.value)}
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

          <div className="form-group">
            <label>Confirm Password</label> {/* Added confirmPassword field */}
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {/* Error message for validation */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* Success message for successful registration */}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block mt-4"
            onClick={save}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
