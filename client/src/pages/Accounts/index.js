import React from "react";
import Navbar from "../../components/Navbar";

const Accounts = () => {
  // Check if user is logged in
  if (!window.localStorage.getItem("token")) {
    window.location.href = "/";
  }
  return (
    <div className="App">
      <Navbar active="accounts" />
      <p>This is accounts page</p>
    </div>
  );
};

export default Accounts;
