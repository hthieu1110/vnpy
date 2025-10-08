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
  datetime: string;

  extra: string;
  msg: string;
}

export interface Position extends BaseData {
  symbol: string;
  exchange: string;
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
  direction: string;
  offset: string;
  price: number;
  volume: number;
  datetime: string;
}

export interface OrderRequest extends BaseTradingInfo {
  direction: string;
  type: string;
  volume: number;
  price: number;
  offset: string;
  reference: string;
}

export interface OrderData extends BaseTradingInfo {
  orderid: string;
  type: string;
  direction: string;
  offset: string;
  price: number;
  volume: number;
  traded: number;
  status: string;
  datetime: string;
  reference: string;
}
