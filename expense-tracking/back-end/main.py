from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Expense
#connects frontend to FastAPI on different ports ;p
from fastapi.middleware.cors import CORSMiddleware

#ass2
from models import Expense, User, UserActivity
from authentication import hash_password, verify_password, create_access_token
from models import User

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
def get_expenses(user_id: int, db: Session = Depends(get_db)):
    return db.query(Expense).filter(
        Expense.user_id == user_id
    ).all()

#post new expense
#@app.post("/expenses")
#def create_expense(expense: dict, db: Session = Depends(get_db)):
    new_expense = Expense(**expense)
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

@app.post("/expenses")
def create_expense(expense: dict, db: Session = Depends(get_db)):
    new_expense = Expense(**expense)
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    if new_expense.user_id:
        activity = UserActivity(
            user_id=new_expense.user_id,
            action="CREATE_EXPENSE",
            details=f"Created expense: {new_expense.title}"
        )
        db.add(activity)
        db.commit()

    return new_expense

#delete expense
#@app.delete("/expenses/{expense_id}")
#def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense:
        return {"error": "Expense not found"}

    db.delete(expense)
    db.commit()

    return {"message": "Expense deleted successfully"}    

@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense:
        return {"error": "Expense not found"}

    user_id = expense.user_id
    title = expense.title

    db.delete(expense)
    db.commit()

    if user_id:
        activity = UserActivity(
            user_id=user_id,
            action="DELETE_EXPENSE",
            details=f"Deleted expense: {title}"
        )
        db.add(activity)
        db.commit()

    return {"message": "Expense deleted successfully"}

#update expense
#@app.put("/expenses/{expense_id}")
#def update_expense(expense_id: int, updated_data: dict, db: Session = Depends(get_db)):
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

    if expense.user_id:
        activity = UserActivity(
            user_id=expense.user_id,
            action="UPDATE_EXPENSE",
            details=f"Updated expense: {expense.title}"
        )
        db.add(activity)
        db.commit()

    return expense

#register user
@app.post("/register")
def register(user: dict, db: Session = Depends(get_db)):

    #debug
    print("FULL USER BODY:", user)
    print("PASSWORD VALUE:", user.get("password"))
    print("PASSWORD TYPE:", type(user.get("password")))
    print("PASSWORD LENGTH:", len(user.get("password")))
    
    existing_user = db.query(User).filter(User.email == user["email"]).first()

    if existing_user:
        return {"error": "Email already registered"}

    new_user = User(
        username=user["username"],
        email=user["email"],
        hashed_password=hash_password(user["password"]),
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "username": new_user.username
    }

#login 
@app.post("/login")
def login(user: dict, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user["email"]).first()

    if not db_user:
        return {"error": "Invalid email or password"}

    if not verify_password(user["password"], db_user.hashed_password):
        return {"error": "Invalid email or password"}

    token = create_access_token({
        "sub": db_user.email,
        "user_id": db_user.id,
        "role": db_user.role
    })

    activity = UserActivity(
        user_id=db_user.id,
        action="LOGIN",
        details=f"{db_user.username} logged in"
    )

    db.add(activity)
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
            "role": db_user.role
        }
    }


#admin viewing
#user
@app.get("/admin/users")
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all()
#activity
@app.get("/admin/activity")
def get_activity(db: Session = Depends(get_db)):
    return db.query(UserActivity).all()
#delete user
@app.delete("/admin/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return {"error": "User not found"}

    db.query(UserActivity).filter(UserActivity.user_id == user_id).delete()
    db.query(Expense).filter(Expense.user_id == user_id).delete()

    db.delete(user)
    db.commit()

    return {"message": "User and related records deleted successfully"}