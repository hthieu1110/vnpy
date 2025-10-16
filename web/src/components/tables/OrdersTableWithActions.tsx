import { useDataStore } from "@/stores/useDataStore";
import { OrderData } from "@/types/object";
import { useTableColumns } from "@/hooks/useTableColumns";
import { Button, Switch } from "antd";
import { useMemo, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { Status } from "@/types/constants";
import { DataTable } from "../ui/DataTable";


const activeStatuses = [Status.NOTTRADED, Status.PARTTRADED, Status.SUBMITTING];

export const OrdersTableWithActions = () => {
    const orders = useDataStore((state) => state.orders);

    const [onlyActiveOrders, setOnlyActiveOrders] = useState(false);

    const filteredOrders = useMemo(() => {
        const sortedOrders = orders.sort((a, b) => +b.orderid - +a.orderid);

        if (onlyActiveOrders) {
            return sortedOrders.filter((order) => activeStatuses.includes(order.status));
        }
        return sortedOrders;
    }, [onlyActiveOrders, orders]);

    const { cancelOrderById, isOrderCancelling } = useOrders();
    const columns = useTableColumns([
        ["orderid", 2],
        ["symbol", 3],
        // 'exchange',
        "type",
        "direction",
        // "offset",
        ["price", 2],
        ["volume", 2],
        ["traded", 2],
        ["status", 2],
        ["datetime", 3],
        // "reference",
    ]);

    columns.push({
        title: "Action",
        dataIndex: "action",
        key: "action",
        flex: 2,
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

    return <DataTable
        title="Orders"
        dataSource={filteredOrders}
        columns={columns}
        rowKey="orderid"
        extra={<div className="flex gap-2 items-center">
            <span>Only Active Orders</span>
            <Switch checked={onlyActiveOrders} onChange={() => setOnlyActiveOrders(!onlyActiveOrders)} />
        </div>}
    />;
};
