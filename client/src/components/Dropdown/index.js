/**
 * This is the UI component for the dropdown.
 */
// CSS Imports
import "./style.css";

// Library Imports
import React from "react";

const Dropdown = ({
  children,
  selected,
  className,
  name,
  label,
  onChange,
  value,
  maxWidth,
  ...props
}) => (
  <div className="select" style={{ width: maxWidth }}>
    <label htmlFor={name}>{label}</label>
    <select
      className={className}
      onChange={onChange}
      value={value}
      id={name}
      name={name}
      {...props}
      defaultValue={selected}
    >
      {children}
    </select>
  </div>
);

export default Dropdown;
