import requests, json

from api.config import CENTRI_HOST, CENTRI_PORT

CENTRIFUGO_API = "http://localhost:8000/api"
CENTRIFUGO_KEY = "http_api_key"

def main():
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"apikey {CENTRIFUGO_KEY}"
    }
    data = {
        "event_type": "test",
        "event_data": {
            "gateway_name": "test",
            "extra": "test",
            "msg": "test"
        }
    }
    payload = {
        "method": "publish",
        "params": {
            "channel": "event.test",
            "data": data
        }
    }

    reps = requests.post(
        f"http://{CENTRI_HOST}:{CENTRI_PORT}/api",
        headers=headers, 
        json=payload,
    )

    print(f"Centri Response ({reps.status_code}): {reps.text}")

if __name__ == "__main__":
    main()