from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Problem(Base):
    __tablename__ = "problems"
    problem_id = Column(Integer, primary_key=True,autoincrement=True,index=True, nullable=False)
    title = Column(String, index=True, nullable=False)
    url = Column(String, nullable=True)
    tags = Column(String, nullable=True)
    difficulty = Column(String, nullable=False)


class Accessible(Base):
    __tablename__ = "accessible"
    username = Column(String, ForeignKey("users.username"), primary_key=True)
    problem_id = Column(Integer, ForeignKey("problems.problem_id"), primary_key=True)
    status = Column(Boolean, default=False)
    user = relationship("User", backref="accessible_problems")
    problem = relationship("Problem", backref="accessible_users")


class User(Base):
    __tablename__ = "users"
    username = Column(String, primary_key=True)
    password = Column(String)
    access_code = Column(String, nullable=False)
    max_cnt = Column(Integer, default=1000)
    is_verified = Column(Boolean, default=False)
    curr_cnt = Column(Integer, default=0)


