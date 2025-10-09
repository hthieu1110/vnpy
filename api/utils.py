from dataclasses import asdict, dataclass, is_dataclass
import datetime
from enum import Enum
import json
import time
from typing import Callable, get_type_hints
import httpx
import jwt
from vnpy_rpcservice.rpc_service import RpcEngine
from api.config import CENTRI_HOST, CENTRI_PORT
from vnpy.event.engine import Event, EventEngine
from vnpy.trader.logger import logger
from datetime import datetime


headers = {"Content-Type": "application/json", "Authorization": f"apikey http_api_key"}

# Create a single HTTP client for all event publishing
http_client = httpx.Client(verify=False, headers=headers)


def get_http_client():
    return http_client


def to_json(data: any) -> dict:
    if not is_dataclass(data):
        return data

    d = asdict(data)
    for key, value in d.items():
        if is_dataclass(value):
            d[key] = to_json(value)
        elif isinstance(value, Enum):
            d[key] = value.value
        elif isinstance(value, datetime):
            d[key] = value.timestamp()
    return d


def event_to_centri(event_engine: EventEngine, event: str):
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
                new_data[key] = typeCls[data[key]]
            except KeyError:
                raise KeyError(f"{typeCls} has no name {data[key]}")
        else:
            new_data[key] = data[key]

    return dtClass(**new_data)
