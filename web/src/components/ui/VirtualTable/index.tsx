import React, { useCallback, useMemo, useState } from "react";
import { Grid } from "react-window";
import type { ColumnsType } from "antd/es/table";
import { Empty } from "antd";
import "./VirtualTable.css";

// Type definitions
interface VirtualTableProps<T = any> {
  dataSource: T[];
  columns: ColumnsType<T>;
  rowKey: string | ((record: T) => string);
  pagination?: false | { pageSize: number };
  sticky?: boolean;
  scroll?: {
    y?: number | string;
    x?: number | string | boolean;
  };
  style?: React.CSSProperties;
  onRow?: (record: T, index?: number) => React.HTMLAttributes<any>;
  locale?: {
    emptyText?: React.ReactNode;
  };
  rowHeight?: number;
  headerHeight?: number;
}

// Default dimensions
const DEFAULT_ROW_HEIGHT = 55;
const DEFAULT_HEADER_HEIGHT = 55;

// Cell props interface for Grid
interface TableCellProps<T = any> {
  columns: ColumnsType<T>;
  dataSource: T[];
  onRow?: (record: T, index?: number) => React.HTMLAttributes<any>;
  sortConfig: {
    key: string;
    direction: "ascend" | "descend" | null;
  } | null;
  handleSort: (key: string) => void;
  sticky: boolean;
}

