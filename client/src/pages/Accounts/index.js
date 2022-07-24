// React libraries
import React, { useState, useEffect } from "react";

// Custom components
import Navbar from "../../components/Navbar";
import addIcon from "../../images/icons/add-400.svg";

// Stylesheet
import "./styles.css";

// Utils
import { HOST } from "../../utils/constants";
import { formatMoney } from "../../utils/mathf";
import IconButton from "../../components/IconButton";

const Accounts = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userJSON = JSON.parse(localStorage.getItem("user"));
      const userId = userJSON.userId;
      const response = await fetch(`${HOST}/api/users/${userId}`);
      const body = await response.json();
      setUser(body);
      setIsLoading(false);
    };

    isLoading && fetchData();
  }, []);

  // Check if user is logged in
  if (!window.localStorage.getItem("token")) {
    window.location.href = "/";
  }

  if (isLoading) {
    return (
      <div className="App">
        <Navbar active="accounts" />
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar active="accounts" />
      <div className="accounts-container">
        <table width="50%" className="table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Initial Credit</th>
              <th>Current Credit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {user.accounts.map((account) => {
              return (
                <tr>
                  <td>{account.card.name}</td>
                  <td>$ {formatMoney(account.initial_balance)}</td>
                  <td>$ {formatMoney(account.balance)}</td>
                  <td className="actions">
                    <span>Edit</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="add-account">
        <IconButton icon={addIcon}>
          <span>Add Account</span>
        </IconButton>
      </div>
    </div>
  );
};

export default Accounts;
