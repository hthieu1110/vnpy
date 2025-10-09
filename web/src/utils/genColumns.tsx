import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import React from "react";

const STATUS_COLOR_MAP: Record<string, string> = {
  "All Traded": "green",
  "Cancelled": "red",
  "Rejected": "red",
  "Submitting": "orange",
  "Not Traded": "orange",
  "Part Traded": "orange",
  "Completed": "green",
}

const DIRECTION_COLOR_MAP: Record<string, string> = {
  "Long": "green",
  "Short": "red",
}

export const genColumns = (attrList: string[]) => {
  return attrList.map((attr) => ({
    title: attr.charAt(0).toUpperCase() + attr.slice(1).replace(/_/g, " "),
    dataIndex: attr,
    key: attr,
    align: "center" as const,
    render: (value: unknown, item: unknown): React.ReactNode => {
      let val = value;
      // boolean
      if (typeof value === "boolean") {
        val = value ? (
          <CheckOutlined color="green" />
        ) : (
          <CloseOutlined color="red" />
        );
      }
      // number
      else if (typeof value === "number") {
        if (attr === "datetime") {
          val = new Date(value * 1000).toLocaleString();
        } else {
          val = value.toLocaleString();
        }
      } 
      // string
      else if (typeof value === "string") { 
        if (attr === "direction") {
          val = (
            <Tag color={DIRECTION_COLOR_MAP[value]}>
              {value.toString()}
            </Tag>
          );
        } else if (attr === "status") {
          val = (
            <Tag color={STATUS_COLOR_MAP[value]}>
              {value.toString()}
            </Tag>
          );
        }
      } 

      return val as React.ReactNode;
    },
  }));
};
