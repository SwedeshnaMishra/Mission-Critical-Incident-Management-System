from fastapi import APIRouter, HTTPException
from app.services.db import SessionLocal
from app.models.work_item import WorkItem
from app.models.rca import RCA
from app.schemas.rca import RCACreate
from app.services.state_manager import can_transition

router = APIRouter()

# 🔁 Update status
@router.post("/work-item/{id}/status")
def update_status(id: int, new_status: str):
    db = SessionLocal()

    item = db.query(WorkItem).filter_by(id=id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Not found")

    if not can_transition(item.status, new_status):
        raise HTTPException(status_code=400, detail="Invalid transition")

    # 🚨 RCA check before closing
    if new_status == "CLOSED":
        rca = db.query(RCA).filter_by(work_item_id=id).first()
        if not rca:
            raise HTTPException(status_code=400, detail="RCA required")

        item.end_time = rca.end_time

    item.status = new_status
    db.commit()

    return {"status": "updated"}


# 📄 Add RCA
@router.post("/work-item/{id}/rca")
def add_rca(id: int, data: RCACreate):
    db = SessionLocal()

    rca = RCA(
        work_item_id=id,
        root_cause=data.root_cause,
        fix_applied=data.fix_applied,
        prevention=data.prevention,
        end_time=data.end_time
    )

    db.add(rca)
    db.commit()

    return {"status": "rca added"}

@router.get("/work-items")
def get_work_items():
    db = SessionLocal()
    items = db.query(WorkItem).all()

    result = []
    for i in items:
        result.append({
            "id": i.id,
            "component_id": i.component_id,
            "status": i.status,
            "severity": i.severity
        })

    return result

@router.get("/work-item/{id}")
def get_work_item(id: int):
    db = SessionLocal()

    item = db.query(WorkItem).filter_by(id=id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Not found")

    rca = db.query(RCA).filter_by(work_item_id=id).first()

    return {
        "id": item.id,
        "component_id": item.component_id,
        "status": item.status,
        "severity": item.severity,
        "start_time": item.start_time,
        "end_time": item.end_time,
        "rca": {
            "root_cause": rca.root_cause,
            "fix_applied": rca.fix_applied,
            "prevention": rca.prevention,
        } if rca else None
    }
