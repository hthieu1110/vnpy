from dataclasses import asdict, dataclass, is_dataclass
from datetime import datetime
import numpy as np
from enum import Enum
import json, time, jwt, httpx
from typing import Callable, get_type_hints

from vnpy_ctastrategy.backtesting import DailyResult
from vnpy_rpcservice.rpc_service import RpcEngine
from api.config import CENTRI_HOST, CENTRI_PORT
from vnpy.event.engine import Event, EventEngine
from vnpy.trader.logger import logger

headers = {"Content-Type": "application/json", "Authorization": f"apikey http_api_key"}

# Create a single HTTP client for all event publishing
http_client = httpx.Client(verify=False, headers=headers)


def get_http_client():
    return http_client


def to_json(data: any) -> dict:
    """
    Convert data to JSON.
    """
    if is_dataclass(data):
        return to_json(asdict(data))
    if isinstance(data, list) or isinstance(data, tuple):
        return [to_json(item) for item in data]
    elif isinstance(data, dict):
        return {key: to_json(value) for key, value in data.items()}
    elif isinstance(data, Enum):
        return data.value
    elif isinstance(data, datetime):
        return data.timestamp()
    elif isinstance(data, np.int64):
        return int(data)
    elif isinstance(data, np.float64):
        return float(data)
    elif isinstance(data, np.ndarray):
        return data.tolist()
    elif isinstance(data, np.str_):
        return str(data)
    elif isinstance(data, DailyResult):
        trades = []
        for trade in data.trades:
            timestamp = trade.datetime.timestamp()
            trade.datetime = timestamp
            trades.append(trade)
        data.trades = trades
        return data

    return data


def register_rpc(rpc_service: RpcEngine, engine_name: str, func: Callable):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)

    wrapper.__name__ = f"{engine_name}:{func.__name__}"

    rpc_service.server.register(wrapper)


def register_event(event_engine: EventEngine, event: str):
    """
    Register an event and publish to the centri server.
    """
    event_engine.register(event, publish_event_to_centri)


def publish_event_to_centri(event: Event) -> None:
    http_client = get_http_client()
    data = to_json(event.data) if is_dataclass(event.data) else event.data

    payload = {
        "method": "publish",
        "params": {
            "channel": "public:event." + event.type,
            "data": {"event_type": event.type, "event_data": data},
        },
    }

    try:
        res = http_client.post(f"http://{CENTRI_HOST}:{CENTRI_PORT}/api", json=payload)
        if res.status_code != 200:
            logger.error(f"Centri Response ({res.status_code}): {res.text}")
    except Exception as e:
        logger.error(f"Failed to publish event: {e}")


def gen_jwt_token(channel: str | None = None):
    config = json.load(open("./api/centrifugo.json"))
    secret = config["client"]["token"]["hmac_secret_key"]

    now = int(time.time())
    exp = now + 60 * 60 * 8  # valid 8 hour
    payload = {
        "sub": "userID",  # user ID
        "exp": exp,
    }
    if channel:
        payload["channel"] = channel

    token = jwt.encode(payload, secret, algorithm="HS256")
    return token


def to_dataclass(data: dict, dtClass: dataclass):
    new_data = {}
    hints = get_type_hints(dtClass)

    for key, typeCls in hints.items():
        if issubclass(typeCls, Enum):
            try:
                new_data[key] = typeCls(data[key])
            except KeyError:
                raise KeyError(f"{typeCls} has no name {data[key]}")
        else:
            new_data[key] = data[key]

    return dtClass(**new_data)


class EventRegistry:
    def __init__(self, event_engine: EventEngine):
        self.event_engine = event_engine

    def add(self, event: str):
        self.event_engine.register(event, publish_event_to_centri)

    def add_multi(self, events: list[str]):
        for event in events:
            self.add(event)


class RpcRegistry:
    def __init__(self, rpc_service: RpcEngine):
        self.rpc_service = rpc_service

    def add(self, engine_name: str, func: Callable):
        register_rpc(self.rpc_service, engine_name, func)

    def add_multi(self, engine_name: str, funcs: list[Callable]):
        for func in funcs:
            self.add(engine_name, func)
