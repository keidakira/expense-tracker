/**
 * This is the UI component for the button.
 */
// CSS Imports
import "./style.css";

// Library Imports
import React from "react";

const OutlinedButton = ({ children, className, onClick, ...props }) => (
  <button className={`outlined-btn ${className}`} onClick={onClick} {...props}>
    {children}
  </button>
);

export default OutlinedButton;
