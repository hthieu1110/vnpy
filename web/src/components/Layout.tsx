import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout as AntLayout, theme, Divider } from "antd";

import { useAppStore } from "../stores/useAppStore";
import LogConsole from "./LogConsole";
import { HeaderToolbar } from "./HeaderToolbar";
import { LeftToolbar } from "./LeftToolbar";
import { useDataStore } from "@/stores/useDataStore";

const { Content, Sider } = AntLayout;

export const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { isShowLogs, isAutoShowLogs } = useAppStore();
  const appActions = useAppStore((state) => state.actions);
  const logs = useDataStore((state) => state.logs);

  useEffect(() => {
    if (isAutoShowLogs) {
      appActions.setLogConsoleVisible(true);
    }
  }, [logs]);

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={180}
        collapsedWidth={64}
      >
        <div className="text-lg font-bold text-center !m-1 !my-2 bg-transparent">
          {collapsed ? "Yo !" : "Trading Platform"}
        </div>
        <Divider />
        <LeftToolbar />
      </Sider>

      <AntLayout>
        <HeaderToolbar />

        <Content style={{ margin: 0 }}>
          <div
            style={{
              height: "100%",
              padding: 16,
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
        visible={isShowLogs}
        onClose={() => appActions.setLogConsoleVisible(false)}
      />
    </AntLayout>
  );
};

export default Layout;
