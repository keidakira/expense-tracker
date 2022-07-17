import React from "react";
import "./style.css";

const Textarea = ({
  rows,
  placeholder,
  className,
  name,
  label,
  value,
  onChange,
  ...props
}) => (
  <div className="textarea">
    <label htmlFor={name}>{label}</label>
    <textarea
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  </div>
);

export default Textarea;
