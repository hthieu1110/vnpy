from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class HscGatewaySettings(BaseModel):
    centri_url: str
    tickers_ref_url: str
    api_token: str
