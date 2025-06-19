import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
import numpy as np
from starlette.middleware.cors import CORSMiddleware

from config import HOST, PORT
from param_validation import RequestParams

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # באפשרותך לשים ["http://localhost:3000"] כדי להגביל
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/get_data")
def get_mock_data(request: RequestParams):
    id = request.id
    data = np.random.randint(-250, -199, size=(34, 400)).tolist()
    base_time = datetime.utcnow()
    capture_times = [(base_time + timedelta(minutes=i)).isoformat() + "Z" for i in range(34)]

    response = {
        id: {
            "data": data,
            "captureTimes": capture_times
        }
    }

    return JSONResponse(content=response)

if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
