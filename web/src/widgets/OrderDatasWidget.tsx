import { useDataStore } from "@/stores/useDataStore";
import { OrderData } from "@/types/object";
import { useTableColumns } from "@/hooks/useTableColumns";
import { Button, Card, Table } from "antd";
import { useMemo } from "react";
import { useOrders } from "@/hooks/useOrders";

type OrderDatasWidgetProps = {
  pageSize?: number;
  height?: number | string;
};

export const OrderDatasWidget = (props: OrderDatasWidgetProps) => {
  const orderDatas = useDataStore((state) => state.orderDatas);
  const sortedOrderDatas = useMemo(
    () => orderDatas.sort((a, b) => +b.orderid - +a.orderid),
    [orderDatas]
  );
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
    <Card title="Orders">
      <Table
        dataSource={sortedOrderDatas}
        columns={columns}
        pagination={props.pageSize ? { pageSize: props.pageSize } : false}
        rowKey="orderid"
        sticky
        scroll={{
          y: "25vh",
          x: "max-content",
        }}
        style={{
          tableLayout: "fixed",
        }}
      />
    </Card>
  );
};
