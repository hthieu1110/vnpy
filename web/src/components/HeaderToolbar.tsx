import { Layout, Button, theme, Checkbox } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useAppStore } from '@/stores/useAppStore';
import { mainRpc } from '@/services/rpcs/mainRpc';
import { useNavigate } from 'react-router-dom';

import settings from '../../../.vntrader/connect_vision.json';

const { Header } = Layout;

export const HeaderToolbar = () => {
  const { connectedGateway, isShowLogs, isConnecting, isAutoShowLogs, actions: appActions } = useAppStore();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  const connectGateway = async (gateway_name: string) => {
    appActions.setIsConnecting(true);
    await mainRpc.connectAndTrack(settings, gateway_name);
  };

  const handleLogout = () => {
    mainRpc.closeGateway(connectedGateway);
    appActions.logout();
    navigate('/');
  };

  return (
    <Header
      className='flex justify-between items-center !px-5 sticky top-0 z-10 shadow-sm'
      style={{ background: colorBgContainer, height: 48 }}
    >
      {connectedGateway ? (
        <div className='text-lg font-bold'>{connectedGateway && 'Connected Gateway: ' + connectedGateway}</div>
      ) : (
        <div className='text-lg font-bold'>Connect to a Gateway to start trading</div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <Checkbox checked={isAutoShowLogs} onChange={(e) => appActions.setIsAutoShowLogs(e.target.checked)}>
          Auto Show Logs
        </Checkbox>

        <Button
          type={isShowLogs ? 'primary' : 'default'}
          icon={<FileTextOutlined />}
          onClick={() => appActions.setLogConsoleVisible(!isShowLogs)}
        >
          Logs
        </Button>

        {connectedGateway ? (
          <Button color='danger' variant='outlined' onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button loading={isConnecting} color='primary' variant='outlined' onClick={() => connectGateway('Vision')}>
            Connect to Gateway Vision
          </Button>
        )}
      </div>
    </Header>
  );
};
