# Simple REST wrapper (replace with aiohttp or FIX in prod)
import requests


class HscRestClient:
    def __init__(self, bearer_token: str):
        self.base_url = ""
        self.bearer_token = bearer_token
        self._session = requests.Session()
        self._session.headers.update({"Authorization": f"Bearer {bearer_token}"})

    def json_query(self, url: str):
        r = self._session.get(url)
        r.raise_for_status()
        return r.json()

    def send_order(self, payload):
        # payload: symbol, price, volume, side, type
        r = self._session.post(self.base_url + "/orders", json=payload, timeout=5)
        r.raise_for_status()
        return r.json()

    def cancel_order(self, remote_order_id):
        r = self._session.post(self.base_url + f"/orders/{remote_order_id}/cancel")
        r.raise_for_status()
        return r.json()

    def close(self):
        self._session.close()
