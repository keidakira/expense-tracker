/**
 * This is the UI component for the icon button.
 */
// CSS Imports
import "./style.css";

// Library Imports
import React from "react";

const IconButton = ({
  children,
  IconElement,
  className,
  onClick,
  ...props
}) => {
  return (
    <button className={className} onClick={onClick} {...props}>
      <IconElement />
      {children}
    </button>
  );
};

export default IconButton;
