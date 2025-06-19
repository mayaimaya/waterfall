from pydantic import BaseModel

class RequestParams(BaseModel):
    id: int