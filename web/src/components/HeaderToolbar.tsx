import { Layout, Button, theme, Checkbox } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useAppStore } from '@/stores/useAppStore';
import { mainEngineRpc } from '@/engineRPCs/mainEngineRpc';
import { useNavigate } from 'react-router-dom';

import settings from '../../../.vntrader/connect_vision.json';

const { Header } = Layout;

export const HeaderToolbar = () => {
  const navigate = useNavigate();
  const { gateway, isShowLogs, isConnecting, isAutoShowLogs, actions: appActions } = useAppStore();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const connectGateway = async () => {
    appActions.setIsConnecting(true);
    await mainEngineRpc.connectAndTrack(settings, 'Vision');
  };

  const handleLogout = () => {
    mainEngineRpc.closeGateway(gateway);
    appActions.logout();
    navigate('/');
  };

  return (
    <Header
      className='flex justify-between items-center !px-5 sticky top-0 z-10 shadow-sm'
      style={{ background: colorBgContainer, height: 48 }}
    >
      <div className='text-lg font-bold'>{gateway && 'Gateway ' + gateway}</div>

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

        {gateway ? (
          <Button color='danger' variant='outlined' onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button loading={isConnecting} color='primary' variant='outlined' onClick={connectGateway}>
            Connect Gateway
          </Button>
        )}
      </div>
    </Header>
  );
};
