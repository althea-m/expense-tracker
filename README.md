# expense-tracker application
===OVERVIEW===
The Expense Tracker is a full-stack web application that allows users to log, manage, and analyse their personal expenses. The system provides a simple and intuitive interface for tracking spending habits, identifying top expense categories, and visualising monthly expenditure trends. This application is designed to behave as a Single-Page Application (SPA), dynamically updating the interface without reloading pages, ensuring a smooth and seamless user experience.

## how to run
  *backend
    cd backend
    uvicorn main:app --reload
  *frontend
    cd frontend
    npm install
    npm run dev

===FEATURES===
## Expense Management
- Add new expense entries
  - Title
  - Category
  - Amount
  - Date
  - Description
- Edit existing transactions inline
- Delete transactions with confirmation
- User-specific expense tracking
- Scrollable recent transaction history

---

## Authentication & Security
- User registration system
- User login/logout
- Password hashing using bcrypt
- JWT-based authentication
- Persistent login using localStorage
- User roles (admin / user)

---

## Dashboard Analytics
- Automatically calculated:
  - Total expenses
  - Number of transactions
  - Top spending category
- Monthly expenditure summary
- Filter monthly data by year
- Visual category breakdown
- Horizontal expenditure bar charts
- Responsive dashboard layout

---

## Search & Filtering
- Live transaction search
- Real-time filtering while typing
- Search by:
  - Title
  - Category
  - Date
  - Description

---

## Admin Panel
- View all registered users
- View user activity logs
- Monitor:
  - Login activity
  - Expense creation
  - CRUD operations
- Delete user accounts
- Automatically remove related user expenses and activity records

---
===TECHNICAL===
#frontend
* React
* Javascript
* CSS
* lucide-react (icons)

#backend
* FastAPI
* SQLAlchemy
* MySQL
* RestAPI

===CRUD-OPERATIONS===
* Create -> Add new expense 
* Read -> Retrieve all expenses 
* Update -> Edit existing expense 
* Delete -> Remove expense

===FILE-STRUCTURE===
🧩 Application Structure
expense-tracker/
│
├── front-end/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── back-end/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── authentication.py
│   └── requirements.txt
│
├── expense_tracker_export.sql
│
├── .gitignore
│
└── README.md

===
