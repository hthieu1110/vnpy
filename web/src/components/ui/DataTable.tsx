import { Card, Input } from "antd";
import { useMemo, useState } from "react";
import { VirtualTable, VirtualTableColumnType } from "../ui/VirtualTable";

interface DataTableProps<T> {
    title?: string;
    dataSource: T[];
    columns: VirtualTableColumnType<T>[];
    rowKey: string | ((record: T) => string);
    searchColumn?: keyof T
    extra?: React.ReactNode
}

export const DataTable = <T,>(props: DataTableProps<T>) => {
    const [searchText, setSearchText] = useState<string>("");

    const filteredData = useMemo(() => {
        if (!props.searchColumn) return props.dataSource;

        return props.dataSource.filter((record) =>
            (record[props.searchColumn!] as string).toUpperCase().startsWith(searchText.toUpperCase())
        );
    }, [props.dataSource, searchText, props.searchColumn]);

    const extra = useMemo(() => {
        if (!props.extra && !props.searchColumn) return null;

        return <span>
            {props.extra}
            {props.searchColumn && (
                <Input.Search
                    placeholder="Search..."
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchText(e.target.value)
                    }
                />
            )}
        </span>
    }, [props.extra, props.searchColumn]);

    return (
        <Card title={props.title} extra={extra}
            style={{ height: "100%" }}
            styles={{
                body: {
                    height: "calc(100% - 24px)"
                }
            }}
        >
            <VirtualTable
                rowKey={props.rowKey as string}
                dataSource={filteredData as Record<string, any>[]}
                columns={props.columns as VirtualTableColumnType<Record<string, any>>[]}
            />
        </Card>
    );
};
