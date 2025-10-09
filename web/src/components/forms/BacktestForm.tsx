import { Card, Button, Form, Select, InputNumber, Space, Divider } from "antd";
import { TickerAutoComplete } from "@/components/TickerAutoComplete";
import { mainEngineRpc } from "@/engineRPCs/mainEngineRpc";
import { OrderRequest } from "@/types/object";
import { FormLayout } from "antd/es/form/Form";
import { useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useOrders } from "@/hooks/useOrders";
import { useBacktesterStore } from "@/stores/useBacktesterStore";

type BacktestFormProps = {
  layout?: FormLayout;
};

export const BacktestForm: React.FC<BacktestFormProps> = (props) => {
  const backtestParams = useBacktesterStore((state) => state.params);

  const [form] = Form.useForm();
  const [estimated, setEstimated] = useState(0);
  const { gateway } = useAppStore();
  const { cancelAllOrders, isOrderCancelling } = useOrders();

  const handleStartBacktest = async (values: any) => {
    form.resetFields();

    const defaultValues = {
      exchange: "GLOBAL",
      offset: "NONE",
      reference: "TEST",
    };

    const order: OrderRequest = {
      ...values,
      ...defaultValues,
    };

    const resp = await mainEngineRpc.sendOrder(order, gateway);
    console.log(resp);
  };

  const handleValuesChange = (_: any, allFields: any) => {
    setEstimated(Math.round(1000 * allFields.price * allFields.volume) / 1000);
  };

  const handleCancelAllOrders = () => {
    if (!confirm("Are you sure you want to cancel all orders?")) {
      return;
    }
    cancelAllOrders();
  };

  // strategy: string;
  // symbol: string;
  // exchange: string;
  // interval: string;
  // startDate: number;
  // endDate: number;
  // commissionRate: number;
  // slippage: number;
  // contractMultipler: number;
  // pricetick: number;
  // initialCapital: number;

  return (
    <Card title="New Backtest" style={{ marginBottom: 24 }}>
      <Form
        form={form}
        layout={props.layout || "inline"}
        onFinish={handleStartBacktest}
        initialValues={backtestParams}
        onValuesChange={handleValuesChange}
      >
        <Form.Item name="strategy" rules={[{ required: true }]}>
          <Select style={{ width: 200 }}>
            <Select.Option value="DoubleMaStrategy">
              Double Ma Strategy
            </Select.Option>
            <Select.Option value="AtrRsiStrategy">
              Atr Rsi Strategy
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="symbol"
          rules={[{ required: true, message: "Please input symbol!" }]}
        >
          <TickerAutoComplete style={{ width: 180 }} />
        </Form.Item>

        <Form.Item name="exchange" rules={[{ required: true }]}>
          <Select
            style={{ width: 100 }}
            options={[
              { label: "exchange1", value: "exchange1" },
              { label: "exchange2", value: "exchange2" },
            ]}
          />
        </Form.Item>

        <Form.Item name="interval" rules={[{ required: true }]}>
          <Select
            style={{ width: 100 }}
            options={[
              { label: "interval1", value: "interval1" },
              { label: "interval2", value: "interval2" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="price"
          rules={[{ required: true, message: "Please input price!" }]}
        >
          <InputDa
        </Form.Item>

        <Form.Item
          name="volume"
          rules={[{ required: true, message: "Please input volume!" }]}
        >
          <InputNumber
            placeholder="Volume"
            min={0.00001}
            style={{ width: 120 }}
          />
        </Form.Item>

        <div className="text-sm text-gray-500 !mb-4">
          Estimated: ${estimated}
        </div>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit Order
            </Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>

      <Divider />

      <Button
        variant="filled"
        color="danger"
        className="w-full"
        onClick={handleCancelAllOrders}
        loading={isOrderCancelling}
      >
        Cancel All
      </Button>
    </Card>
  );
};
