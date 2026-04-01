# expense-tracker application
===OVERVIEW===
The Expense Tracker is a full-stack web application that allows users to log, manage, and analyse their personal expenses. The system provides a simple and intuitive interface for tracking spending habits, identifying top expense categories, and visualising monthly expenditure trends. This application is designed to behave as a Single-Page Application (SPA), dynamically updating the interface without reloading pages, ensuring a smooth and seamless user experience.

===FEATURES===
* Add new expense entries (title, category, amount, date, description)
* Edit existing transactions inline
* Delete transactions with confirmation
* View recent transactions in a scrollable list
* Automatically calculated:
* Total expenses
* Number of transactions
* Top spending category
* Visual category breakdown (horizontal bar chart)
* Monthly expenditure summary (bar visualisation)
* Filter monthly data by year
* Responsive and clean dashboard layout
* Icon-based UI for improved usability

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
├── frontend/
│   ├── App.jsx
│   ├── App.css
│   └── components (optional future split)
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│
└── README.md

===
