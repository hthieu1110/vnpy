import { useDataStore } from "@/stores/useDataStore";
import { useTableColumns } from "@/hooks/useTableColumns";
import { Card, Input, Table } from "antd";
import { useState } from "react";

type AccountsWidgetProps = {
  pageSize?: number;
};

export const AccountsWidget = (props: AccountsWidgetProps) => {
  const accounts = useDataStore((state) => state.accounts);
  const columns = useTableColumns([
    "accountid",
    "balance",
    "frozen",
    "available",
    "gateway_name",
  ]);

  const [searchText, setSearchText] = useState<string>("");
  const filteredAccounts = accounts.filter((account) =>
    account.accountid.startsWith(searchText.toUpperCase())
  );

  return (
    <Card
      title="Accounts"
      extra={
        <Input.Search
          placeholder="Search..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchText(e.target.value)
          }
          style={{ width: 240 }}
        />
      }
    >
      <Table
        size="small"
        dataSource={filteredAccounts}
        columns={columns}
        pagination={props.pageSize ? { pageSize: props.pageSize } : false}
        rowKey="accountid"
        sticky
        scroll={{
          y: "20vh",
          x: "max-content",
        }}
        style={{
          tableLayout: "fixed",
        }}
      />
    </Card>
  );
};
