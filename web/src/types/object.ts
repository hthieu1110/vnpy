import { Direction, Status } from "./constants";

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

export interface Trade extends BaseData {
  symbol: string;
  exchange: string;
  tradeid: string;
  price: number;
  volume: number;
}

export interface Account extends BaseData {
  symbol: string;
  exchange: string;
  accountid: string;
  balance: number;
  frozen: number;
}

export interface Tick extends BaseData {
  symbol: string;
  exchange: string;
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
    quoteid: string
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
