from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import time

DATABASE_URL = "postgresql://ims:ims@postgres:5432/ims_db"

engine = None

def get_engine():
    global engine
    if engine:
        return engine

    for i in range(10):  # retry 10 times
        try:
            engine = create_engine(DATABASE_URL)
            conn = engine.connect()
            conn.close()
            print("✅ Connected to Postgres")
            return engine
        except Exception as e:
            print(f"⏳ Waiting for Postgres... ({i+1}/10)")
            time.sleep(2)

    raise Exception("❌ Could not connect to Postgres")

SessionLocal = sessionmaker(bind=get_engine())