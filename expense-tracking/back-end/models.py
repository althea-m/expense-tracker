from sqlalchemy import Column, Integer, String, Date, Numeric, Text, TIMESTAMP, ForeignKey
from database import Base

#expense class
class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    category = Column(String(50), nullable=False)
    date = Column(Date, nullable=False)
    description = Column(Text)
    #fix
    user_id = Column(Integer, ForeignKey("users.id"))
    
#assignment 2 code:
#user class
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="user")
    created_at = Column(TIMESTAMP)

#user activity class
class UserActivity(Base):
    __tablename__ = "user_activity"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(100), nullable=False)
    details = Column(Text)
    timestamp = Column(TIMESTAMP)