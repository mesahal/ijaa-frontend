import React, { useState, useEffect } from "react";
import UserService from "../service/UserService";
import { Link, useNavigate } from "react-router-dom";

const AddUserComponent = () => {
  const [firstName, setFirstName] = useState("Firstname");
  const [lastName, setLastName] = useState("Lastname");
  const [email, setEmail] = useState("example@gmail.com");
  const navigate = useNavigate();

  const UserData = { firstName, lastName, email };

  function saveUser(e) {
    e.preventDefault();
    if (
      UserData.firstName !== "" &&
      UserData.lastName !== "" &&
      UserData.email !== ""
    ) {
      UserService.saveUser(UserData)
        .then(navigate("/User"))
        .catch((e) => console.log(e));
    } else {
      alert("Please, fill in all emplty");
    }
  }

  return (
    <div>
      <div className="container mt-5">
        <div className="row">
          <div className="card col-md-6 offset-md-3">
            <h2 className="text-center">Add User</h2>
            <div className="card-body">
              <form>
                <div className="form-group mb-2">
                  <input
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    placeholder="Enter First Name"
                  />
                </div>
                <div className="form-group mb-2">
                  <input
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    placeholder="Enter Last Name"
                  />
                </div>
                <div className="form-group mb-2">
                  <input
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    placeholder="Enter Email"
                  />
                </div>
                <button
                  onClick={(e) => saveUser(e)}
                  className="btn btn-success"
                >
                  Save
                </button>{" "}
                <Link to={"/User"} className="btn btn-danger" href="">
                  Cancel
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserComponent;
