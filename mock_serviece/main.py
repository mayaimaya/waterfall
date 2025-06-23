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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/get_data")
def get_mock_data(request: RequestParams):
    try:
        # Parse the time range
        start_time = datetime.fromisoformat(request.startDate.replace("Z", ""))
        end_time = datetime.fromisoformat(request.endDate.replace("Z", ""))

        if end_time <= start_time:
            return JSONResponse(status_code=400, content={"error": "End time must be after start time"})

        # Calculate how many rows to generate (1 row per minute)
        delta = end_time - start_time
        num_rows = int(delta.total_seconds() // 60)

        if num_rows <= 0:
            return JSONResponse(status_code=400, content={"error": "Time range too short"})

        # Generate mock data
        data = np.random.randint(-250, -199, size=(num_rows, 400)).tolist()
        base_time = datetime.utcnow()
        capture_times = [(base_time + timedelta(minutes=i)).isoformat() + "Z" for i in range(34)]

        # capture_times = [(start_time + timedelta(minutes=i)).isoformat() + "Z" for i in range(num_rows)]

        response = {
            request.id: {
                "data": data,
                "captureTimes": capture_times
            }
        }

        return JSONResponse(content=response)

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
