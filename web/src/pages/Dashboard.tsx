import { Layout, Model } from "flexlayout-react";
import json from "./dashboard-layout.json";
import 'flexlayout-react/style/light.css';
import { AccountsWidget } from "@/widgets/AccountsWidget";
import { ContractsWidget } from "@/widgets/ContractsWidget";

const model = Model.fromJson(json);


export const Dashboard = () => {
  const factory = (node: any) => {
    const componentName = node.getComponent();
    let Component = null;
    switch (componentName) {
      case "AccountsWidget":
        Component = <AccountsWidget />;
        break;
      case "ContractsWidget":
        Component = <ContractsWidget />;
        break;
    }
    return <div style={{ padding: '16px' }}>{Component}</div>;
  };

  return <div style={{ height: "100%", width: "100%", position: "relative" }}>
    <Layout model={model} factory={factory} />
  </div>;
};
