from fastapi import APIRouter, Form
from fastapi.security import OAuth2PasswordRequestForm
from app.auth_utils import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, pwd_context, \
    get_current_user
from app.schemas import Token, getUser
from app.database import get_db
from datetime import timedelta
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi_mail import FastMail, MessageSchema
from app.models import User
from app.schemas import UserCreate, ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest
from app.auth_utils import create_verification_token, create_reset_token, decode_token
from app.mail_config import conf
from jose import JWTError, jwt
from app.auth_utils import SECRET_KEY, ALGORITHM
import logging
from pathlib import Path


log = logging.getLogger(__name__)

router = APIRouter()


class CustomOAuth2Form:
    def __init__(
        self,
        username: str = Form(...),
        password: str = Form(...),
        sheet_code: str = Form(...),
        access_code: str = Form(...)
    ):
        self.username = username
        self.password = password
        self.access_code = access_code


async def send_register_email(user):
    try:
        token = create_verification_token({"sub": user.username})
        verify_link = f"https://backtracker-b163.onrender.co/auth/verify-email?token={token}"

        email_template_path = Path(__file__).parent.parent.joinpath("templates/email_verify.html")
        with open(email_template_path, encoding="utf-8") as tpl:
            template = tpl.read()
        template = template.replace("verify_link", verify_link)

        message = MessageSchema(
            subject="Verify your email",
            recipients=[user.username],
            body=template,
            subtype="html"
        )
        fm = FastMail(conf)
        await fm.send_message(message)
    except Exception as e:
        log.error(f"Error sending email: {e}")
        raise HTTPException(
            status_code=400,
            detail="Error! Couldn't send email please try again"
        )


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Incorrect username or password"
        )
    if user and not user.is_verified:
        await send_register_email(user)
        raise HTTPException(
            status_code=400,
            detail="Email not verified!"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    mail = user.username
    # if not mail.endswith("@vitapstudent.ac.in"):
    #     raise HTTPException(status_code=400, detail="only VIT-AP mails are allowed")

    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    sheet_password = pwd_context.hash(user.access_code)
    new_user = User(username=user.username, password=hashed_password, access_code=sheet_password)
    # send email
    await send_register_email(new_user)
    # add user to DB
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"msg": "User registered. Verification email sent."}


@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        log.info(f"Email: {email}")
        if email is None:
            raise HTTPException(status_code=400, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.username ==email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        return {"msg": "Email already verified."}

    user.is_verified = True
    db.commit()
    return {"msg": "Email verified successfully."}


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    response = {"msg": "Password reset link sent to your email."}
    user = db.query(User).filter(User.username == data.email).first()
    if not user:
        return response

    token = create_reset_token({"sub": user.username})
    reset_link = f"https://backtracker-b163.onrender.com/reset-password?token={token}"

    email_template_path = Path(__file__).parent.parent.joinpath("templates/email_reset_pwd.html")
    with open(email_template_path, encoding="utf-8") as tpl:
        template = tpl.read()
    template = template.replace("reset_link", reset_link)

    msg = MessageSchema(
        subject="Reset Your Password",
        recipients=[user.username],
        body=template,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(msg)

    return response


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    payload = decode_token(data.token)
    if not payload:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    email = payload.get("sub")
    user = db.query(User).filter(User.username == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = pwd_context.hash(data.new_password)
    db.commit()
    return {"msg": "Password has been reset successfully."}


@router.post("/change-password")
def change_password(data: ChangePasswordRequest, db: Session = Depends(get_db), user: getUser = Depends(get_current_user)):
    email = user.username
    user = db.query(User).filter(User.username == email).first()
    password = user.password if not data.is_sheet else user.access_code
    if not pwd_context.verify(data.old_password, password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")
    if data.is_sheet:
        user.access_code = pwd_context.hash(data.new_password)
    else:
        user.password = pwd_context.hash(data.new_password)
    db.commit()
    return {"msg": "Password changed successfully."}

