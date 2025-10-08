import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout as AntLayout, Button, Menu, theme } from "antd";
import {
  DashboardOutlined,
  StockOutlined,
  LineChartOutlined,
  SettingOutlined,
  FileTextOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useAppStore } from "../store/useAppStore";
import LogConsole from "./LogConsole";
import { HeaderToolbar } from "./HeaderToolbar";
import { LeftToolbar } from "./LeftToolbar";

const { Content, Sider } = AntLayout;

export const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { isShowLogs } = useAppStore();
  const appActions = useAppStore((state) => state.actions);

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={180}
        collapsedWidth={64}
      >
        <div className="text-lg font-bold text-center !m-1 !my-2">
          {collapsed ? "Yo !" : "Trading Platform"}
        </div>
        <LeftToolbar />
      </Sider>

      <AntLayout>
        <HeaderToolbar />

        <Content style={{ margin: "16px 16px 0" }}>
          <div
            style={{
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
