import React, { useEffect, useState } from "react";

import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import IconButton from "../../components/IconButton";

import addIcon from "../../images/icons/add-400.svg";
import "./style.css";

import { HOST, months, years } from "../../utils/constants";
import { formatMoney } from "../../utils/mathf";
import { formatDateToString } from "../../utils/date";
import { NewTransactionModal } from "../../components/Modals/NewTransactionModal";
import Login from "../Login";
import { useRef } from "react";
import Navbar from "../../components/Navbar";

function Expenses() {
  const today = new Date();
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [getTransactions, setGetTransactions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userAccounts, setUserAccounts] = useState([]);
  const [userId, setUserId] = useState(null);

  const getTransactionsButtonRef = useRef(null);

  const currentPage = window.location.pathname;

  // Check if user is logged in
  if (!window.localStorage.getItem("token")) {
    window.location.href = "/";
  }

  useEffect(() => {
    setSelectedTransactions([]);

    if (userId === null) {
      // Get user id from localStorage
      const user = JSON.parse(window.localStorage.getItem("user"));
      setUserId(user.userId);
      return;
    }

    const fetchData = async () => {
      await fetch(`${HOST}/api/expenses/${selectedYear}/${selectedMonth}`)
        .then((res) => res.json())
        .then(
          (result) => {
            setTransactions(result);
          },
          (error) => {
            console.log(error);
          }
        );

      await fetch(`${HOST}/api/users/${userId}`)
        .then((res) => res.json())
        .then((result) => {
          setUserAccounts(result.accounts);
        });
    };

    isLoading && fetchData();

    if (transactions) {
      // Convert array of expenses into array of objects => {id, date, expenses}
      let expenses = [];
      let seen = new Set();
      transactions.forEach((expense) => {
        if (seen.has(expense.date)) {
          expenses.forEach((exp) => {
            if (exp.date === expense.date) {
              exp.expenses.push(expense);
            }
          });
        } else {
          seen.add(expense.date);
          expenses.push({
            date: expense.date,
            expenses: [expense],
          });
        }
      });
      setSelectedTransactions(expenses);
      setIsLoading(false);
    }
  }, [getTransactions, transactions, userId]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleGetTransactions = () => {
    setIsLoading(true);
    setGetTransactions(!getTransactions);
  };

  if (currentPage === "/login") {
    return <Login />;
  }

  if (userId === null) {
    return;
  }

  return (
    <div className="App">
      <Navbar />
      <div className="transactions-selection">
        <Dropdown
          onChange={handleMonthChange}
          selected={selectedMonth}
          maxWidth={180}
        >
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </Dropdown>
        <Dropdown
          onChange={handleYearChange}
          selected={selectedYear}
          maxWidth={180}
        >
          {years.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </Dropdown>
        <Button
          onClick={handleGetTransactions}
          refer={getTransactionsButtonRef}
        >
          <span>Get transactions</span>
        </Button>
      </div>
      <div className="transactions">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th name="account">Account Name</th>
              <th name="credit">Credit</th>
              <th name="debit">Debit</th>
              <th name="balance">Running Balance</th>
              <th>Category</th>
              <th name="notes">Notes</th>
            </tr>
          </thead>
          <tbody>
            {selectedTransactions.length ? (
              selectedTransactions.map(({ date, expenses }) => {
                let number_of_expenses = expenses.length;
                return expenses.map((expense, index) => {
                  return (
                    <tr key={expense._id}>
                      {number_of_expenses > 1 ? (
                        index === 0 && (
                          <td name="date" rowSpan={number_of_expenses}>
                            {formatDateToString(date)}
                          </td>
                        )
                      ) : (
                        <td name="date">{formatDateToString(date)}</td>
                      )}
                      <td
                        name="account"
                        style={{
                          backgroundColor: expense.card.color,
                          color: "white",
                        }}
                      >
                        {expense.card.name}
                      </td>
                      <td name="credit">$ {formatMoney(expense.credit)}</td>
                      <td name="debit">$ {formatMoney(expense.debit)}</td>
                      <td name="balance">$ {formatMoney(expense.balance)}</td>
                      <td>{expense.category}</td>
                      <td name="notes">{expense.notes}</td>
                    </tr>
                  );
                });
              })
            ) : (
              <tr>
                <td colSpan="7">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="balances-list">
        <table className="table">
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Available Credit</th>
            </tr>
          </thead>
          <tbody>
            {userAccounts.length ? (
              userAccounts.map((account) => {
                return (
                  <tr key={account._id}>
                    <td>{account.card.name}</td>
                    <td>$ {formatMoney(account.balance)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="2">No accounts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="add-transaction">
        <IconButton
          icon={addIcon}
          onClick={(e) => setIsModalOpen(!isModalOpen)}
        >
          <span>Add transaction</span>
        </IconButton>
      </div>
      <NewTransactionModal
        isModalOpen={isModalOpen}
        toggleModal={setIsModalOpen}
        afterModalClose={handleGetTransactions}
      />
    </div>
  );
}

export default Expenses;
