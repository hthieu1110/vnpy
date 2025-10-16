import {
  Account,
  CancelRequest,
  Contract,
  SubscribeRequest,
  OrderData,
  OrderRequest,
  Position,
  QuoteData,
  Tick,
  TradeData,
} from '@/types/object';
import { BaseEngineRpc } from './BaseEngineRpc';

class MainEngineRpc extends BaseEngineRpc {
  async connect(setting: unknown, gateway_name: string): Promise<unknown> {
    return this.call('connect', { gateway_name, setting });
  }

  async sendOrder(req: OrderRequest, gateway_name: string): Promise<unknown> {
    return this.call('send_order', { req, gateway_name });
  }

  async cancelOrder(req: CancelRequest, gateway_name: string): Promise<unknown> {
    return this.call('cancel_order', { req, gateway_name });
  }

  async getAllOrders(): Promise<OrderData[]> {
    return (await this.call('get_all_orders', {})) as OrderData[];
  }

  async getAllTrades(): Promise<TradeData[]> {
    return (await this.call('get_all_trades', {})) as TradeData[];
  }

  async getAllPositions(): Promise<Position[]> {
    return (await this.call('get_all_positions', {})) as Position[];
  }

  async getAllAccounts(): Promise<Account[]> {
    return (await this.call('get_all_accounts', {})) as Account[];
  }

  async getAllContracts(): Promise<Contract[]> {
    return (await this.call('get_all_contracts', {})) as Contract[];
  }

  async getAllTicks(): Promise<Tick[]> {
    return (await this.call('get_all_ticks', {})) as Tick[];
  }

  async getAllActiveOrders(): Promise<OrderData[]> {
    return (await this.call('get_all_active_orders', {})) as OrderData[];
  }

  async getAllActiveQuotes(): Promise<QuoteData[]> {
    return (await this.call('get_all_active_quotes', {})) as QuoteData[];
  }

  async getAllQuotes(): Promise<QuoteData[]> {
    return (await this.call('get_all_quotes', {})) as QuoteData[];
  }

  async connectAndTrack(setting: unknown, gateway_name: string): Promise<unknown> {
    return await this.call('connect_and_track', { setting, gateway_name });
  }

  async checkGatewayConnected(gateway_name: string): Promise<boolean> {
    return (await this.call('check_gateway_connected', { gateway_name })) as boolean;
  }

  async closeGateway(gateway_name: string): Promise<unknown> {
    return await this.call('close_gateway', { gateway_name });
  }

  async subscribe(req: SubscribeRequest, gateway_name: string): Promise<void> {
    await this.call("subscribe", { req, gateway_name });
  }
}

export const mainRpc = new MainEngineRpc(import.meta.env.VITE_API_URL, 'MainEngine');
