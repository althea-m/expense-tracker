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
  //ass2
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [authMode, setAuthMode] = useState("login");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);  

  //admin fetch
  const fetchAdminData = async () => {
    try {
      const usersResponse = await fetch("http://127.0.0.1:8000/admin/users");
      const usersData = await usersResponse.json();

      const activityResponse = await fetch("http://127.0.0.1:8000/admin/activity");
      const activityData = await activityResponse.json();

      setUsers(usersData);
      setActivities(activityData);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  /*form*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    const expenseData = {
      title: formValues.title,
      amount: parseFloat(formValues.amount),
      category: formValues.category,
      date: formValues.date,
      description: formValues.description,
      user_id: currentUser.id
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
    if (!currentUser) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/expenses?user_id=${currentUser.id}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching expenses:", errorText);
        return;
      }

      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  fetchExpenses();
}, [currentUser]);
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

  //login and registration for ass2
    //login
      const handleLogin = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const loginData = {
          email: formData.get("email"),
          password: formData.get("password")
        };

        try {
          const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
          });

          const data = await response.json();

          if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("currentUser", JSON.stringify(data.user));

            setToken(data.access_token);
            setCurrentUser(data.user);
          } else {
            alert(data.error || "Login failed");
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      };
    //registration
      const handleRegister = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const registerData = {
          username: formData.get("username"),
          email: formData.get("email"),
          password: formData.get("password")
        };

        try {
          const response = await fetch("http://127.0.0.1:8000/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(registerData)
          });

          const data = await response.json();

          if (data.error) {
            alert(data.error);
          } else {
            alert("Registration successful. Please log in.");
            setAuthMode("login");
          }
        } catch (error) {
          console.error("Register error:", error);
        }
      };
    //logout
      const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      setToken("");
      setCurrentUser(null);
      };
    
    //filterexpenses by search term
      const filteredExpenses = expenses.filter((expense) => {
        const search = searchTerm.toLowerCase();

        return (
          expense.title.toLowerCase().includes(search) ||
          expense.category.toLowerCase().includes(search) ||
          expense.date.toLowerCase().includes(search) ||
          (expense.description || "").toLowerCase().includes(search)
        );
      });

//render interface + added login/register forms for ass2
if (!token) {
  return (
    <div className="auth-page">
      <section className="auth-card">
        <h1>Expense Tracker</h1>

        {authMode === "login" ? (
          <>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit">Login</button>
            </form>

            <p>
              No account?{" "}
              <button type="button" onClick={() => setAuthMode("register")}>
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <input type="text" name="username" placeholder="Username" required />
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit">Register</button>
            </form>

            <p>
              Already have an account?{" "}
              <button type="button" onClick={() => setAuthMode("login")}>
                Login
              </button>
            </p>
          </>
        )}
      </section>
    </div>
  );
}
return ( 
    <div>
        <div className="header">
          <h1>Expense Tracker</h1>
          <div className="header-other">
            <span className="welcome-text">
              Welcome, {currentUser?.username}
            </span>
            {currentUser?.role === "admin" && (
              <button
                className="admin-btn"
                onClick={() => {
                  setShowAdminPanel(!showAdminPanel);
                  fetchAdminData();
                }}
              >
                Admin Panel
              </button>
            )}
            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        {showAdminPanel && currentUser?.role === "admin" && (
  <section className="card admin-panel">
    <h4>Admin Panel</h4>

    <h3>User Accounts</h3>
    <div className="admin-list">
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div key={user.id} className="admin-row">
            <span>{user.username}</span>
            <span>{user.email}</span>
            <span>{user.role}</span>
          </div>
        ))
      )}
        </div>
          <h3>User Activity</h3>
            <div className="activity-list">
              {activities.length === 0 ? (
                <p>No activity found.</p>
                ) : (
                  activities.map((activity) => (
                    <div key={activity.id} className="activity-row">
                      <span>User ID: {activity.user_id}</span>
                      <span>{activity.action}</span>
                      <span>{activity.details}</span>
                      <span>{activity.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
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
            <h2>Previous Transactions</h2>
            <input
                type="text"
                className="search-input"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="transactions-scroll">
                {filteredExpenses.length === 0 ? (
                  <p>Womp womp... No transactions found.</p>
                ) : (
                  <div className="transactions-list">
                    {filteredExpenses
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
