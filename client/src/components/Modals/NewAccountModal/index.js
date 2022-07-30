import React, { useEffect, useState } from "react";

import Modal from "../../Modal";
import Input from "../../Input";
import Dropdown from "../../Dropdown";

import { getNewDate } from "../../../utils/date";
import { HOST } from "../../../utils/constants";

const user = localStorage.getItem("user");
const userId = user ? JSON.parse(user).id : null;

export const NewAccountModal = ({
  isModalOpen,
  toggleModal: setIsModalOpen,
  afterModalClose,
}) => {
  const [selectedDate, setSelectedDate] = useState(getNewDate());
  const [credit, setCredit] = useState("");
  const [account, setAccount] = useState("");
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    clearForm();
  }, [isModalOpen]);

  const clearForm = () => {
    // Get all cards of the user
    const getUserCards = async () => {
      const response = await fetch(`${HOST}/api/accounts`);

      return await response.json();
    };

    getUserCards(userId).then((accounts) => {
      setAccounts(accounts.data);
    });

    // Clear the form
    setCredit("");
    setAccount(accounts.length > 0 ? accounts[0].id : "");
    setSelectedDate(getNewDate());
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {
      case "date":
        setSelectedDate(value);
        break;
      case "credit":
        setCredit(value);
        break;
      case "account":
        setAccount(value);
        break;
      default:
        alert("Something went wrong");
        break;
    }
  };

  const addAccountToUser = async () => {
    const transaction = {
      accountId: account,
      initialBalance: credit,
      dateOfInitialBalance: selectedDate,
    };
    console.log(transaction);

    let response = await fetch(`${HOST}/api/users/${userId}/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    // If the response is successful, close the modal
    if (response.ok) {
      afterModalClose();
      setIsModalOpen(false);
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <Modal
      title={"Add a new account"}
      isOpen={isModalOpen}
      okAction={addAccountToUser}
      onClose={(e) => setIsModalOpen(!isModalOpen)}
    >
      <div className="row">
        <Dropdown
          onChange={handleChange}
          name="account"
          label="Account"
          value={account}
        >
          {accounts.map((account, index) => (
            <option key={index} value={account.id}>
              {account.name}
            </option>
          ))}
        </Dropdown>
      </div>
      <div className="row">
        <Input
          type="text"
          placeholder="Current Credit"
          name="credit"
          label="Credit"
          className="text-right"
          value={credit}
          onChange={handleChange}
        />
        <Input
          type="date"
          placeholder="Date"
          name="date"
          label="Date"
          value={selectedDate}
          onChange={handleChange}
        />
      </div>
    </Modal>
  );
};
