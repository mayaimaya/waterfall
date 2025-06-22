import os

from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", 5000))
HOST = os.getenv("HOST",'127.0.0.1')
