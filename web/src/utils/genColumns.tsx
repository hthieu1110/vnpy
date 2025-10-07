import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React from 'react';

export const genColumns = (attrList: string[]) => {
  return attrList.map((attr) => ({
    title: attr.charAt(0).toUpperCase() + attr.slice(1).replace(/_/g, ' '),
    dataIndex: attr,
    key: attr,
    align: 'center' as const,
    render: (value: unknown): React.ReactNode => {
      let val = value;
      if (typeof value === 'boolean') {
        val = value ? <CheckOutlined color='green' /> : <CloseOutlined color='red' />;
      } else if (typeof value === 'number') {
        val = value.toLocaleString();
      }
      return val as React.ReactNode;
    },
  }));
};
