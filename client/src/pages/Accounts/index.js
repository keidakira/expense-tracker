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
import { NewAccountModal } from "../../components/Modals/NewAccountModal";

const Accounts = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userJSON = JSON.parse(localStorage.getItem("user"));
      const userId = userJSON.id;
      const response = await fetch(`${HOST}/api/users/${userId}`);
      const body = await response.json();
      setUser(body.data);
      setIsLoading(false);
    };

    isLoading && fetchData();
  }, []);

  // Check if user is logged in
  if (!window.localStorage.getItem("user")) {
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
                <tr key={account.card._id}>
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
        <IconButton icon={addIcon} onClick={(e) => setIsModalOpen(true)}>
          <span>Add Account</span>
        </IconButton>
      </div>
      <NewAccountModal
        isModalOpen={isModalOpen}
        toggleModal={setIsModalOpen}
        afterModalClose={() => window.location.reload()}
      />
    </div>
  );
};

export default Accounts;
