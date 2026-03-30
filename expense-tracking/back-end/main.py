from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Expense
#connects frontend to FastAPI on different ports ;p
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
#uvicorn main:app --reload

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
#database sessions
def get_db():
    db = SessionLocal() #make new queries using db
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Backend is working"}

#get all expenses
@app.get("/expenses")
def get_expenses(db: Session = Depends(get_db)):
    return db.query(Expense).all()

#post new expense
@app.post("/expenses")
def create_expense(expense: dict, db: Session = Depends(get_db)):
    new_expense = Expense(**expense)
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

#delete expense
@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense:
        return {"error": "Expense not found"}

    db.delete(expense)
    db.commit()

    return {"message": "Expense deleted successfully"}    
#update expense
@app.put("/expenses/{expense_id}")
def update_expense(expense_id: int, updated_data: dict, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense:
        return {"error": "Expense not found"}

    expense.title = updated_data.get("title")
    expense.amount = updated_data.get("amount")
    expense.category = updated_data.get("category")
    expense.date = updated_data.get("date")
    expense.description = updated_data.get("description")

    db.commit()
    db.refresh(expense)

    return expense