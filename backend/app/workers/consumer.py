import sys
import redis
import time
from app.services.mongo_client import signals_collection
from app.services.db import SessionLocal
from app.models.work_item import WorkItem
from app.services.debounce import should_create_work_item

r = redis.Redis(host="redis", port=6379, decode_responses=True)

def start_worker():
    print("🚀 Worker started...", flush=True)

    last_id = "0-0"

    while True:
        messages = r.xread({"signals_stream": last_id}, block=5000, count=10)

        if not messages:
            print("⏳ Waiting for messages...", flush=True)
            continue

        print("📩 Received messages", flush=True)

        for stream, msgs in messages:
            for msg_id, data in msgs:
                print(f"🔥 Processing: {data}", flush=True)
                process_signal(data)
                last_id = msg_id


def process_signal(signal):
    component_id = signal["component_id"]

    db = SessionLocal()

    # Debounce logic
    if should_create_work_item(component_id):
        work_item = WorkItem(
            component_id=component_id,
            status="OPEN",
            severity=signal["severity"],
            start_time=float(signal["timestamp"]),
        )
        db.add(work_item)
        db.commit()
        db.refresh(work_item)

        work_item_id = work_item.id
    else:
        # find latest open work item
        work_item = db.query(WorkItem).filter_by(
            component_id=component_id, status="OPEN"
        ).order_by(WorkItem.id.desc()).first()

        work_item_id = work_item.id if work_item else None

    # Store raw signal
    signals_collection.insert_one({
        "component_id": component_id,
        "message": signal["message"],
        "timestamp": float(signal["timestamp"]),
        "work_item_id": work_item_id
    })

    db.close()