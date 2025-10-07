import { useState } from 'react'
import { Card, Table, Button, Form, Input, Select, InputNumber, Space, Tag } from 'antd'
import { useTradingStore } from '../store/useTradingStore'

const { Option } = Select

export const Trading = () => {
  const { positions, orders, addOrder } = useTradingStore()
  const [form] = Form.useForm()

  const positionColumns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Direction',
      dataIndex: 'direction',
      key: 'direction',
      render: (direction: string) => (
        <Tag color={direction === 'long' ? 'green' : 'red'}>
          {direction.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'P&L',
      key: 'pnl',
      render: () => (
        <span style={{ color: '#3f8600' }}>+$0.00</span>
      ),
    },
  ]

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => type.toUpperCase(),
    },
    {
      title: 'Direction',
      dataIndex: 'direction',
      key: 'direction',
      render: (direction: string) => (
        <Tag color={direction === 'buy' ? 'green' : 'red'}>
          {direction.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'filled' ? 'green' : status === 'cancelled' ? 'red' : 'blue'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button danger size="small" disabled={record.status !== 'pending'}>
          Cancel
        </Button>
      ),
    },
  ]

  const handleSubmitOrder = (values: any) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      ...values,
      status: 'pending' as const,
    }
    addOrder(newOrder)
    form.resetFields()
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Trading</h1>

      <Card title="New Order" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSubmitOrder}
          initialValues={{
            type: 'limit',
            direction: 'buy',
            volume: 1,
          }}
        >
          <Form.Item
            name="symbol"
            rules={[{ required: true, message: 'Please input symbol!' }]}
          >
            <Input placeholder="Symbol" style={{ width: 120 }} />
          </Form.Item>

          <Form.Item name="type" rules={[{ required: true }]}>
            <Select style={{ width: 100 }}>
              <Option value="limit">Limit</Option>
              <Option value="market">Market</Option>
            </Select>
          </Form.Item>

          <Form.Item name="direction" rules={[{ required: true }]}>
            <Select style={{ width: 100 }}>
              <Option value="buy">Buy</Option>
              <Option value="sell">Sell</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            rules={[{ required: true, message: 'Please input price!' }]}
          >
            <InputNumber
              placeholder="Price"
              min={0}
              step={0.01}
              style={{ width: 120 }}
            />
          </Form.Item>

          <Form.Item
            name="volume"
            rules={[{ required: true, message: 'Please input volume!' }]}
          >
            <InputNumber placeholder="Volume" min={1} style={{ width: 120 }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit Order
              </Button>
              <Button onClick={() => form.resetFields()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Positions" style={{ marginBottom: 24 }}>
        <Table
          columns={positionColumns}
          dataSource={positions}
          rowKey="symbol"
          pagination={false}
          locale={{ emptyText: 'No positions' }}
        />
      </Card>

      <Card title="Orders">
        <Table
          columns={orderColumns}
          dataSource={orders}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'No orders' }}
        />
      </Card>
    </div>
  )
}



