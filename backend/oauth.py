"""Authentication module for users authentication and authorization.
"""

from datetime import datetime, timezone, timedelta

from jose import JWTError, jwt
from fastapi import Request, HTTPException, status, Depends, WebSocket
from sqlalchemy.orm import Session
from config import Config
from models import get_db, User


SECRET_KEY = Config.SECRET_KEY
ALGORITHM = Config.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = Config.ACCESS_TOKEN_EXPIRE_MINUTES


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return encoded_jwt

def verify_access_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get('user_id')

        if user_id is None:
            raise credentials_exception

        return user_id
    except JWTError as e:
        print(e)
        raise credentials_exception


def get_current_user(request: Request, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    # access httponly cookies
    token = request.cookies.get('access_token')
    if token is None:
        raise credentials_exception

    user_id = verify_access_token(
        token,
        credentials_exception,
    )

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception

    return user


def get_current_websocket_user(websocket: WebSocket, db: Session):
    """getting the current websocket connection"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate WebSocket credentials",
    )

    token = websocket.cookies.get("access_token")
    if token is None:
        raise credentials_exception

    user_id = verify_access_token(token, credentials_exception)
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise credentials_exception

    return user


