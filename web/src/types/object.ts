import { Direction, Interval, OptimizationTarget, Status } from "./constants";

interface BaseData {
  gateway_name: string;
}

interface BaseTradingInfo {
  symbol: string;
  exchange: string;
}

export interface Contract extends BaseData {
  exchange: string;
  symbol: string;
  name: string;
  product: string;
  size: number;
  history_data: boolean;
  min_volume: number;
  max_volume: number;
  net_position: boolean;
  option_expiry: string;
  option_index: string;
  option_listed: string;
  option_portfolio: string;
  option_strike: number;
  option_type: string;
  option_underlying: string;
  pricetick: number;
  stop_supported: boolean;
  extra: unknown;
}

export interface Log extends BaseData {
  datetime: number;
  engine: string;

  extra: string;
  msg: string;
}

export interface Position extends BaseTradingInfo {
  direction: string;
  volume: number;
  frozen: number;
  price: number;
  pnl: number;
  yd_volume: number;
}

export interface Quote extends BaseData {
  symbol: string;
  exchange: string;
  quoteid: string;
  bid_price: number;
  bid_volume: number;
  ask_price: number;
  ask_volume: number;
}

// export interface Trade extends BaseData {
//   symbol: string;
//   exchange: string;
//   tradeid: string;
//   price: number;
//   volume: number;
// }

export interface Account extends BaseData {
  symbol: string;
  exchange: string;
  accountid: string;
  balance: number;
  frozen: number;
}

export interface Order extends BaseData {
  symbol: string;
  exchange: string;
  orderid: string;
  price: number;
  volume: number;
}

export interface TradeData extends BaseTradingInfo {
  orderid: string;
  tradeid: string;
  direction: Direction;
  offset: string;
  price: number;
  volume: number;
  datetime: number;
}

export interface OrderRequest extends BaseTradingInfo {
  direction: Direction;
  type: string;
  volume: number;
  price: number;
  offset: string;
  reference: string;
}

export interface OrderData extends BaseTradingInfo {
  orderid: string;
  type: string;
  direction: Direction;
  offset: string;
  price: number;
  volume: number;
  traded: number;
  status: Status;
  datetime: number;
  reference: string;
}

export interface QuoteData extends BaseTradingInfo {
  quoteid: string;
  bid_price: number;
  bid_volume: number;
  ask_price: number;
  ask_volume: number;
  bid_offset: string;
  ask_offset: string;
  status: string;
  datetime: number;
  reference: string;
}

export interface CancelRequest extends BaseTradingInfo {
  orderid: string;
}

export interface DailyResult {
  date: string;
  close_price: number;
  pre_close: number;
  trade_count: number;
  start_pos: number;
  end_pos: number;
  turnover: number;
  commission: number;
  slippage: number;
  trading_pnl: number;
  holding_pnl: number;
  total_pnl: number;
  net_pnl: number;
  trades: TradeData[];
}

export interface BarData extends BaseTradingInfo {
  gateway_name: string;
  extra: any;
  datetime: number;
  interval: Interval;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  volume: number;
  turnover: number;
  open_interest: number;
}

export interface Strategy {
  strategy_name: string;
  strategy_params: Record<string, number | string | boolean>;
}

export interface OptimizationParam {
  parameter: string;
  start: number;
  step: number;
  end: number;
}

export interface OptimizationParamsConfig {
  optimizationTarget: OptimizationTarget;
  processLimit: number;
  optimizationParams: OptimizationParam[];
}

export interface OptimizationResult {
  params: Record<string, number>;
  target_value: number;
  statistics: BacktestStatistics;
}

export interface BacktestStatistics {
  annual_return: number;
  capital: number;
  daily_commission: number;
  daily_net_pnl: number;
  daily_return: number;
  daily_slippage: number;
  daily_trade_count: number;
  daily_turnover: number;
  end_balance: number;
  end_date: string;
  ewm_sharpe: number;
  loss_days: number;
  max_ddpercent: number;
  max_drawdown: number;
  max_drawdown_duration: number;
  profit_days: number;
  return_drawdown_ratio: number;
  return_std: number;
  sharpe_ratio: number;
  start_date: string;
  total_commission: number;
  total_days: number;
  total_net_pnl: number;
  total_return: number;
  total_slippage: number;
  total_trade_count: number;
  total_turnover: number;
}

export interface SubscribeRequest {
  symbol: string;
  exchange: string;
}

export interface TickData extends BaseTradingInfo {
  datetime: number;

  name: string;
  volume: number;
  turnover: number;
  open_interest: number;
  last_price: number;
  last_volume: number;
  limit_up: number;
  limit_down: number;

  open_price: number;
  high_price: number;
  low_price: number;
  pre_close: number;

  bid_price_1: number;
  bid_price_2: number;
  bid_price_3: number;
  bid_price_4: number;
  bid_price_5: number;

  ask_price_1: number;
  ask_price_2: number;
  ask_price_3: number;
  ask_price_4: number;
  ask_price_5: number;

  bid_volume_1: number;
  bid_volume_2: number;
  bid_volume_3: number;
  bid_volume_4: number;
  bid_volume_5: number;

  ask_volume_1: number;
  ask_volume_2: number;
  ask_volume_3: number;
  ask_volume_4: number;
  ask_volume_5: number;

  localtime: number;
  extra: {
    bar?: BarData;
  };
}
