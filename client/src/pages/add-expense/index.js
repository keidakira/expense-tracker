/**
 * Add a new expense page
 * It is only available if the user is logged in via mobile device
 */
import React, { useState, useEffect } from "react";

import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import Textarea from "../../components/Textarea";
import Dropdown from "../../components/Dropdown";

import categories from "../../data/categories.json";

import { getNewDate } from "../../utils/date";
import { HOST } from "../../utils/constants";

import "./style.css";
import Button from "../../components/Button";

export const AddExpense = () => {
  // Check if user is logged in
  if (!window.localStorage.getItem("user")) {
    window.location.href = "/";
  }

  const [selectedDate, setSelectedDate] = useState(getNewDate());
  const [credit, setCredit] = useState("");
  const [debit, setDebit] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [account, setAccount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [notes, setNotes] = useState("");

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    clearForm();
  }, []);

  const clearForm = () => {
    // Get all cards of the user
    const getUserCards = async (userId) => {
      const response = await fetch(`${HOST}/api/users/${userId}`);

      const { data } = await response.json();
      return data.accounts;
    };

    getUserCards(userId).then((accounts) => {
      setAccounts(accounts);
    });

    // Clear the form
    setCredit("");
    setDebit("");
    setCategory("Shopping");
    setAccount(accounts.length > 0 ? accounts[0].accountId : "");
    setNotes("");
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
      case "debit":
        setDebit(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "account":
        setAccount(value);
        break;
      case "notes":
        setNotes(value);
        break;
      default:
        alert("Something went wrong");
        break;
    }
  };

  const createTransaction = async () => {
    const transaction = {
      date: selectedDate,
      credit: credit,
      debit: debit,
      category: category,
      accountId: account,
      notes: notes,
    };

    let response = await fetch(`${HOST}/api/users/${userId}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    // If the response is successful, close the modal
    if (response.ok) {
      // Go back to /expenses page
      window.location.href = "/expenses";
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <div className="App">
      <Navbar active="expenses" />
      <div className="add-expense">
        <div className="row">
          <Input
            type="date"
            placeholder="Date"
            name="date"
            label="Date"
            value={selectedDate}
            onChange={handleChange}
          />
          <Dropdown
            onChange={handleChange}
            name="account"
            label="Account"
            value={account}
          >
            {accounts.map((account, index) => (
              <option key={index} value={account.accountId}>
                {account.accountName}
              </option>
            ))}
          </Dropdown>
        </div>
        <div className="row">
          <Input
            type="text"
            placeholder="Credit"
            name="credit"
            label="Credit"
            className="text-right"
            value={credit}
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="Debit"
            name="debit"
            label="Debit"
            className="text-right"
            value={debit}
            onChange={handleChange}
          />
        </div>
        <div className="row">
          <Dropdown
            onChange={handleChange}
            name="category"
            label="Category"
            value={category}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </Dropdown>
        </div>
        <div>
          <Textarea
            type="textarea"
            placeholder="Notes"
            name="notes"
            label="Notes"
            value={notes}
            onChange={handleChange}
          />
        </div>
        <Button onClick={createTransaction}>Add Expense</Button>
      </div>
    </div>
  );
};
