/**
 * Logout page
 */
import React from "react";

const Logout = () => {
  // Check if user is logged in
  if (window.localStorage.getItem("token")) {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
  }

  window.location.href = "/";

  return (
    <div className="logout-page">
      <h1>Logout</h1>
      <p>You are now logged out</p>
    </div>
  );
};

export default Logout;
