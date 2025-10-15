import { useDataStore } from "@/stores/useDataStore";
import { useTableColumns } from "@/hooks/useTableColumns";
import { DataTable } from "../ui/DataTable";

export const ContractsTable = () => {
    const contracts = useDataStore((state) => state.contracts);

    const columns = useTableColumns([
        ["symbol", 3],
        ["name", 1],
        ["exchange", 1],
        ["product", 1],
        ["size", 1],
        ["history_data", 1],
        ["min_volume", 2],
        ["max_volume", 2],
        // 'net_position',
        // 'option_expiry',
        // 'option_index',
        // 'option_listed',
        // 'option_portfolio',
    ]);

    return (
        <DataTable
            title="Contracts"
            dataSource={contracts}
            columns={columns}
            rowKey="symbol"
            searchColumn="symbol"
        />
    );
};
