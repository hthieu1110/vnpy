import { useState, useEffect } from 'react';
import { Card, Button, Typography } from 'antd';
import { ClearOutlined, CloseOutlined, FileTextOutlined } from '@ant-design/icons';
import { centriService } from '@/services/centri';
import { EVENT_LOG } from '@/consts/events';

const { Text } = Typography;

interface LogConsoleProps {
  visible: boolean;
  onClose: () => void;
}

type Log = {
  datetime: string;
  event_type: string;
  event_data: {
    gateway_name: string;
    extra: string;
    msg: string;
  };
};

export const LogConsole = ({ visible, onClose }: LogConsoleProps) => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const channel = 'event.' + EVENT_LOG;

    centriService.subscribe(channel, (ctx) => {
      const log = ctx.data;
      log.datetime = new Date().toLocaleString();
      setLogs((prevLogs) => [...prevLogs, log]);
    });

    // return () => {
    //   centriService.unsubscribe(channel);
    // };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Card
      size='small'
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 640,
        height: 360,
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        backgroundColor: '#f5f5f5',
      }}
      styles={{
        header: {
          backgroundColor: 'white',
          padding: '0px 4px 0px 8px',
        },
        body: {
          padding: 4,
          overflow: 'auto',
        },
      }}
      title={
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <FileTextOutlined />
            <Text strong>Log Console</Text>
          </div>

          <div className='flex items-center gap-2'>
            <Button type='text' icon={<ClearOutlined />} onClick={() => setLogs([])} />
            <Button type='text' icon={<CloseOutlined />} onClick={onClose} />
          </div>
        </div>
      }
    >
      <div className='flex flex-col gap-0.5'>
        {logs.map((log, index) => (
            <Text key={index}>
              {log.datetime} | {log.event_data.gateway_name} | {log.event_type}: {log.event_data.msg}
            </Text>
        ))}
      </div>
    </Card>
  );
};

export default LogConsole;
