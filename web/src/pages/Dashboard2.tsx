import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useAppStore } from '../stores/useAppStore';
import { TickerSelect } from '@/components/TickerSelect';
import { useDataStore } from '@/stores/useDataStore';

export const Dashboard2 = () => {
  const isConnected = useAppStore((state) => state.gateway);
  const positions = useDataStore((state) => state.positions);
  const orders = useDataStore((state) => state.orderDatas);

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      <TickerSelect onSelect={console.log} />

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title='Connection Status'
              value={isConnected ? 'Connected' : 'Disconnected'}
              valueStyle={{ color: isConnected ? '#3f8600' : '#cf1322' }}
              prefix={isConnected ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
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
              value={orders.filter((o) => o.status === 'pending').length}
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
          <Card title='Recent Activity' bordered={false}>
            <p>No recent activity</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title='Market Overview' bordered={false}>
            <p>Market data will appear here</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
