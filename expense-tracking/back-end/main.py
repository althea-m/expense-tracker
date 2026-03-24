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
    