import axios from "axios";

class RpcAPIService {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }
  
  async call(action: string, data: unknown): Promise<unknown> {
    const response = await axios.post(`${this.apiUrl}/rpc/${action}`, data);
    return response.data;
  }
}

export const rpcService = new RpcAPIService(import.meta.env.VITE_API_URL);

