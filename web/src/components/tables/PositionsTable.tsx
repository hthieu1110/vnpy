import { useDataStore } from "@/stores/useDataStore";
import { useTableColumns } from "@/hooks/useTableColumns";
import { DataTable } from "../ui/DataTable";

export const PositionsTable = () => {
    const positions = useDataStore((state) => state.positions);

    const columns = useTableColumns([
        ["symbol", 2],
        "exchange",
        "direction",
        "volume",
        "frozen",
        "price",
        "pnl",
        "yd_volume",
    ]);

    return (
        <DataTable
            title="Positions"
            dataSource={positions}
            columns={columns}
            rowKey={(record) =>
                record.symbol + record.exchange + record.direction + record.volume
            }
        />
    );
};
