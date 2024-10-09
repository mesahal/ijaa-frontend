import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

const HeaderComponent = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-md navbar p-3 header-container">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              IIT JU Alumni Association
            </a>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ms-auto">
                {" "}
                {/* Use ms-auto for margin-start to push items to the right */}
                {token ? (
                  <li className="nav-item">
                    <Link className="nav-link" to="/logout">
                      Logout
                    </Link>
                  </li>
                ) : (
                  <>
                    {location.pathname === "/register" ? (
                      <li className="nav-item">
                        <Link className="nav-link" to="/">
                          Login
                        </Link>
                      </li>
                    ) : (
                      <li className="nav-item">
                        <Link className="nav-link" to="/register">
                          Sign Up
                        </Link>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default HeaderComponent;
