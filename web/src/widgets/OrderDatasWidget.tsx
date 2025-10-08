import { useDataStore } from "@/store/useDataStore";
import { genColumns } from "@/utils/genColumns";
import { Card, Table } from "antd";
import { useMemo } from "react";

type OrderDatasWidgetProps = {
  pageSize?: number;
};

export const OrderDatasWidget = (props: OrderDatasWidgetProps) => {
  const orderDatas = useDataStore((state) => state.orderDatas);
  const sortedOrderDatas = useMemo(
    () => orderDatas.sort((a, b) => b.datetime - a.datetime),
    [orderDatas]
  );

  const columns = genColumns([
    "orderid",
    "symbol",
    "exchange",
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

  return (
    <Card title="Orders">
      <Table
        dataSource={sortedOrderDatas}
        columns={columns}
        pagination={{ pageSize: props.pageSize }}
      />
    </Card>
  );
};
