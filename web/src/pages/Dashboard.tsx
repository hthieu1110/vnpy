import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useAppStore } from '../stores/useAppStore';
import { useDataStore } from '@/stores/useDataStore';
import { Status } from '@/types/constants';
import { useMemo } from 'react';

export const Dashboard = () => {
  const connectedGateway = useAppStore((state) => state.connectedGateway);
  const positions = useDataStore((state) => state.positions);
  const orders = useDataStore((state) => state.orders);

  const pendingOrders = useMemo(() => orders.filter((o) => o.status === Status.SUBMITTING || o.status === Status.NOTTRADED), [orders]);

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

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title='Recent Activity'>
            <p>No recent activity</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title='Market Overview'>
            <p>Market data will appear here</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
