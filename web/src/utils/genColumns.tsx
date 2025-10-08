import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import React from "react";

export const genColumns = (attrList: string[]) => {
  return attrList.map((attr) => ({
    title: attr.charAt(0).toUpperCase() + attr.slice(1).replace(/_/g, " "),
    dataIndex: attr,
    key: attr,
    align: "center" as const,
    render: (value: unknown): React.ReactNode => {
      let val = value;
      // boolean
      if (typeof value === "boolean") {
        val = value ? (
          <CheckOutlined color="green" />
        ) : (
          <CloseOutlined color="red" />
        );
      }
      // datetime
      else if (typeof value === "number" && attr === "datetime") {
        val = new Date(value * 1000).toLocaleString();
      } 
      // number
      else if (typeof value === "number") {
        val = value.toLocaleString();
      } 
      // direction
      else if (typeof value === "string" && attr === "direction") {
        val = (
          <Tag color={value === "Long" ? "green" : "red"}>
            {value.toString()}
          </Tag>
        );
      } 
      // status
      else if (typeof value === "string" && attr === "status") {
        let color = "#666";
        if (value === "Rejected") {
          color = "red";
        } else if (value === "All Traded") {
          color = "green";
        }
        val = <Tag color={color}>{value.toString()}</Tag>;
      }

      return val as React.ReactNode;
    },
  }));
};
