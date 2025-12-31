
from fastapi import HTTPException, Request
from app.utils.redis_client import redis_app

async def rate_limiter(request: Request):

    if not redis_app.client:
        return

    client_ip = request.client.host
    key = f"rate_limit:{client_ip}"

    try:
        current_count = redis_app.client.incr(key)
        if current_count == 1:
            redis_app.client.expire(key, 60)

        if current_count > 50:
            print(f"Rate limit hit for {client_ip}")
            raise HTTPException(status_code=429, detail="Too many requests! Slow down.")

    except Exception as e:
        print(f"Rate limiter error: {e}")