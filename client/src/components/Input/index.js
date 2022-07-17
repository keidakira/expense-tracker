import React from "react";
import "./style.css";

const Input = ({
  type,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  className,
  label,
  ...props
}) => (
  <div className="input">
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      onKeyUp={onChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  </div>
);

export default Input;
