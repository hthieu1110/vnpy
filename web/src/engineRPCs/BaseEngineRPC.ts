import axios from "axios";

export class BaseEngineRpc {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async call(action: string, data: unknown): Promise<unknown> {
    const response = await axios.post(`${this.apiUrl}/rpc/${action}`, data);
    return response.data;
  }
}
