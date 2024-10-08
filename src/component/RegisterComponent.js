import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // Import custom styles

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added confirmPassword
  const [registrationNo, setRegistrationNo] = useState(""); // Added registrationNo
  const [errorMessage, setErrorMessage] = useState(""); // Added errorMessage state
  const navigate = useNavigate();

  async function save(event) {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match"); // Set the error message
      return;
    } else {
      setErrorMessage(""); // Clear the error message if passwords match
    }

    try {
      await axios
        .post("http://localhost:8080/api/register", {
          userName: username,
          email: email,
          password: password,
          registrationNo: registrationNo, // Added registrationNo to payload
        })
        .then(
          (res) => {
            console.log(res.data);
            if (res.data.status === true) {
              alert("User Registration Successful");
              navigate("/");
            } else if (res.data.message === "Invalid Email") {
              setErrorMessage("Invalid Email");
            } else {
              setErrorMessage(res.data.message);
            }
          },
          (fail) => {
            console.error(fail);
            setErrorMessage(fail.response.data);
          }
        );
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-header">Register</h1>
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

          {/* Error message for password mismatch */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-block mt-4"
            onClick={save}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
