from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json

from ..database import get_db
from .. import models, schemas
from app.auth_utils import get_current_user, pwd_context
from ..dependencies import rate_limiter
from ..schemas import getUser
from app.utils.redis_client import redis_app

router = APIRouter()


@router.get("/mySheet", response_model=List[schemas.Problems])
def get_my_sheet(db: Session = Depends(get_db), user: getUser = Depends(get_current_user)):

    cache_key = f"sheet:{user.username}"
    cached_data = redis_app.get(cache_key)
    if cached_data:
        return cached_data

    rows = db.query(
        models.Problem.problem_id,
        models.Problem.title,
        models.Problem.difficulty,
        models.Problem.url,
        models.Problem.tags,
        models.Accessible.status
    ).join(
        models.Accessible,
        models.Problem.problem_id == models.Accessible.problem_id
    ).filter(
        models.Accessible.username == user.username
    ).all()

    results = [
        {
            "problem_id": r.problem_id,
            "title": r.title,
            "difficulty": r.difficulty,
            "url": r.url,
            "tags": r.tags,
            "status": r.status
        }
        for r in rows
    ]

    redis_app.set(cache_key, results, expire=600)

    return results


@router.get("/viewSheet/{username}/{accesscode}", response_model=List[schemas.ProblemOut])
def view_sheet(username: str, accesscode: str, db: Session = Depends(get_db),
               user: getUser = Depends(get_current_user)):

    user_obj = db.query(models.User).filter(models.User.username == username).first()
    if not user_obj or not pwd_context.verify(accesscode, user_obj.access_code):
        raise HTTPException(status_code=400, detail="Incorrect credentials")

    problems = db.query(models.Problem).join(
        models.Accessible,
        models.Problem.problem_id == models.Accessible.problem_id
    ).filter(models.Accessible.username == username).all()
    return problems



@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=schemas.ProblemOut,dependencies=[Depends(rate_limiter)])
def create_problem(problem: schemas.ProblemCreate, db: Session = Depends(get_db),
                   user: getUser = Depends(get_current_user)):
    new_problem = models.Problem(**problem.dict())
    db.add(new_problem)
    db.commit()
    db.refresh(new_problem)

    new_accessible = models.Accessible(username=user.username, problem_id=new_problem.problem_id)
    db.add(new_accessible)

    user_obj = db.query(models.User).filter(models.User.username == user.username).first()
    user_obj.curr_cnt += 1
    db.commit()
    redis_app.delete(f"sheet:{user.username}")

    return new_problem


@router.post("/add/{problem_id}", status_code=status.HTTP_200_OK, response_model=schemas.ProblemOut,dependencies=[Depends(rate_limiter)])
def add_problem(problem_id: int, db: Session = Depends(get_db), user: getUser = Depends(get_current_user)):
    p = db.query(models.Problem).filter_by(problem_id=problem_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Problem not found")
    if user.curr_cnt >= 1000:
        raise HTTPException(status_code=401, detail="max cnt reached")

    new_accessible = models.Accessible(username=user.username, problem_id=problem_id)
    db.add(new_accessible)

    user_obj = db.query(models.User).filter(models.User.username == user.username).first()
    user_obj.curr_cnt += 1
    db.commit()

    redis_app.delete(f"sheet:{user.username}")

    return p


@router.patch("/status_update/{problem_id}", status_code=status.HTTP_200_OK)
def update_problem_status(problem_id: int, db: Session = Depends(get_db), user: getUser = Depends(get_current_user)):
    accessible = db.query(models.Accessible).filter_by(
        username=user.username,
        problem_id=problem_id
    ).first()

    if not accessible:
        raise HTTPException(status_code=404, detail="Problem not found")

    accessible.status = not accessible.status
    db.commit()
    redis_app.delete(f"sheet:{user.username}")

    return {"msg": "Status updated", "problem_id": problem_id, "status": accessible.status}


@router.delete("/delete/{problem_id}", status_code=status.HTTP_200_OK,dependencies=[Depends(rate_limiter)])
def delete_problem(problem_id: int, db: Session = Depends(get_db), user: getUser = Depends(get_current_user)):
    accessible = db.query(models.Accessible).filter_by(
        username=user.username,
        problem_id=problem_id
    ).first()
    if not accessible:
        raise HTTPException(status_code=404, detail="Problem access not found")

    try:
        db.delete(accessible)
        user_obj = db.query(models.User).filter(models.User.username == user.username).first()
        user_obj.curr_cnt -= 1
        db.commit()
        redis_app.delete(f"sheet:{user.username}")

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete problem")

    return {"msg": f"Access to problem {problem_id} deleted for user {user.username}"}