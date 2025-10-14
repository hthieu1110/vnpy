/**
 * VirtualTable Example Component
 * 
 * This file demonstrates how to use the VirtualTable component
 * as a drop-in replacement for Ant Design's Table.
 */

import { VirtualTable } from ".";
import { Tag } from "antd";

// Example data type
interface OrderData {
  orderid: string;
  symbol: string;
  direction: "Long" | "Short";
  price: number;
  volume: number;
  status: string;
  datetime: number;
}

// Generate mock data
const generateMockData = (count: number): OrderData[] => {
  const statuses = ["All Traded", "Not Traded", "Part Traded", "Cancelled"];
  const symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"];
  const directions: Array<"Long" | "Short"> = ["Long", "Short"];

  return Array.from({ length: count }, (_, i) => ({
    orderid: `ORD${i + 1}`,
    symbol: symbols[i % symbols.length],
    direction: directions[i % 2],
    price: Math.random() * 1000 + 100,
    volume: Math.floor(Math.random() * 1000) + 1,
    status: statuses[i % statuses.length],
    datetime: Date.now() - Math.random() * 86400000,
  }));
};

export const VirtualTableExample = () => {
  // Generate 1000 rows of mock data for demonstration
  const data = generateMockData(1000);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderid",
      key: "orderid",
      width: 120,
      align: "center" as const,
      sorter: (a: OrderData, b: OrderData) => 
        parseInt(a.orderid.slice(3)) - parseInt(b.orderid.slice(3)),
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      width: 100,
      align: "center" as const,
    },
    {
      title: "Direction",
      dataIndex: "direction",
      key: "direction",
      width: 100,
      align: "center" as const,
      render: (value: string) => (
        <Tag color={value === "Long" ? "green" : "red"}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      align: "center" as const,
      sorter: (a: OrderData, b: OrderData) => a.price - b.price,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: "Volume",
      dataIndex: "volume",
      key: "volume",
      width: 100,
      align: "center" as const,
      sorter: (a: OrderData, b: OrderData) => a.volume - b.volume,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center" as const,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          "All Traded": "green",
          "Not Traded": "orange",
          "Part Traded": "blue",
          "Cancelled": "red",
        };
        return <Tag color={colorMap[value]}>{value}</Tag>;
      },
    },
    {
      title: "Date & Time",
      dataIndex: "datetime",
      key: "datetime",
      width: 180,
      align: "center" as const,
      sorter: (a: OrderData, b: OrderData) => a.datetime - b.datetime,
      render: (value: number) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>VirtualTable Example - 1,000 Rows</h2>
      <p style={{ marginBottom: 16, color: "#666" }}>
        This table efficiently renders 1,000 rows using virtualization.
        Try scrolling, sorting, and clicking on rows!
      </p>

      <VirtualTable
        dataSource={data}
        columns={columns}
        rowKey="orderid"
        sticky
        scroll={{
          y: 600,
          x: true,
        }}
        onRow={(record) => ({
          onClick: () => {
            console.log("Clicked row:", record);
            alert(`Clicked order: ${record.orderid}`);
          },
        })}
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
};

export default VirtualTableExample;