export function VirtualTable<T extends Record<string, any>>(
  props: VirtualTableProps<T>
) {
  const {
    dataSource,
    columns,
    pagination = false,
    sticky = false,
    scroll = {},
    style = {},
    onRow,
    locale,
    rowHeight = DEFAULT_ROW_HEIGHT,
    headerHeight = DEFAULT_HEADER_HEIGHT,
  } = props;

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascend" | "descend" | null;
  } | null>(null);

  // Calculate column widths
  const columnWidths = useMemo(() => {
    const defaultWidth = 150;
    
    return columns.map((col: any) => {
      if (col.width) {
        return typeof col.width === "number" ? col.width : parseFloat(col.width);
      }
      return defaultWidth;
    });
  }, [columns]);

  const totalWidth = useMemo(
    () => columnWidths.reduce((sum, width) => sum + width, 0),
    [columnWidths]
  );

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return dataSource;

    const sorted = [...dataSource].sort((a, b) => {
      const column = columns.find((col: any) => col.key === sortConfig.key);
      if (!column || !(column as any).sorter) return 0;

      const sorter = (column as any).sorter;
      if (typeof sorter === "function") {
        const result = sorter(a, b);
        return sortConfig.direction === "descend" ? -result : result;
      }
      return 0;
    });

    return sorted;
  }, [dataSource, sortConfig, columns]);

  // Handle pagination
  const displayData = useMemo(() => {
    if (!pagination) return sortedData;
    // For now, just return all data - pagination would need page state
    return sortedData;
  }, [sortedData, pagination]);

  // Handle sort
  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "ascend" };
      }
      if (prev.direction === "ascend") {
        return { key, direction: "descend" };
      }
      return null;
    });
  }, []);

  // Calculate container height
  const containerHeight = useMemo(() => {
    if (scroll?.y) {
      if (typeof scroll.y === "number") {
        return scroll.y;
      }
      if (typeof scroll.y === "string") {
        // For calc() expressions, return a default and handle via CSS
        return 600;
      }
    }
    return Math.min(displayData.length * rowHeight + headerHeight, 600);
  }, [scroll, displayData.length, rowHeight, headerHeight]);

  const containerWidth = useMemo(() => {
    if (scroll?.x) {
      if (typeof scroll.x === "number") {
        return scroll.x;
      }
      if (scroll.x === true || scroll.x === "max-content") {
        return totalWidth;
      }
    }
    return totalWidth;
  }, [scroll, totalWidth]);

  // Column width getter
  const getColumnWidth = useCallback(
    (index: number) => {
      return columnWidths[index] || 150;
    },
    [columnWidths]
  );

  // Row height getter
  const getRowHeight = useCallback(
    (index: number) => {
      return index === 0 ? headerHeight : rowHeight;
    },
    [headerHeight, rowHeight]
  );

  // Cell component
  const CellComponent = useCallback(
    ({
      columnIndex,
      rowIndex,
      style: cellStyle,
      columns: cols,
      dataSource: data,
      onRow: onRowProp,
      sortConfig: sortCfg,
      handleSort: handleSortProp,
      sticky: stickyProp,
    }: {
      columnIndex: number;
      rowIndex: number;
      style: React.CSSProperties;
    } & TableCellProps<T>) => {
      const column: any = cols[columnIndex];
      const isHeader = rowIndex === 0;

      if (isHeader) {
        const isSorted = sortCfg?.key === column.key;
        const sortDirection = isSorted ? sortCfg?.direction : null;

        return (
          <div
            className={`virtual-table-header-cell ${
              column.sorter ? "sortable" : ""
            }`}
            style={{
              ...cellStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: column.align || "center",
              padding: "12px 8px",
              fontWeight: 600,
              borderBottom: "2px solid #f0f0f0",
              borderRight: "1px solid #f0f0f0",
              backgroundColor: stickyProp ? "#fafafa" : "#fff",
              cursor: column.sorter ? "pointer" : "default",
            }}
            onClick={() => column.sorter && handleSortProp(column.key)}
          >
            <span>{column.title}</span>
            {isSorted && (
              <span style={{ marginLeft: 4, fontSize: 12 }}>
                {sortDirection === "ascend" ? "↑" : "↓"}
              </span>
            )}
          </div>
        );
      }

      const dataIndex = rowIndex - 1;
      const record = data[dataIndex];
      if (!record) return null;

      const value = record[column.dataIndex];
      const rendered = column.render
        ? column.render(value, record, dataIndex)
        : value;
      const rowProps = onRowProp ? onRowProp(record, dataIndex) : {};

      return (
        <div
          className="virtual-table-cell"
          style={{
            ...cellStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: column.align || "center",
            padding: "12px 8px",
            borderBottom: "1px solid #f0f0f0",
            borderRight: "1px solid #f0f0f0",
            backgroundColor: "#fff",
            cursor: rowProps.onClick ? "pointer" : "default",
          }}
          {...rowProps}
        >
          {rendered}
        </div>
      );
    },
    []
  );

  // Empty state
  if (displayData.length === 0) {
    return (
      <div
        className="virtual-table-empty"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          border: "1px solid #f0f0f0",
          ...style,
        }}
      >
        {locale?.emptyText || <Empty description="No Data" />}
      </div>
    );
  }

  // Calculate actual scroll height
  const scrollHeightStyle = scroll?.y
    ? typeof scroll.y === "string"
      ? { height: scroll.y }
      : { height: `${scroll.y}px` }
    : { height: `${containerHeight}px` };

  // Cell props
  const cellProps: TableCellProps<T> = {
    columns,
    dataSource: displayData,
    onRow,
    sortConfig,
    handleSort,
    sticky,
  };

  return (
    <div
      className="virtual-table-container"
      style={{
        ...style,
        ...scrollHeightStyle,
        width: "100%",
        border: "1px solid #f0f0f0",
        overflow: "auto",
      }}
    >
      <Grid
        className="virtual-table-grid"
        columnCount={columns.length}
        columnWidth={getColumnWidth}
        rowCount={displayData.length + 1} // +1 for header
        rowHeight={getRowHeight}
        cellComponent={CellComponent}
        cellProps={cellProps as any}
        style={{
          height: containerHeight,
          width: containerWidth,
          overflowX: scroll?.x ? "auto" : "hidden",
        }}
      />
    </div>
  );
}

// Export as default as well for easier imports
export default VirtualTable;
