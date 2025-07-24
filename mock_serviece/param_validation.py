from pydantic import BaseModel

class RequestParams(BaseModel):
    id: int
    startDate: str
    endDate: str