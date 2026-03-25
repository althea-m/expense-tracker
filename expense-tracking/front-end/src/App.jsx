import { useState } from 'react'
import './App.css'

function App() {
  /*const [count, setCount] = useState(0)
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
  }*/
  const [expenses, setExpenses] = useState([]);
  /*form*/
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const newExpense = {
    title: formData.get('title'),
    amount: parseFloat(formData.get('amount')),
    category: formData.get('category'),
    date: formData.get('date'),
    description: formData.get('description')
  };

  try {
    console.log('Sending expense:', newExpense);

    const response = await fetch('http://127.0.0.1:8000/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newExpense)
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return;
    }

    const data = await response.json();
    console.log('Expense added:', data);

    setExpenses((prevExpenses) => [...prevExpenses, data]);
    e.target.reset();
  } catch (error) {
    console.error('Error adding expense:', error);
  }
};
  


  return (
    <div>
        <div className="header">
          <h1>Expense Tracker</h1>
        </div>
        <div className="topbar">
          <div className="total-expenses">
            <section className="card">
              <h2>Total Expenses</h2>
            </section>
          </div>
          <div className="top-categories">
            <section className="card">
              <h2>Top Category</h2>
            </section>
          </div>  
          <div className="transaction-number">
            <section className="card">
              <h2>Number of Transactions</h2>
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
                    <input type="text" name="title" required />
                  </div>
                  <div className="form-row">
                  <label>
                    Amount:
                  </label>
                    <input type="number" name="amount" required />
                  </div>
                  <div className="form-row">
                  <label>
                    Category:
                  </label>
                    <select name="category" required>
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
                    <input type="date" name="date" required />
                  </div>
                  <div className="form-row">
                  <label>
                    Description:
                  </label>
                    <textarea name="description" rows="3"></textarea>
                  </div>
                  <button id="add-transaction-btn" type="submit">Add</button>
                </form>
            </section>
            <section className="card">
              <h2>Recent Transactions</h2>
            </section>
          </div>
          
          <div className="container-right">
            <section className="card">
              <h2>Monthly Summary</h2>
              
            </section>
            <section className="card">
              <h2>Category Breakdown</h2>
            </section>
          </div>
        </div>
    </div>
  )
}

export default App
