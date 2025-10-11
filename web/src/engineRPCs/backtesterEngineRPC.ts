import { BarData, DailyResult, OrderData, Strategy, TradeData } from '@/types/object';
import { BaseEngineRpc } from './BaseEngineRpc';

export class BacktesterEngineRpc extends BaseEngineRpc {
  async initEngine() {
    const res = await this.call('init_engine', {});
    return res as boolean;
  }

  async customGetAllStrategies(): Promise<Strategy[]> {
    const res = await this.call('get_all_strategies', {});
    return res as Strategy[];
  }

  async getHistoryData(): Promise<BarData[]> {
    const res = await this.call('get_history_data', {});
    return res as BarData[];
  }

  async getAllDailyResults(): Promise<DailyResult[]> {
    const res = await this.call('get_all_daily_results', {});
    return res as DailyResult[];
  }

  async getAllOrders(): Promise<OrderData[]> {
    const res = await this.call('get_all_orders', {});
    return res as OrderData[];
  }

  async getAllTrades(): Promise<TradeData[]> {
    const res = await this.call('get_all_trades', {});
    return res as TradeData[];
  }

  async startDownloading(vt_symbol: string, interval: string, startTimestamp: number, endTimestamp: number) {
    // convert to python timestamp
    const start = Math.floor(startTimestamp / 1000);
    const end = Math.floor(endTimestamp / 1000);

    const res = await this.call('start_downloading', {
      vt_symbol,
      interval,
      start,
      end,
    });
    console.log('startDownloading', res);
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

    const res = await this.call('start_backtesting', {
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
    console.log('startBacktesting', res);
    return res as boolean;
  }
}

export const backtesterEngineRpc = new BacktesterEngineRpc(import.meta.env.VITE_API_URL, 'CtaBacktesterApp');
