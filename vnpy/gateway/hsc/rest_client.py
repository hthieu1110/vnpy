# Simple REST wrapper (replace with aiohttp or FIX in prod)
import requests


class HscRestClient:
    def __init__(self, api_token: str):
        self.base_url = "https://api.internal"
        self.api_key = api_token
        self._session = requests.Session()
        self._session.headers.update({"Authorization": f"Bearer {api_token}"})

    def send_order(self, payload):
        # payload: symbol, price, volume, side, type
        r = self._session.post(self.base_url + "/orders", json=payload, timeout=5)
        r.raise_for_status()
        return r.json()

    def cancel_order(self, remote_order_id):
        r = self._session.post(self.base_url + f"/orders/{remote_order_id}/cancel")
        r.raise_for_status()
        return r.json()

    def get_open_orders(self):
        r = self._session.get(self.base_url + "/orders/open")
        r.raise_for_status()
        return r.json()

    def get_account(self):
        r = self._session.get(self.base_url + "/account")
        r.raise_for_status()
        return r.json()

    def get_positions(self):
        r = self._session.get(self.base_url + "/positions")
        r.raise_for_status()
        return r.json()

    def close(self):
        self._session.close()
