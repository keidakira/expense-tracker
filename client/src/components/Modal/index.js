import React from "react";
import Button from "../Button";
import OutlinedButton from "../OutlinedButton";
import "./style.css";

const Modal = ({ isOpen, onClose, okAction, title, children }) => {
  const handleClose = (e) => {
    if (e.target.className === "modal show") {
      onClose();
    }
  };

  return (
    <div className={`modal ${isOpen ? "show" : "hide"}`} onClick={handleClose}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <div>
            <OutlinedButton onClick={onClose}>
              <span>Close</span>
            </OutlinedButton>
            <Button onClick={okAction}>
              <span>Create</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
