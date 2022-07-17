/**
 * This is the UI component for the button.
 */
// CSS Imports
import "./style.css";

// Library Imports
import React from "react";

const Button = ({ children, className, onClick, ...props }) => {
  let classes = className === undefined ? "" : className;
  if (props.fullwidth) {
    classes += classes === "" ? "full-width" : " full-width";
  }

  return (
    <button className={classes} onClick={onClick} {...props} ref={props.refer}>
      {children}
    </button>
  );
};

export default Button;
