import { Card, Table, Input, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export const Market = () => {
  const marketData = [
    {
      symbol: 'BTCUSDT',
      name: 'Bitcoin',
      price: 43250.50,
      change: 2.5,
      volume: 1250000,
      high: 43500.00,
      low: 42800.00,
    },
    {
      symbol: 'ETHUSDT',
      name: 'Ethereum',
      price: 2250.75,
      change: -1.2,
      volume: 850000,
      high: 2280.00,
      low: 2240.00,
    },
  ]

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      sorter: (a: any, b: any) => a.symbol.localeCompare(b.symbol),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Last Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
      sorter: (a: any, b: any) => a.price - b.price,
    },
    {
      title: 'Change %',
      dataIndex: 'change',
      key: 'change',
      render: (change: number) => (
        <span style={{ color: change >= 0 ? '#3f8600' : '#cf1322' }}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
      ),
      sorter: (a: any, b: any) => a.change - b.change,
    },
    {
      title: '24h High',
      dataIndex: 'high',
      key: 'high',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: '24h Low',
      dataIndex: 'low',
      key: 'low',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: '24h Volume',
      dataIndex: 'volume',
      key: 'volume',
      render: (volume: number) => volume.toLocaleString(),
      sorter: (a: any, b: any) => a.volume - b.volume,
    },
  ]

  return (
    <div>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Input
            placeholder="Search symbol..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />

          <Table
            columns={columns}
            dataSource={marketData}
            rowKey="symbol"
            pagination={{ pageSize: 20 }}
          />
        </Space>
      </Card>
    </div>
  )
}


