import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserService from "../service/UserService";

const ListUserComponent = () => {
  const [UserArray, setUserArray] = useState([]);

  useEffect(() => {
    getAllUser();
  }, []);

  function getAllUser() {
    UserService.getAllUser()
      .then((res) => {
        setUserArray(res.data);
        console.log(UserArray);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Users List</h2>
        {/* <div className="mb-3">
          <Link to="/add-user" className="btn btn-primary">
            Add User
          </Link>
        </div> */}
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>User Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {UserArray.map((User) => (
              <tr key={User.id}>
                <td>{User.id}</td>
                <td>{User.username}</td>
                <td>{User.password}</td>
                {/* <td>
                  <Link
                    className="btn btn-info mr-2"
                    to={`/update-user/${User.id}`}
                  >
                    Update
                  </Link>
                  <button className="btn btn-danger">Delete</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListUserComponent;
