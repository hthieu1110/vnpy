import httpx
import requests, json
from vnpy_binance import BinanceSpotGateway
from vnpy_ctastrategy import CtaStrategyApp
from vnpy_ctastrategy.engine import load_json
from vnpy_rpcservice import RpcServiceApp

from api.config import CENTRI_HOST, CENTRI_PORT, RPC_HOST, RPC_REP_PORT, RPC_PUB_PORT
from vnpy.event.engine import Event, EventEngine
from vnpy.trader.engine import MainEngine
from vnpy.trader.event import EVENT_LOG
from vnpy.trader.logger import logger


headers = {
    "Content-Type": "application/json",
    "Authorization": f"apikey http_api_key"
}

# Create a single HTTP client for all event publishing
http_client = httpx.Client(verify=False, headers=headers)

def get_http_client():
    return http_client

def publish_event(event: Event) -> None:
    # logger.info(f"Publish event: {event.type}")

    http_client = get_http_client()

    data = {
        "event_type": event.type, 
        "event_data": {
            "gateway_name": event.data.gateway_name,
            "extra": event.data.extra,
            "msg": event.data.msg,
        }
    }
    channel = "event." + event.type
    payload = {
        "method": "publish",
        "params": {
            "channel": channel,
            "data": data,
        }
    }

    try:
        res = http_client.post(f"http://{CENTRI_HOST}:{CENTRI_PORT}/api", json=payload)
        if res.status_code != 200:
            logger.error(f"Centri Response ({res.status_code}): {res.text}")
    except Exception as e:
        logger.error(f"Failed to publish event: {e}")

def main():
    event_engine = EventEngine()
    main_engine = MainEngine(event_engine)

    main_engine.add_gateway(BinanceSpotGateway, gateway_name="Vision")

    main_engine.add_app(CtaStrategyApp)
    main_engine.add_app(RpcServiceApp)

    # manage rpc service -------------------------------------------------------------
    rpc_service = main_engine.get_engine(RpcServiceApp.app_name)
    rpc_service.start(
        rep_address=f"tcp://{RPC_HOST}:{RPC_REP_PORT}", 
        pub_address=f"tcp://{RPC_HOST}:{RPC_PUB_PORT}"
    )

    rpc_service.server.register(main_engine.connect)

    logger.info("RpcServer started")

    # manage centrifugo proxy -------------------------------------------------------------
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"apikey http_api_key"
    }
    
    event_engine.register(EVENT_LOG, publish_event)

    # connect to gateway -------------------------------------------------------------
    # settings = load_json("connect_vision.json")
    # main_engine.connect(settings, "Vision")
    
    try:
        # Keep the server running
        import time
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Shutting down...")
    finally:
        # Clean up resources
        http_client.close()
        rpc_service.stop()
        main_engine.close()

if __name__ == "__main__":
    main()