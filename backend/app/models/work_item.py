from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class WorkItem(Base):
    __tablename__ = "work_items"

    id = Column(Integer, primary_key=True, index=True)
    component_id = Column(String)
    status = Column(String)
    severity = Column(String)
    start_time = Column(Float)
    end_time = Column(Float, nullable=True)