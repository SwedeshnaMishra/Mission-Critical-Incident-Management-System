from fastapi import FastAPI
from app.api.ingest import router as ingest_router
from app.services.db import get_engine
from app.models.work_item import Base
from app.api.work_item import router as work_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    engine = get_engine()
    Base.metadata.create_all(bind=engine)

    from app.services.db import SessionLocal
    from app.models.work_item import WorkItem
    import time

    db = SessionLocal()

    existing = db.query(WorkItem).first()

    if not existing:
        sample = WorkItem(
            component_id="CACHE_CLUSTER_01",
            status="OPEN",
            severity="P2",
            start_time=int(time.time())
        )

        db.add(sample)
        db.commit()

    db.close()

app.include_router(ingest_router)
app.include_router(work_router)

@app.get("/health")
def health():
    return {"status": "ok"}