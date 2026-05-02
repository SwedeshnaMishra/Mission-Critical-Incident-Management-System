import redis
import json

redis_client = redis.Redis(host="redis", port=6379, decode_responses=True)

def push_signal(signal: dict):
    redis_client.xadd("signals_stream", signal)