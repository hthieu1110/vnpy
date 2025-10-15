import React, { useMemo, useRef, useState, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Checkbox, Tag } from 'antd';
import { CaretUpOutlined, CaretDownOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TableProps, ColumnType } from 'antd/es/table';

// Extended column type with flex support
export interface VirtualTableColumnType<T = any> extends ColumnType<T> {
  flex?: number;
}

// Types
export interface VirtualTableProps<T = any> extends Omit<TableProps<T>, 'dataSource' | 'columns' | 'pagination'> {
  dataSource: T[];
  columns: VirtualTableColumnType<T>[];
  height?: number;
  itemHeight?: number;
  overscan?: number;
  enableSorting?: boolean;
  enableSelection?: boolean;
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  selectedRowKeys?: React.Key[];
  rowKey?: string | ((record: T) => string);
}

// Default row height
const DEFAULT_ROW_HEIGHT = 28;

// Status color mappings (from useTableColumns)
const STATUS_COLOR_MAP: Record<string, string> = {
  'All Traded': 'green',
  Cancelled: 'red',
  Rejected: 'red',
  Submitting: 'orange',
  'Not Traded': 'orange',
  'Part Traded': 'orange',
  Completed: 'green',
};

const DIRECTION_COLOR_MAP: Record<string, string> = {
  Long: 'green',
  Short: 'red',
};

// Utility function to calculate column widths based on flex values
const calculateColumnWidths = (
  columns: VirtualTableColumnType<any>[],
  enableSelection: boolean
): { [key: string]: string } => {
  const totalFlex = columns.reduce((sum, col) => sum + (col.flex || 1), 0) + (enableSelection ? 1 : 0);
  const widths: { [key: string]: string } = {};

  if (enableSelection) {
    widths['selection'] = `${(1 / totalFlex) * 100}%`;
  }

  columns.forEach((column, index) => {
    const key = column.key || column.dataIndex || index;
    const flex = column.flex || 1;
    widths[key] = `${(flex / totalFlex) * 100}%`;
  });

  return widths;
};

// Utility function to render cell content
const renderCellContent = (value: unknown, column: ColumnType<any>, record: any): React.ReactNode => {
  if (column.render) {
    const rendered = column.render(value, record, 0);
    return rendered as React.ReactNode;
  }

  // Handle boolean values
  if (typeof value === 'boolean') {
    return value ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />;
  }

  // Handle numbers
  if (typeof value === 'number') {
    const dataIndex = Array.isArray(column.dataIndex)
      ? column.dataIndex[column.dataIndex.length - 1]
      : column.dataIndex;

    if (dataIndex === 'datetime') {
      return new Date(value * 1000).toLocaleString();
    }
    return value.toLocaleString();
  }

  // Handle strings
  if (typeof value === 'string') {
    const dataIndex = Array.isArray(column.dataIndex)
      ? column.dataIndex[column.dataIndex.length - 1]
      : column.dataIndex;

    if (dataIndex === 'direction') {
      return <Tag color={DIRECTION_COLOR_MAP[value]}>{value}</Tag>;
    } else if (dataIndex === 'status') {
      return <Tag color={STATUS_COLOR_MAP[value]}>{value}</Tag>;
    }
  }

  return value as React.ReactNode;
};

// Sort direction type
type SortDirection = 'ascend' | 'descend' | null;

