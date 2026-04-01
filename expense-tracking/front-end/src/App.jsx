import { useEffect, useState } from 'react'
import './App.css'
import { Trash2, Pencil } from "lucide-react";

function App() {
  /*const [count, setCount] = useState(0)
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
  }*/
  const [expenses, setExpenses] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [editingExpense, setEditingExpense] = useState(null);
  /*form*/
const handleSubmit = async (e) => {
  e.preventDefault();

  const expenseData = {
    title: formValues.title,
    amount: parseFloat(formValues.amount),
    category: formValues.category,
    date: formValues.date,
    description: formValues.description
  };

  try {
    if (editingExpense) {
      const response = await fetch(`http://127.0.0.1:8000/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenseData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend update error:', errorText);
        return;
      }

      const updatedExpense = await response.json();

      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === editingExpense.id ? updatedExpense : expense
        )
      );

      setEditingExpense(null);
    } else {
      const response = await fetch('http://127.0.0.1:8000/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenseData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend add error:', errorText);
        return;
      }

      const data = await response.json();
      setExpenses((prevExpenses) => [...prevExpenses, data]);
    }

    setFormValues({
      title: "",
      amount: "",
      category: "Food",
      date: "",
      description: ""
    });
  } catch (error) {
    console.error('Error saving expense:', error);
  }
};
//recent transactions
useEffect(() => {
  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  fetchExpenses();
}, []);
//top part
//total expenses
const totalExpenses = expenses.reduce((total, expense) => {
  return total + Number(expense.amount);
}, 0);
//no. transactions
//top cat
  //total amountsper category
    const categoryTotals = expenses.reduce((totals, expense) => {
      const category = expense.category;
      totals[category] = (totals[category] || 0) + Number(expense.amount);
      return totals;
    }, {});
    //find category with highest total
      const topCategory =
        Object.keys(categoryTotals).length === 0
          ? "N/A"
          : Object.entries(categoryTotals).reduce((top, current) =>
              current[1] > top[1] ? current : top
            )[0];
//monthly summary
  //monthly totals
    //filtering by month

    const availableYears = [
    "All",
    ...new Set(
      expenses.map((expense) => new Date(expense.date).getFullYear().toString())
    ),
  ].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return b - a;
  });

    const monthlyTotals = expenses.reduce((totals, expense) => {
      const date = new Date(expense.date);

      const year = date.getFullYear();
      const month = date.getMonth(); // 0 = Jan, 1 = Feb...

      const key = `${year}-${String(month).padStart(2, '0')}`; // sortable key

      const label = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!totals[key]) {
        totals[key] = { label, total: 0, year };
      }

      totals[key].total += Number(expense.amount);

      return totals;
    }, {});
  //conv array of {monthYear, total}
    const monthlyArray = Object.entries(monthlyTotals)
      .filter(([, value]) =>
        selectedYear === "All" ? true : value.year.toString() === selectedYear
      )
      .sort((a, b) => {
        const [yearA, monthA] = a[0].split("-").map(Number);
        const [yearB, monthB] = b[0].split("-").map(Number);

        if (yearA !== yearB) return yearB - yearA;
        return monthB - monthA;
      });
    //adding cuz looks cool like category breakdown
    const maxMonthlyTotal = monthlyArray.length > 0
      ? Math.max(...monthlyArray.map(([, value]) => value.total))
      : 0;
  
  //category breakdown --> reuse categoryTotals
  const categoryArray = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  //for visualization of category breakdown, find max total to set 100% width
  const maxCategoryTotal = categoryArray.length > 0 ? categoryArray[0][1] : 0;

  //delete transaction
    const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend delete error:', errorText);
        return;
      }

      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== id)
      );
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };
//edit
  const [formValues, setFormValues] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
    description: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormValues({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description || ""
    });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setFormValues({
      title: "",
      amount: "",
      category: "Food",
      date: "",
      description: ""
    });
  };
//render interface
  return (
    <div>
        <div className="header">
          <h1>Expense Tracker</h1>
        </div>
        <div className="topbar">
          <div className="total-expenses">
            <section className="card">
              <h2>Total Expenses: ${totalExpenses.toFixed(2)}</h2>
            </section>
          </div>
          <div className="top-categories">
            <section className="card">
              <h2>Top Category: {topCategory}</h2>
            </section>
          </div>  
          <div className="transaction-number">
            <section className="card">
              <h2>Number of Transactions: {expenses.length}</h2>
            </section>
          </div>

        </div>
        <div className="container">
          <div className="container-left">
            <section className="card">
              <h2>Add Transaction</h2>
                <form id="transaction-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                  <label>
                    Title:
                  </label>
                    <input type="text" name="title" value={formValues.title} onChange={handleInputChange}required />
                  </div>
                  <div className="form-row">
                  <label>
                    Amount:
                  </label>
                    <input type="number" name="amount" step="0.01" value={formValues.amount} onChange={handleInputChange} required />
                  </div>
                  <div className="form-row">
                  <label>
                    Category:
                  </label>
                    <select name="category" value={formValues.category} onChange={handleInputChange} required>
                      <option value="Food">Food</option>
                      <option value="Bills">Bills</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-row">
                  <label>
                    Date:
                  </label>
                    <input type="date" name="date" value={formValues.date} onChange={handleInputChange} required />
                  </div>
                  <div className="form-row">
                  <label>
                    Description:
                  </label>
                    <textarea name="description" value={formValues.description} onChange={handleInputChange} rows="3"></textarea>
                  </div>
                  <div className="form-buttons">
                    <button id="add-transaction-btn" type="submit">
                      {editingExpense ? "Update" : "Add"}
                    </button>

                    {editingExpense && (
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
            </section>
            <section className="card">

            <h2>Recent Transactions</h2>
              <div className="transactions-scroll">
                {expenses.length === 0 ? (
                  <p>No transactions found.</p>
                ) : (
                  <div className="transactions-list">
                    {expenses
                      .slice()
                      .reverse()
                      .map((expense) => (
                        <div key={expense.id} className="transaction-item">
                          <div className="transaction-row">
                            <div className="transaction-left">
                              <strong>{expense.title}</strong>
                              <span>| {expense.category}</span>
                              <span>| {expense.date}</span>
                            </div>

                            <div className="transaction-actions">
                                  <span className="transaction-right">
                                    ${Number(expense.amount).toFixed(2)}
                                  </span>
                                  <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(expense)}
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    className="delete-btn"
                                    onClick={() => {
                                      const confirmed = window.confirm('Delete this transaction?');
                                      if (confirmed) {
                                        handleDelete(expense.id);
                                      }
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                            </div>
                          </div>
                          {expense.description && (
                            <div className="transaction-description">
                              {expense.description}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </section>
        </div>
        
          <div className="container-right">
            <section className="card">
              <div className="monthly-header">
                <h2>Monthly Summary</h2>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="year-filter"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {monthlyArray.length === 0 ? (
                <p>No monthly data.</p>
              ) : (
                <div className="monthly-list">
                  {monthlyArray.map(([key, value]) => {
                    const percentage =
                      maxMonthlyTotal > 0 ? (value.total / maxMonthlyTotal) * 100 : 0;

                    return (
                      <div key={key} className="monthly-item">
                        <div className="monthly-label-row">
                          <span>{value.label}</span>
                          <strong>${value.total.toFixed(2)}</strong>
                        </div>

                        <div className="monthly-bar-bg">
                          <div
                            className="monthly-bar-fill"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
              <section className="card">
                <h2>Category Breakdown</h2>

                {categoryArray.length === 0 ? (
                  <p>No category data.</p>
                ) : (
                  <div className="category-list">
                    {categoryArray.map(([category, total]) => {
                      const percentage = maxCategoryTotal > 0 ? (total / maxCategoryTotal) * 100 : 0;

                      return (
                        <div key={category} className="category-item">
                          <div className="category-label-row">
                            <span>{category}</span>
                            <strong>${total.toFixed(2)}</strong>
                          </div>

                          <div className="category-bar-bg">
                            <div
                              className="category-bar-fill"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
          </div>
        </div>
    </div>
  )
}

export default App
