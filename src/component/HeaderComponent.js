import React from "react";
import { Link, useLocation } from "react-router-dom";

const HeaderComponent = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark p-3">
          <div>
            <a className="navbar-brand m-5" href="">
              IIT JU Alumni Association
            </a>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              {token ? (
                // If user is logged in, show the Logout button
                <li className="nav-item">
                  <Link className="nav-link" to="/logout">
                    Logout
                  </Link>
                </li>
              ) : (
                <>
                  {location.pathname === "/register" ? (
                    // If user is on the Register page, show the Login button
                    <li className="nav-item">
                      <Link className="nav-link" to="/">
                        Login
                      </Link>
                    </li>
                  ) : (
                    // If user is not logged in and not on the Register page, show the Register button
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">
                        Register
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default HeaderComponent;
