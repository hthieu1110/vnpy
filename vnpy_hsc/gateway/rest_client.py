import httpx

from vnpy_hsc.gateway.ssl_ctx import get_ssl_ctx

class HscRestClient:
    def __init__(self, bearer_token: str):
        self.base_url = ""
        self.bearer_token = bearer_token
        self._headers = {"Authorization": f"Bearer {bearer_token}"}

    async def async_json_query(self, url: str, verify: bool | None = False):
        if verify is None:
            verify = get_ssl_ctx()

        async with httpx.AsyncClient(verify=verify, headers=self._headers) as client:
            res = await client.get(url)
            res.raise_for_status()
            return res.json()

    def json_query(self, url: str, verify: bool | None = False):
        if verify is None:
            verify = get_ssl_ctx()

        with httpx.Client(verify=verify, headers=self._headers) as client:
            res = client.get(url)
            res.raise_for_status()
            return res.json()

    def json_post(self, url: str, payload: dict, verify: bool = False):
        with httpx.Client(verify=verify, headers=self._headers) as client:
            res = client.post(url, json=payload, timeout=5)
            res.raise_for_status()
            return res.json()

    def send_order(self, payload):
        # payload: symbol, price, volume, side, type
        return self.json_post(self.base_url + "/orders", payload)

    def cancel_order(self, remote_order_id):
        return self.json_post(self.base_url + f"/orders/{remote_order_id}/cancel")

    def close(self):
        pass
