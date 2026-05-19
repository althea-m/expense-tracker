from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

#assignment 2 code:
#secret key
SECRET_KEY = "psps-secret-key"

#algorithm
ALGORITHM = "HS256"

#token expiration time
ACCESS_TOKEN_EXPIRE_MINUTES = 30

#password hashing - fixed!
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

#function to hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)  

#function to verify password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

#token creation function
def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt