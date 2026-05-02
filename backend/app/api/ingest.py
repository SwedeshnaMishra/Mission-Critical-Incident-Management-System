from fastapi import APIRouter, Request, HTTPException
from app.models.signal import Signal
from app.services.redis_client import push_signal
from app.utils.rate_limiter import is_allowed

router = APIRouter()

@router.post("/signals")
async def ingest_signal(signal: Signal, request: Request):
    ip = request.client.host

    if not is_allowed(ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    signal = signal.with_timestamp()
    push_signal(signal.dict())

    return {"status": "queued"}