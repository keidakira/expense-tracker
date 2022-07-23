/**
 * Login UI page
 */
import React, { useState } from "react";
import { useRef } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import SubHeading from "../../components/SubHeading";
import { HOST } from "../../utils/constants";

import "./style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const buttonRef = useRef(null);

  // Check if user is logged in
  if (window.localStorage.getItem("token")) {
    window.location.href = "/expenses";
    return;
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const disableButton = () => {
    buttonRef.current.textContent = "Logging in...";
    buttonRef.current.classList.add("is-loading");
  };

  const enableButton = () => {
    buttonRef.current.textContent = "Login";
    buttonRef.current.classList.remove("is-loading");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    disableButton();

    // Fetch request to /api/auth/login
    fetch(`${HOST}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          // Set token in localStorage
          const { token, userId, email } = res.data;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify({ userId, email }));

          // Redirect to /expenses
          window.location.href = "/expenses";
        } else {
          alert(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        enableButton();
      });
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="login-header">
          <SubHeading text="Have an account? Login" textCenter />
        </div>
        <div className="login-body">
          <Input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleInput}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleInput}
          />
          <Button onClick={handleSubmit} fullwidth="true" refer={buttonRef}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
