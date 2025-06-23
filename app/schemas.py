from pydantic import BaseModel, Field,EmailStr
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str
    is_sheet: bool = False


class Token(BaseModel):
    access_token: str
    token_type: str


class UserCreate(BaseModel):
    username: EmailStr
    password: str
    access_code: str


class UserLogin(BaseModel):
    username: str
    password: str


class getUser(BaseModel):
    username:str
    curr_cnt: int
    class Config:
        orm_mode=True


class ProblemBase(BaseModel):
    title: str
    difficulty: str
    url: str
    tags: str
    class Config:
        orm_mode=True
        from_attributes =True

class ProblemOut(ProblemBase):
    problem_id:int
    class Config:
        orm_mode=True
        from_attributes =True

class Problems(ProblemOut):
    status: bool
    class Config:
        orm_mode=True
        from_attributes =True
class ProblemCreate(BaseModel):
    title: str
    url: Optional[str]|None = ""
    tags: Optional[str]|None = ""
    difficulty: str

    class Config:
        orm_mode = True

class Accessin(BaseModel):
    username:str
    problem_id:int
    class Config:
        orm_mode = True
