from contextlib import asynccontextmanager

from api.config import RPC_HOST, RPC_REP_PORT, RPC_PUB_PORT
from api.utils import gen_jwt_token, to_dataclass

from routers import trading_router, market_router

from fastapi import Body, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from vnpy.rpc.client import RemoteException, RpcClient
from vnpy.trader.object import OrderRequest


@asynccontextmanager
async def lifespan(app: FastAPI):
    rpc_client = RpcClient()
    app.state.rpc_client = rpc_client

    # Connect to RPC server
    # req_address: for request-reply (function calls)
    # sub_address: for publish-subscribe (data push)
    rpc_client.start(
        req_address=f"tcp://{RPC_HOST}:{RPC_REP_PORT}",
        sub_address=f"tcp://{RPC_HOST}:{RPC_PUB_PORT}",
    )

    yield

    rpc_client.stop()


app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure specific origins in production
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


def func_args_convert(funcName: str, data: dict) -> dict:
    if funcName == "send_order":
        data["req"] = to_dataclass(data["req"], OrderRequest)
    return data


@app.post("/rpc/{action}")
async def rpc(action: str, data: dict = Body(...)):
    try:
        func = getattr(app.state.rpc_client, action)
        converted_data = func_args_convert(action, data)
        result = func(**converted_data)
        return {"success": True, "data": result}
    except Exception as e:
        if isinstance(e, RemoteException) and "KeyError" in str(e):
            raise HTTPException(status_code=404, detail=f"Action {action} not found")
        raise e


@app.get("/centri/jwt_token")
def get_centri_jwt_token(channel: str | None = None):
    return gen_jwt_token(channel)


app.include_router(trading_router, prefix="/trading")
app.include_router(market_router, prefix="/market")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api_server:app", host="0.0.0.0", port=8001, reload=True)
