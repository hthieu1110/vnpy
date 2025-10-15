import { useDataStore } from "@/stores/useDataStore";
import { useTableColumns } from "@/hooks/useTableColumns";
import { DataTable } from "@/components/ui/DataTable";
import { Account } from "@/types/object";

type AccountsTableProps = {
    searchColumn?: keyof Account;
};

export const AccountsTable = (props: AccountsTableProps) => {
    const accounts = useDataStore((state) => state.accounts);
    const columns = useTableColumns([
        "accountid",
        "balance",
        "frozen",
        "available",
        "gateway_name",
    ]);

    return (
        <DataTable
            dataSource={accounts}
            columns={columns}
            rowKey="accountid"
            searchColumn={props.searchColumn}
        />
    );
};
