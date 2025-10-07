from contextlib import asynccontextmanager
import json
import time
import jwt

from api.config import RPC_HOST, RPC_REP_PORT, RPC_PUB_PORT

from routers import trading_router, market_router

from fastapi import Body, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from vnpy.rpc.client import RpcClient


@asynccontextmanager
async def lifespan(app: FastAPI):
    rpc_client = RpcClient()  
    app.state.rpc_client = rpc_client

    # Connect to RPC server  
    # req_address: for request-reply (function calls)  
    # sub_address: for publish-subscribe (data push)  
    rpc_client.start(  
        req_address=f"tcp://{RPC_HOST}:{RPC_REP_PORT}",  
        sub_address=f"tcp://{RPC_HOST}:{RPC_PUB_PORT}"
    )  

    yield

    rpc_client.stop()

app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/rpc/{action}")
async def rpc(action: str, data: dict = Body(...)):
    func = getattr(app.state.rpc_client, action)
    func(**data)
    return {"success": True}

@app.get("/centri/connection_token")
def get_centri_connection_token():
    config = json.load(open("./api/centrifugo.json"))
    secret = config["client"]["token"]["hmac_secret_key"]

    now = int(time.time())
    exp = now + 60 * 60  # valid 1 hour
    payload = {
        "sub": "userID",  # user ID
        "exp": exp,
    }
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token

@app.get("/centri/subscription_token")
def get_centri_subscription_token(channel: str):
    config = json.load(open("./api/centrifugo.json"))
    secret = config["client"]["token"]["hmac_secret_key"]

    now = int(time.time())
    exp = now + 60 * 60  # valid 1 hour
    payload = {
        "sub": "userID",  # user ID
        "exp": exp,
        "channel": channel   # allow all channels
    }
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token

app.include_router(trading_router, prefix="/trading")
app.include_router(market_router, prefix="/market")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_server:app", host="0.0.0.0", port=8001, reload=True)