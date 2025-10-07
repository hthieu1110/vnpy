import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Button, Menu, theme } from 'antd';
import { DashboardOutlined, StockOutlined, LineChartOutlined, SettingOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';
import { rpcService } from '@/services/rpc';
import LogConsole from './LogConsole';
import settings from '../../../.vntrader/connect_vision.json';

const { Header, Content, Sider } = AntLayout;

export const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { gateway, setGateway, logConsoleVisible, setLogConsoleVisible } = useAppStore();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
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
    await rpcService.call("connect", { gateway_name: "Vision", setting: settings });
    setGateway("Vision");
  };

  const logout = () => {
    setGateway(null);
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
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
          <div className='text-lg font-bold'>Trading Platform</div>
          <div className='text-lg font-bold'>{gateway && "Gateway " + gateway}</div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              type={logConsoleVisible ? 'primary' : 'default'}
              icon={<FileTextOutlined />}
              onClick={() => setLogConsoleVisible(!logConsoleVisible)}
            >
              Logs
            </Button>
            
            {gateway ? (
              <Button color='danger' variant='outlined' onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button color='primary' variant='outlined' onClick={connectGateway}>
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
      
      <LogConsole 
        visible={logConsoleVisible} 
        onClose={() => setLogConsoleVisible(false)} 
      />
    </AntLayout>
  );
};

export default Layout;
