from sqlalchemy import Column, Integer, String, Float
from app.models.work_item import Base

class RCA(Base):
    __tablename__ = "rca"

    id = Column(Integer, primary_key=True, index=True)
    work_item_id = Column(Integer)
    root_cause = Column(String)
    fix_applied = Column(String)
    prevention = Column(String)
    end_time = Column(Float)