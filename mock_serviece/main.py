import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from random import randint
from datetime import datetime, timedelta
import numpy as np

from config import HOST, PORT

app = FastAPI()

@app.get("/mock-data")
def get_mock_data():
    random_id = randint(1, 100)
    data = np.random.randint(200, 251, size=(34, 400)).tolist()
    base_time = datetime.utcnow()
    capture_times = [(base_time + timedelta(minutes=i)).isoformat() + "Z" for i in range(34)]

    response = {
        random_id: {
            "data": data,
            "captureTimes": capture_times
        }
    }

    return JSONResponse(content=response)

if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
