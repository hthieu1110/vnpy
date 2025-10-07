import React, { useMemo } from 'react';
import { Table, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface DynamicTableProps<T extends Record<string, any>> extends Omit<TableProps<T>, 'columns'> {
  data: T[];
  columnConfig?: {
    excludeKeys?: string[];
    customTitles?: Record<string, string>;
    customRenderers?: Record<string, (value: any, record: T) => React.ReactNode>;
    typeConfig?: Record<string, {
      type: 'string' | 'number' | 'boolean' | 'date' | 'currency' | 'percentage';
      width?: number;
      align?: 'left' | 'center' | 'right';
    }>;
  };
  mode?: 'basic' | 'typed' | 'smart' | 'filterable';
}

export function DynamicTable<T extends Record<string, any>>({
  data,
  columnConfig = {},
  mode = 'basic',
  ...tableProps
}: DynamicTableProps<T>) {
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const firstItem = data[0];
    const keys = Object.keys(firstItem);
    const { 
      excludeKeys = [], 
      customTitles = {}, 
      customRenderers = {},
      typeConfig = {}
    } = columnConfig;
    
    const filteredKeys = keys.filter(key => !excludeKeys.includes(key));
    
    return filteredKeys.map((key) => {
      const value = firstItem[key];
      const type = typeConfig[key]?.type || detectType(value);
      
      return {
        title: customTitles[key] || formatTitle(key),
        dataIndex: key,
        key: key,
        width: typeConfig[key]?.width,
        align: typeConfig[key]?.align,
        sorter: mode === 'filterable' ? (a: T, b: T) => {
          const aVal = a[key];
          const bVal = b[key];
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal);
          }
          return (aVal || 0) - (bVal || 0);
        } : undefined,
        render: customRenderers[key] || getDefaultRenderer(type),
      };
    });
  }, [data, columnConfig, mode]);

  return <Table {...tableProps} dataSource={data} columns={columns} />;
}

// Helper functions
function detectType(value: any): 'string' | 'number' | 'boolean' | 'date' | 'currency' | 'percentage' {
  if (typeof value === 'number') {
    // Check if it looks like a percentage
    if (value <= 1 && value >= -1) return 'percentage';
    // Check if it looks like currency (has decimal places)
    if (value % 1 !== 0) return 'currency';
    return 'number';
  }
  if (typeof value === 'boolean') return 'boolean';
  if (value instanceof Date) return 'date';
  if (typeof value === 'string' && !isNaN(Date.parse(value))) return 'date';
  return 'string';
}

function formatTitle(key: string): string {
  return key
    .charAt(0)
    .toUpperCase() + 
    key
      .slice(1)
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim();
}

function getDefaultRenderer(type: string) {
  return (value: any) => {
    switch (type) {
      case 'number':
        return value?.toLocaleString() || 0;
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value || 0);
      case 'percentage':
        return `${((value || 0) * 100).toFixed(2)}%`;
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '';
      default:
        return value;
    }
  };
}

// Usage examples for different data types
export const DynamicTableExamples = () => {
  const accounts = [
    { accountid: 'ACC001', balance: 10000.50, frozen: 500.25, gateway_name: 'Binance' },
    { accountid: 'ACC002', balance: 25000.75, frozen: 0, gateway_name: 'IB' }
  ];

  const contracts = [
    { symbol: 'BTCUSDT', exchange: 'BINANCE', size: 0.001, pricetick: 0.01 },
    { symbol: 'AAPL', exchange: 'NASDAQ', size: 1, pricetick: 0.01 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3>Accounts Table</h3>
        <DynamicTable
          data={accounts}
          mode="typed"
          columnConfig={{
            typeConfig: {
              'balance': { type: 'currency', width: 120 },
              'frozen': { type: 'currency', width: 120 },
            }
          }}
        />
      </div>
      
      <div>
        <h3>Contracts Table</h3>
        <DynamicTable
          data={contracts}
          mode="basic"
          columnConfig={{
            customTitles: {
              'symbol': 'Symbol',
              'exchange': 'Exchange',
              'size': 'Contract Size',
              'pricetick': 'Price Tick'
            }
          }}
        />
      </div>
    </div>
  );
};
