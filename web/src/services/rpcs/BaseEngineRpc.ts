import axios from "axios";

export class BaseEngineRpc {
  private apiUrl: string;
  private engineName: string; 

  constructor(apiUrl: string, engineName: string) {
    this.apiUrl = apiUrl;
    this.engineName = engineName;
  }

  async call(action: string, data: unknown): Promise<unknown> {
    const response = await axios.post(`${this.apiUrl}/rpc/${this.engineName}/${action}`, data);
    return response.data;
  }
}
