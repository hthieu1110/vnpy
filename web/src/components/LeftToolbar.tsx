import { Menu } from "antd";
import {
  DashboardOutlined,
  DollarOutlined,
  FileTextOutlined,
  StockOutlined,
  LineChartOutlined,
  SettingOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/useAppStore";
import { useEffect } from "react";

export const LeftToolbar = () => {
  const navigate = useNavigate();
  const gateway = useAppStore((state) => state.gateway);

  useEffect(() => {
    navigate("/");
  }, []);

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/accounts",
      icon: <DollarOutlined />,
      label: "Accounts",
    },
    {
      key: "/contracts",
      icon: <FileTextOutlined />,
      label: "Contracts",
    },
    {
      key: "/trading",
      icon: <StockOutlined />,
      label: "Trading",
    },
    {
      key: "/backtester",
      icon: <LineChartOutlined />,
      label: "Backtester",
    },
    {
      key: "/market",
      icon: <LineChartOutlined />,
      label: "Market",
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  return (
    <Menu
      theme="dark"
      selectedKeys={[location.pathname]}
      mode="inline"
      items={menuItems}
      onClick={({ key }) => navigate(key)}
      className="sticky top-0"
      disabled={!gateway}
    />
  );
};
