from fastapi import APIRouter, Depends
from app.schemas import getUser
from app.auth_utils import get_current_user

from app.routes.problemlist import router as problem_list_router
from app.routes.auth import router as auth_router
from starlette.responses import JSONResponse

router = APIRouter()

router.include_router(problem_list_router, prefix="/problemset", tags=["problemset"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])


@router.get("/account/users/_self_", name="user:validate")
async def user_account_validate(user: getUser = Depends(get_current_user)):
    return JSONResponse(content={"status": "OK"})
