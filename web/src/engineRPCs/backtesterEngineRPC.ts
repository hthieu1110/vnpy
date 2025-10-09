import { BaseEngineRPC } from "@/engineRPCs/BaseEngineRPC";

export class BacktesterEngineRPC extends BaseEngineRPC {
  async startDownloading(
    vt_symbol: string,
    interval: string,
    startTimestamp: number,
    endTimestamp: number
  ) {
    // convert to python timestamp
    const start = Math.floor(startTimestamp / 1000);
    const end = Math.floor(endTimestamp / 1000);

    return this.call("start_downloading", { vt_symbol, interval, start, end });
  }
}

export const backtesterEngineRPC = new BacktesterEngineRPC(
  import.meta.env.VITE_API_URL
);
