/**
 * Navbar component
 */
import React from "react";
import { Link } from "react-router-dom";

import logo from "../../images/logo.png";
import { MdClose, MdOutlineMenu } from "react-icons/md";

import "./style.css";

const Navbar = ({ active }) => {
  const handleSidebar = (event) => {
    event.preventDefault();
    const sidebar = document.querySelector(".navbar-mobile-sidebar-menu");
    sidebar.classList.toggle("show");

    // Disable scroll
    const body = document.querySelector("body");
    body.classList.toggle("no-scroll");
  };

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
          <Link to="#" className="more-items" onClick={handleSidebar}>
            <MdOutlineMenu />
          </Link>
        </div>
      </div>
      <div className="navbar-mobile-sidebar-menu">
        <span className="close-btn" onClick={handleSidebar}>
          <MdClose />
        </span>
        <Link to="/add-expense">
          <span className="navbar-menu-button">Add Expense</span>
        </Link>
        <Link to="/expenses" className={active === "expenses" ? "active" : ""}>
          <span className="navbar-menu-button">Expenses</span>
        </Link>
        <Link to="/accounts" className={active === "accounts" ? "active" : ""}>
          <span className="navbar-menu-button">Accounts</span>
        </Link>
        <Link to="/logout">
          <span className="navbar-menu-button">Logout</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
