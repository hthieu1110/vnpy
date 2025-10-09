import { BaseEngineRpc } from "@/engineRpcs/BaseEngineRpc";

export class BacktesterEngineRpc extends BaseEngineRpc {
  async initEngine() {
    const res = await this.call("init_engine", {});
    console.log("initEngine", res);
    return res as boolean;
  }

  async startDownloading(
    vt_symbol: string,
    interval: string,
    startTimestamp: number,
    endTimestamp: number
  ) {
    // convert to python timestamp
    const start = Math.floor(startTimestamp / 1000);
    const end = Math.floor(endTimestamp / 1000);

    const res = await this.call("start_downloading", { vt_symbol, interval, start, end });
    console.log("startDownloading", res);
    return res as boolean;
  }

  async startBacktesting(
    class_name: string,
    vt_symbol: string,
    interval: string,
    startTimestamp: number,
    endTimestamp: number,
    rate: number,
    slippage: number,
    size: number,
    pricetick: number,
    capital: number,
    setting: Record<string, unknown>
  ): Promise<boolean> {
   // convert to python timestamp
   const start = Math.floor(startTimestamp / 1000);
   const end = Math.floor(endTimestamp / 1000);

    const res = await this.call("start_backtesting", {
      class_name,
      vt_symbol,
      interval,
      start,
      end,
      rate,
      slippage,
      size,
      pricetick,
      capital,
      setting,
    });
    console.log("startBacktesting", res);
    return res as boolean;
  }
}

export const backtesterEngineRpc = new BacktesterEngineRpc(
  import.meta.env.VITE_API_URL
);
