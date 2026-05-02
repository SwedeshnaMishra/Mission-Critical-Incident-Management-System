from pydantic import BaseModel

class RCACreate(BaseModel):
    root_cause: str
    fix_applied: str
    prevention: str
    end_time: float