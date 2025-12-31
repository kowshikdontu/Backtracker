import redis
import os
import json
from dotenv import load_dotenv
from app.config import settings
load_dotenv()

class RedisClient:
    def __init__(self):
        self.redis_url = settings.REDIS_URL
        try:
            self.client = redis.from_url(self.redis_url, decode_responses=True)
            self.client.ping()
            print("Connected to Redis")
        except redis.ConnectionError:
            self.client = None
            print("redis connection failed. Caching disabled.")

    def get(self, key: str):
        if self.client:
            try:
                data = self.client.get(key)
                return json.loads(data) if data else None
            except Exception as e:
                print(f"Redis Read Error: {e}")
        return None

    def set(self, key: str, value: list | dict, expire: int = 300):
        if self.client:
            try:
                self.client.setex(key, expire, json.dumps(value))
            except Exception as e:
                print(f"Redis Write Error: {e}")

    def delete(self, key: str):
        if self.client:
            try:
                self.client.delete(key)
                print(f"Invalidated Cache: {key}")
            except Exception as e:
                print(f"Redis Delete Error: {e}")

redis_app = RedisClient()