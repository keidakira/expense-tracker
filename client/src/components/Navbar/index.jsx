/**
 * Navbar component
 */
import React from "react";
import { Link } from "react-router-dom";

import logo from "../../images/logo.png";

import "./style.css";

const Navbar = ({ active }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="logo" width={48} />
            <span>Expense Tracker</span>
          </Link>
        </div>
        <div className="navbar-menu">
          <Link
            to="/expenses"
            className={active === "expenses" ? "active" : ""}
          >
            <span className="navbar-menu-button">Expenses</span>
          </Link>
          <Link
            to="/accounts"
            className={active === "accounts" ? "active" : ""}
          >
            <span className="navbar-menu-button">Accounts</span>
          </Link>
          <Link to="/logout">
            <span className="navbar-menu-button">Logout</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
