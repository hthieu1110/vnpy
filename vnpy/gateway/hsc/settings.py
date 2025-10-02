from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class VNFutureSettings(BaseModel):
    centri_endpoint: str
    api_token: str
