import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
  }


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
                    <input type="text" name="category" required />
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
