import { mainEngineRpc } from "@/engineRPCs/mainEngineRpc";
import { Status } from "@/types/constants";
import { useDataStore } from "@/stores/useDataStore";
import { useAppStore } from "@/stores/useAppStore";
import { CancelRequest } from "@/types/object";
import { notification } from "antd";

export const useOrders = () => {
  const [api] = notification.useNotification();

  const orderDatas = useDataStore((state) => state.orderDatas);
  const [gateway, isOrderCancelling, appActions] = useAppStore((state) => [
    state.gateway,
    state.isOrderCancelling,
    state.actions,
  ]);

  const cancelAllOrders = async () => {
    const activeOrders = orderDatas.filter(
      (order) => order.status === Status.NOTTRADED
    );

    const res = await Promise.all(
      activeOrders.map((order) => cancelOrderById(order.orderid))
    );
    return res;
  };

  const cancelOrderById = async (orderId: string) => {
    const orderData = orderDatas.find((order) => order.orderid === orderId);
    if (!orderData) {
      api.error({
        message: "Order not found",
        description: "The order you are trying to cancel does not exist",
      });
      throw new Error("Order not found");
    }

    appActions.setIsOrderCancelling(true);

    try {
      const req: CancelRequest = {
        orderid: orderData.orderid,
        symbol: orderData.symbol,
        exchange: orderData.exchange,
      };

      const res = await mainEngineRpc.cancelOrder(req, gateway);
      return res;
    } catch (error) {
      api.error({
        message: "Failed to cancel order",
        description: `Error: ${error}`,
      });
      throw error;
    } finally {
      appActions.setIsOrderCancelling(false);
    }
  };

  return {
    cancelAllOrders,
    isOrderCancelling,
    cancelOrderById,
  };
};
