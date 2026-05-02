from pydantic import BaseModel
from typing import Optional
import time

class Signal(BaseModel):
    component_id: str
    severity: str
    message: str
    timestamp: Optional[float] = None

    def with_timestamp(self):
        if not self.timestamp:
            self.timestamp = time.time()
        return self