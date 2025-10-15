import { useDataStore } from "@/stores/useDataStore";
import { OrderData } from "@/types/object";
import { useTableColumns } from "@/hooks/useTableColumns";
import { Button, Card, Switch, Table } from "antd";
import { useMemo, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { Status } from "@/types/constants";

type OrderDatasWidgetProps = {
  pageSize?: number;
  height?: number | string;
};

const activeStatuses = [Status.NOTTRADED, Status.PARTTRADED, Status.SUBMITTING];

export const OrderDatasWidget = (props: OrderDatasWidgetProps) => {
  const orderDatas = useDataStore((state) => state.orderDatas);

  const [onlyActiveOrders, setOnlyActiveOrders] = useState(false);

  const filteredOrderDatas = useMemo(() => {
    const sortedOrderDatas = orderDatas.sort((a, b) => +b.orderid - +a.orderid);

    if (onlyActiveOrders) {
      return sortedOrderDatas.filter((order) => activeStatuses.includes(order.status));
    }
    return sortedOrderDatas;
  }, [onlyActiveOrders, orderDatas]);

  const { cancelOrderById, isOrderCancelling } = useOrders();
  const columns = useTableColumns([
    "orderid",
    "symbol",
    // 'exchange',
    "type",
    "direction",
    // "offset",
    "price",
    "volume",
    "traded",
    "status",
    "datetime",
    // "reference",
  ]);

  columns.push({
    title: "Action",
    dataIndex: "action",
    key: "action",
    align: "center",
    // @ts-expect-error: we add new action on existing columns so the type is not correct
    render: (_: unknown, _item: OrderData): React.ReactNode | null => {
      const orderData = _item;
      if (
        orderData.status === "All Traded" ||
        orderData.status === "Cancelled" ||
        orderData.status === "Rejected"
      ) {
        return null;
      }

      return (
        <Button
          variant="outlined"
          color="danger"
          onClick={() => cancelOrderById(orderData.orderid)}
          loading={isOrderCancelling}
        >
          Cancel
        </Button>
      );
    },
  });


  return (
    <Card title="Orders" extra={<div className="flex gap-2 items-center">
      <span>Only Active Orders</span>
      <Switch checked={onlyActiveOrders} onChange={() => setOnlyActiveOrders(!onlyActiveOrders)} />
    </div>}>
      <Table
        dataSource={filteredOrderDatas}
        columns={columns}
        pagination={props.pageSize ? { pageSize: props.pageSize } : false}
        rowKey="orderid"
        sticky
        scroll={{
          y: "25vh",
          x: filteredOrderDatas.length > 0 ? "max-content" : undefined,
        }}
        style={{
          tableLayout: "fixed",
        }}
      />
    </Card>
  );
};
