import {
  Account,
  CancelRequest,
  Contract,
  OrderData,
  OrderRequest,
  Position,
  QuoteData,
  Tick,
  TradeData,
} from "@/types/object";
import { BaseEngineRpc } from "./BaseEngineRpc";

class MainEngineRpc extends BaseEngineRpc {
  async connect(setting: unknown, gateway_name: string): Promise<unknown> {
    return this.call("connect", { gateway_name, setting });
  }

  async sendOrder(req: OrderRequest, gateway_name: string): Promise<unknown> {
    return this.call("send_order", { req, gateway_name });
  }

  async cancelOrder(
    req: CancelRequest,
    gateway_name: string
  ): Promise<unknown> {
    return this.call("cancel_order", { req, gateway_name });
  }

  async getAllOrders(): Promise<OrderData[]> {
    const { data } = (await this.call("get_all_orders", {})) as {
      data: OrderData[];
    };
    return data;
  }

  async getAllTrades(): Promise<TradeData[]> {
    const { data } = (await this.call("get_all_trades", {})) as {
      data: TradeData[];
    };
    return data;
  }

  async getAllPositions(): Promise<Position[]> {
    const { data } = (await this.call("get_all_positions", {})) as {
      data: Position[];
    };
    return data;
  }

  async getAllAccounts(): Promise<Account[]> {
    const { data } = (await this.call("get_all_accounts", {})) as {
      data: Account[];
    };
    return data;
  }

  async getAllContracts(): Promise<Contract[]> {
    const { data } = (await this.call("get_all_contracts", {})) as {
      data: Contract[];
    };
    return data;
  }

  async getAllTicks(): Promise<Tick[]> {
    const { data } = (await this.call("get_all_ticks", {})) as { data: Tick[] };
    return data;
  }

  async getAllActiveOrders(): Promise<OrderData[]> {
    const { data } = (await this.call("get_all_active_orders", {})) as {
      data: OrderData[];
    };
    return data;
  }

  async getAllActiveQuotes(): Promise<QuoteData[]> {
    const { data } = (await this.call("get_all_active_quotes", {})) as {
      data: QuoteData[];
    };
    return data;
  }

  async getAllQuotes(): Promise<QuoteData[]> {
    const { data } = (await this.call("get_all_quotes", {})) as {
      data: QuoteData[];
    };
    return data;
  }
}

export const mainEngineRpc = new MainEngineRpc(
  import.meta.env.VITE_API_URL
);
