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
  const [userExpenses, setUserExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userJSON = JSON.parse(localStorage.getItem("user"));
      const userId = userJSON.id;
      const response = await fetch(`${HOST}/api/users/${userId}`);
      const body = await response.json();
      setUser(body.data);

      const expensesResponse = await fetch(
        `${HOST}/api/users/${userId}/expenses`
      );
      const expensesBody = await expensesResponse.json();
      setUserExpenses(expensesBody.data);

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
              <th>Total money Credited</th>
              <th>Total money Debited</th>
              <th>Current Credit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {user.accounts.map((account) => {
              const { accountId, accountName, initialBalance } = account;
              const accountExpensesCredit = userExpenses.map((expense) => {
                if (expense.account.id === accountId) {
                  return expense.credit;
                }

                return null;
              });

              const accountExpensesDebit = userExpenses.map((expense) => {
                if (expense.account.id === accountId) {
                  return expense.debit;
                }

                return null;
              });

              const totalMoneySpentByAccount = accountExpensesDebit.reduce(
                (acc, curr) => {
                  return acc + curr;
                },
                0
              );

              const totalMoneyCreditedIntoAccount =
                accountExpensesCredit.reduce((acc, curr) => {
                  return acc + curr;
                }, 0);

              return (
                <tr key={accountId} id={accountId}>
                  <td>{accountName}</td>
                  <td>$ {formatMoney(initialBalance)}</td>
                  <td>$ {formatMoney(totalMoneyCreditedIntoAccount)}</td>
                  <td>$ {formatMoney(totalMoneySpentByAccount)}</td>
                  <td>
                    ${" "}
                    {formatMoney(
                      initialBalance -
                        totalMoneySpentByAccount +
                        totalMoneyCreditedIntoAccount
                    )}
                  </td>
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
