import {
  BarData,
  DailyResult,
  BacktestStatistics,
  OptimizationParamsConfig,
  OptimizationResult,
  OrderData,
  Strategy,
  TradeData,
} from "@/types/object";
import { BaseEngineRpc } from "./BaseEngineRpc";

export class BacktesterEngineRpc extends BaseEngineRpc {
  async initEngine() {
    const res = await this.call("init_engine", {});
    return res as boolean;
  }

  async customGetAllStrategies(): Promise<Strategy[]> {
    const res = await this.call("get_all_strategies", {});
    return res as Strategy[];
  }

  async getHistoryData(): Promise<BarData[]> {
    const res = await this.call("get_history_data", {});
    return res as BarData[];
  }

  async getAllDailyResults(): Promise<DailyResult[]> {
    const res = await this.call("get_all_daily_results", {});
    return res as DailyResult[];
  }

  async getAllOrders(): Promise<OrderData[]> {
    const res = await this.call("get_all_orders", {});
    return res as OrderData[];
  }

  async getAllTrades(): Promise<TradeData[]> {
    const res = await this.call("get_all_trades", {});
    return res as TradeData[];
  }

  async getResultValues(): Promise<OptimizationResult[]> {
    const res = await this.call("get_result_values", {});
    if (!res) return [];

    return (res as any).map((data: any) => {
      return {
        params: data[0],
        target_value: data[1],
        statistics: data[2],
      };
    });
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

    const res = await this.call("start_downloading", {
      vt_symbol,
      interval,
      start,
      end,
    });
    console.log("startDownloading", res);
    return res as boolean;
  }

  async getResultStatistics(): Promise<BacktestStatistics> {
    const res = await this.call("get_result_statistics", {});
    return res as BacktestStatistics;
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

  async startOptimization(
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
    optimization_setting: OptimizationParamsConfig,
    use_ga: boolean,
    max_workers: number
  ): Promise<boolean> {
    // convert to python timestamp
    const start = Math.floor(startTimestamp / 1000);
    const end = Math.floor(endTimestamp / 1000);

    const res = await this.call("start_optimization", {
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
      optimization_setting,
      use_ga,
      max_workers,
    });
    return res as boolean;
  }

  async reloadStrategyClass(): Promise<boolean> {
    const res = await this.call("reload_strategy_class", {});
    console.log("reloadStrategyClass", res);
    return res as boolean;
  }
}

export const backtesterRpc = new BacktesterEngineRpc(
  import.meta.env.VITE_API_URL,
  "CtaBacktesterApp"
);
