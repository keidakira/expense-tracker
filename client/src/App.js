// In-built libraries
import React from "react";

// Style Imports
import "./App.css";

// Components
import Login from "./pages/Login";
import Expenses from "./pages/Expenses";

// External Libraries
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";
import Logout from "./pages/Logout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
