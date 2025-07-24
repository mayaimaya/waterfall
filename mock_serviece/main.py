import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta, timezone
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
        # המרה לזמן UTC
        start_time = datetime.fromisoformat(request.startDate.replace("Z", "+00:00"))
        end_time = datetime.fromisoformat(request.endDate.replace("Z", "+00:00"))

        if end_time <= start_time:
            return JSONResponse(status_code=400, content={"error": "End time must be after start time"})

        delta = end_time - start_time
        num_rows = int(delta.total_seconds() // 60)

        if num_rows <= 0:
            return JSONResponse(status_code=400, content={"error": "Time range too short"})

        data = np.random.randint(-250, -199, size=(num_rows, 400)).tolist()

        # ⏱️ החזרת captureTimes כמספרים (מילישניות מאז 1970 UTC)
        capture_times = [
            int((start_time + timedelta(minutes=i)).replace(tzinfo=timezone.utc).timestamp() * 1000)
            for i in range(num_rows)
        ]

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
