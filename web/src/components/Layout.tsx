import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Button, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  StockOutlined,
  LineChartOutlined,
  SettingOutlined,
  FileTextOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';
import { rpcService } from '@/services/rpc';
import LogConsole from './LogConsole';
import settings from '../../../.vntrader/connect_vision.json';

const { Header, Content, Sider } = AntLayout;

export const Layout = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { gateway, logConsoleVisible } = useAppStore();
  const appActions = useAppStore((state) => state.actions);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/accounts',
      icon: <DollarOutlined />,
      label: 'Accounts',
    },
    {
      key: '/contracts',
      icon: <FileTextOutlined />,
      label: 'Contracts',
    },
    {
      key: '/trading',
      icon: <StockOutlined />,
      label: 'Trading',
    },
    {
      key: '/market',
      icon: <LineChartOutlined />,
      label: 'Market',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const connectGateway = async () => {
    setIsConnecting(true);
    await rpcService.call('connect', { gateway_name: 'Vision', setting: settings });
  };

  const logout = () => {
    appActions.setGateway(null);
  };

  useEffect(() => {
    if (gateway) {
      setIsConnecting(false);
    }
  }, [gateway]);

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={180} collapsedWidth={64}>
        <div className='text-lg font-bold text-center !m-1 !my-4'>{collapsed ? 'Yo !' : 'Trading Platform'}</div>
        <Menu
          theme='dark'
          selectedKeys={[location.pathname]}
          mode='inline'
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>

      <AntLayout>
        <Header className='flex justify-between items-center' style={{ background: colorBgContainer }}>
          <div className='text-lg font-bold'>{gateway && 'Gateway ' + gateway}</div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type={logConsoleVisible ? 'primary' : 'default'}
              icon={<FileTextOutlined />}
              onClick={() => appActions.setLogConsoleVisible(!logConsoleVisible)}
            >
              Logs
            </Button>

            {gateway ? (
              <Button color='danger' variant='outlined' onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button loading={isConnecting} color='primary' variant='outlined' onClick={connectGateway}>
                Connect Gateway
              </Button>
            )}
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </AntLayout>

      <LogConsole visible={logConsoleVisible} onClose={() => appActions.setLogConsoleVisible(false)} />
    </AntLayout>
  );
};

export default Layout;
