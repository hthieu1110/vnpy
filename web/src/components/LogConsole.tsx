import { Card, Button, Typography } from "antd";
import {
  ClearOutlined,
  DownOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useDataStore } from "@/stores/useDataStore";
import { useEffect, useRef } from "react";

const { Text } = Typography;

interface LogConsoleProps {
  visible: boolean;
  onClose: () => void;
}

export const LogConsole = ({ visible, onClose }: LogConsoleProps) => {
  const logs = useDataStore((state) => state.logs);
  const dataActions = useDataStore((state) => state.actions);
  const logConsoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logConsoleRef.current) {
      logConsoleRef.current.scrollTo({
        top: logConsoleRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs]);

  if (!visible) {
    return null;
  }

  return (
    <Card
      size="small"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 1024,
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        backgroundColor: "#f5f5f5",
      }}
      styles={{
        header: {
          backgroundColor: "white",
          padding: "0px 4px 0px 8px",
        },
        body: {
          padding: 4,
          maxHeight: "calc(100% - 44px)",
          scrollbarWidth: "thin",
          scrollbarColor: "#888 transparent",
        },
      }}
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileTextOutlined />
            <Text strong>Log Console</Text>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="text"
              icon={<ClearOutlined />}
              onClick={() => dataActions.setLogs([])}
            />
            <Button type="text" icon={<DownOutlined />} onClick={onClose} />
          </div>
        </div>
      }
    >
      <div
        ref={logConsoleRef}
        style={{ height: 320, overflow: "auto" }}
        className="flex flex-col gap-0.5"
      >
        {logs.map((log, index) => (
          <Text key={index}>
            {new Date(log.datetime).toLocaleString()} | {log.engine} | {log.msg}
          </Text>
        ))}
      </div>
    </Card>
  );
};

export default LogConsole;