export const VirtualTable = <T extends Record<string, any>>({
  dataSource = [],
  columns = [],
  height = 400,
  itemHeight = DEFAULT_ROW_HEIGHT,
  overscan = 5,
  enableSorting = true,
  enableSelection = false,
  onSelectionChange,
  selectedRowKeys = [],
  rowKey = 'key',
  className,
  style,
  ...restProps
}: VirtualTableProps<T>) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string | number;
    direction: SortDirection;
  } | null>(null);

  // Get row key function
  const getRowKey = useCallback(
    (record: T, index: number): string => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }
      return record[rowKey]?.toString() || index.toString();
    },
    [rowKey]
  );

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig || !enableSorting) {
      return dataSource;
    }

    return [...dataSource].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      const result = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'ascend' ? result : -result;
    });
  }, [dataSource, sortConfig, enableSorting]);

  // Virtualizer
  const virtualizer = useVirtualizer({
    count: sortedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  // Handle sort
  const handleSort = useCallback(
    (column: ColumnType<T>) => {
      if (!enableSorting || !column.sorter || !column.dataIndex) {
        return;
      }

      const dataIndex = Array.isArray(column.dataIndex)
        ? column.dataIndex[column.dataIndex.length - 1]
        : column.dataIndex;

      setSortConfig((prev) => {
        if (prev && prev.key === dataIndex) {
          if (prev.direction === 'ascend') {
            return { key: dataIndex, direction: 'descend' };
          } else if (prev.direction === 'descend') {
            return null;
          }
        }
        return { key: dataIndex, direction: 'ascend' };
      });
    },
    [enableSorting]
  );

  // Handle row selection
  const handleRowSelection = useCallback(
    (record: T, checked: boolean) => {
      if (!onSelectionChange) return;

      const key = getRowKey(record, 0);
      let newSelectedKeys: React.Key[];

      if (checked) {
        newSelectedKeys = [...selectedRowKeys, key];
      } else {
        newSelectedKeys = selectedRowKeys.filter((k) => k !== key);
      }

      const newSelectedRows = sortedData.filter((item) => newSelectedKeys.includes(getRowKey(item, 0)));

      onSelectionChange(newSelectedKeys, newSelectedRows);
    },
    [onSelectionChange, selectedRowKeys, sortedData, getRowKey]
  );

  // Handle select all
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (!onSelectionChange) return;

      if (checked) {
        const allKeys = sortedData.map((item, index) => getRowKey(item, index));
        onSelectionChange(allKeys, sortedData);
      } else {
        onSelectionChange([], []);
      }
    },
    [onSelectionChange, sortedData, getRowKey]
  );

  // Check if all rows are selected
  const isAllSelected = sortedData.length > 0 && selectedRowKeys.length === sortedData.length;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < sortedData.length;

  // Calculate column widths based on flex values
  const columnWidths = calculateColumnWidths(columns, enableSelection);

  return (
    <div
      className={`virtual-table ${className || ''}`}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', ...style }}
    >
      {/* Sticky Header */}
      <div style={{ flexShrink: 0 }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            minWidth: '100%',
          }}
        >
          <thead>
            <tr>
              {enableSelection && (
                <th
                  style={{
                    width: columnWidths['selection'],
                    padding: '2px 4px',
                    borderBottom: '1px solid #f0f0f0',
                    borderRight: '1px solid #e8e8e8',
                    background: '#fafafa',
                  }}
                >
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((column, index) => {
                const dataIndex = Array.isArray(column.dataIndex)
                  ? column.dataIndex[column.dataIndex.length - 1]
                  : column.dataIndex;

                const isSorted = sortConfig && sortConfig.key === dataIndex;
                const sortDirection = isSorted ? sortConfig.direction : null;

                const columnKey = column.key || dataIndex || index;
                const isLastColumn = index === columns.length - 1;
                return (
                  <th
                    key={columnKey}
                    style={{
                      width: columnWidths[columnKey],
                      padding: '2px 4px',
                      borderBottom: '1px solid #f0f0f0',
                      borderRight: isLastColumn ? 'none' : '1px solid #e8e8e8',
                      background: '#fafafa',
                      textAlign: column.align || 'left',
                      cursor: enableSorting && column.sorter ? 'pointer' : 'default',
                      userSelect: 'none',
                      position: 'relative',
                    }}
                    onClick={() => handleSort(column)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:
                          column.align === 'center' ? 'center' : column.align === 'right' ? 'flex-end' : 'flex-start',
                        minWidth: 0, // Allow flex item to shrink
                      }}
                    >
                      <span
                        style={{
                          marginRight: 4,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          flex: 1,
                        }}
                      >
                        {typeof column.title === 'string' ? column.title : String(column.title)}
                      </span>
                      {enableSorting && column.sorter && (
                        <span
                          style={{
                            fontSize: 12,
                            color: '#999',
                            flexShrink: 0, // Prevent sort icon from shrinking
                          }}
                        >
                          {sortDirection === 'ascend' ? (
                            <CaretUpOutlined />
                          ) : sortDirection === 'descend' ? (
                            <CaretDownOutlined />
                          ) : (
                            <CaretDownOutlined style={{ opacity: 0.3 }} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable Body */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          height: height - 32, // Subtract header height
        }}
        ref={parentRef}
      >
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              minWidth: '100%',
            }}
          >
            <tbody>
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const record = sortedData[virtualItem.index];
                const key = getRowKey(record, virtualItem.index);
                const isSelected = selectedRowKeys.includes(key);

                return (
                  <tr
                    key={key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                      background: isSelected ? '#e6f7ff' : 'transparent',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'table',
                      tableLayout: 'fixed',
                    }}
                    onClick={() => {
                      if (restProps.onRow) {
                        const rowProps = restProps.onRow(record, virtualItem.index);
                        if (rowProps?.onClick) {
                          rowProps.onClick({} as React.MouseEvent);
                        }
                      }
                    }}
                  >
                    {enableSelection && (
                      <td
                        style={{
                          width: columnWidths['selection'],
                          padding: '2px 4px',
                          textAlign: 'center',
                          display: 'table-cell',
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelection(record, e.target.checked);
                          }}
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => {
                      const dataIndex = Array.isArray(column.dataIndex)
                        ? column.dataIndex[column.dataIndex.length - 1]
                        : column.dataIndex;

                      const value = dataIndex ? record[dataIndex] : record;

                      const columnKey = column.key || dataIndex || colIndex;
                      return (
                        <td
                          key={columnKey}
                          style={{
                            width: columnWidths[columnKey],
                            padding: '2px 4px',
                            textAlign: column.align || 'left',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 0, // Force ellipsis to work
                            display: 'table-cell',
                          }}
                          title={String(value)} // Show full text on hover
                        >
                          {renderCellContent(value, column, record)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VirtualTable;
