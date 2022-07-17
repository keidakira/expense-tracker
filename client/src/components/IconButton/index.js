/**
 * This is the UI component for the icon button.
 */
// CSS Imports
import "./style.css";

// Library Imports
import React from "react";

const IconButton = ({ children, icon, className, onClick, ...props }) => (
  <button className={className} onClick={onClick} {...props}>
    <img src={icon} alt="icon" width={16} />
    {children}
  </button>
);

export default IconButton;
