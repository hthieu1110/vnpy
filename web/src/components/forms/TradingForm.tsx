import { Card, Button, Form, Select, InputNumber, Space, Divider } from "antd";
import { TickerSelect } from "@/components/TickerSelect";
import { mainEngineRPC } from "@/engineRPCs/mainEngineRPC";
import { OrderRequest } from "@/types/object";
import { FormLayout } from "antd/es/form/Form";
import { useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useOrders } from "@/hooks/useOrders";

type TradingFormProps = {
  layout?: FormLayout;
};

export const TradingForm: React.FC<TradingFormProps> = (props) => {
  const [form] = Form.useForm();
  const [estimated, setEstimated] = useState(0);
  const { gateway } = useAppStore();
  const { cancelAllOrders, isOrderCancelling } = useOrders();  

  const handleSubmitOrder = async (values: any) => {
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

    const resp = await mainEngineRPC.sendOrder(order, gateway);
    console.log(resp);
  };

  const handleValuesChange = (_: any, allFields: any) => {
    setEstimated(Math.round(1000 * allFields.price * allFields.volume) / 1000);
  };

  return (
    <Card title="New Order" style={{ marginBottom: 24 }}>
      <Form
        form={form}
        layout={props.layout || "inline"}
        onFinish={handleSubmitOrder}
        initialValues={{
          symbol: "BTCUSDT_SPOT_BINANCE",
          exchange: "GLOBAL",
          direction: "LONG",
          type: "LIMIT",
          volume: 1,
          price: 100,
          offset: "NONE",
          reference: "TEST",
        }}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          name="symbol"
          rules={[{ required: true, message: "Please input symbol!" }]}
        >
          <TickerSelect style={{ width: 200 }} />
        </Form.Item>

        <Form.Item name="type" rules={[{ required: true }]}>
          <Select
            style={{ width: 100 }}
            options={[
              { label: "Limit", value: "LIMIT" },
              { label: "Market", value: "MARKET" },
            ]}
          />
        </Form.Item>

        <Form.Item name="direction" rules={[{ required: true }]}>
          <Select
            style={{ width: 100 }}
            options={[
              { label: "Long", value: "LONG" },
              { label: "Short", value: "SHORT" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="price"
          rules={[{ required: true, message: "Please input price!" }]}
        >
          <InputNumber placeholder="Price" min={0} style={{ width: 120 }} />
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
        onClick={() => cancelAllOrders()}
        loading={isOrderCancelling}
      >
        Cancel All
      </Button>
    </Card>
  );
};
