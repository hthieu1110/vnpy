import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useAppStore } from '../stores/useAppStore';
import { useDataStore } from '@/stores/useDataStore';
import { Status } from '@/types/constants';
import { useMemo } from 'react';
import { OrdersTable } from '@/components/tables/OrdersTable';

export const Dashboard = () => {
  const connectedGateway = useAppStore((state) => state.connectedGateway);
  const positions = useDataStore((state) => state.positions);
  const orders = useDataStore((state) => state.orders);

  const pendingOrders = useMemo(() => orders.filter((o) => o.status === Status.SUBMITTING || o.status === Status.NOTTRADED), [orders]);
  const completedOrders = useMemo(() => orders.filter((o) => o.status === Status.ALLTRADED || o.status === Status.PARTTRADED), [orders]);

  if (!connectedGateway) {
    return null;
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title='Connection Status'
              value={connectedGateway ? 'Connected' : 'Disconnected'}
              valueStyle={{ color: connectedGateway ? '#3f8600' : '#cf1322' }}
              prefix={connectedGateway ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title='Active Positions' value={positions.length} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Pending Orders'
              value={pendingOrders.length}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Total P&L'
              value={0}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix='$'
              suffix=''
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title='Recent Activity'>
            <p>No recent activity</p>
          </Card>
        </Col>

        <Col span={12} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <OrdersTable
            height={200}
            title={`Pending Orders (${pendingOrders.length})`}
            orders={pendingOrders}
            excludes={["status", "type", "traded", "orderid"]}
          />

          <OrdersTable
            height={200}
            title={`Completed Orders (${completedOrders.length})`}
            orders={completedOrders}
            excludes={["status", "type", "traded", "orderid"]}
          />
        </Col>
      </Row>
    </div>
  );
};
