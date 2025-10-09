from dataclasses import asdict, dataclass, is_dataclass
import datetime
from enum import Enum
import json
import time
from typing import get_type_hints
import httpx
import jwt
from api.config import CENTRI_HOST, CENTRI_PORT
from vnpy.event.engine import Event
from vnpy.trader.constant import Direction
from vnpy.trader.logger import logger


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
        elif isinstance(value, datetime.datetime):
            d[key] = value.timestamp()
    return d


def publish_event(event: Event) -> None:
    # logger.info(f"Publish event: {event.type}")

    http_client = get_http_client()

    payload = {
        "method": "publish",
        "params": {
            "channel": "event." + event.type,
            "data": {"event_type": event.type, "event_data": to_json(event.data)},
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
