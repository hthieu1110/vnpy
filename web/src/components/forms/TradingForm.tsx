import { Card, Button, Form, Select, InputNumber, Space, Divider } from "antd";
import { TickerAutoComplete } from "@/components/TickerAutoComplete";
import { mainEngineRpc } from "@/engineRpcs/mainEngineRpc";
import { OrderRequest, SubscribeRequest } from "@/types/object";
import { FormLayout } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useOrders } from "@/hooks/useOrders";
import { Direction, Offset, Type } from "@/types/constants";

type TradingFormProps = {
  layout?: FormLayout;
  onSelectSymbol?: (symbol: string) => void;
};

export const TradingForm: React.FC<TradingFormProps> = (props) => {
  const [form] = Form.useForm();
  const [estimated, setEstimated] = useState(0);
  const { gateway } = useAppStore();
  const { cancelAllOrders, isOrderCancelling } = useOrders();

  const currentSymbol = form.getFieldValue("symbol");
  useEffect(() => {
    if (currentSymbol) {
      const subRequest: SubscribeRequest = {
        symbol: currentSymbol,
        exchange: "GLOBAL",
      };
      mainEngineRpc.subscribe(subRequest, gateway);
    }
  }, [currentSymbol, gateway]);

  const handleSubmitOrder = async (values: any) => {
    // form.resetFields();

    const defaultValues = {
      exchange: "GLOBAL",
      offset: Offset.NONE,
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

  return (
    <Card title="New Order" style={{ marginBottom: 24 }}>
      <Form
        form={form}
        layout={props.layout || "inline"}
        onFinish={handleSubmitOrder}
        initialValues={{
          symbol: "SOLUSDT_SPOT_BINANCE",
          exchange: "GLOBAL",
          direction: Direction.LONG,
          type: Type.LIMIT,
          volume: 0.1,
          price: 200,
          offset: Offset.NONE,
          reference: "TEST",
        }}
        onValuesChange={handleValuesChange}
        className="form-compact"
      >
        <Form.Item
          label="Symbol"
          name="symbol"
          rules={[{ required: true, message: "Please input symbol!" }]}
        >
          <TickerAutoComplete
            style={{ width: 210 }}
            onSelect={props.onSelectSymbol}
          />
        </Form.Item>

        <div className="flex flex-row gap-2">
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select
              style={{ width: 100 }}
              options={Object.values(Type).map((value) => ({
                label: value,
                value,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Direction"
            name="direction"
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: 100 }}
              options={Object.values(Direction).map((value) => ({
                label: value,
                value,
              }))}
            />
          </Form.Item>
        </div>

        <div className="flex flex-row gap-2">
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <InputNumber placeholder="Price" min={0} style={{ width: 100 }} />
          </Form.Item>

          <Form.Item
            label="Volume"
            name="volume"
            rules={[{ required: true, message: "Please input volume!" }]}
          >
            <InputNumber
              placeholder="Volume"
              min={0.00001}
              style={{ width: 100 }}
            />
          </Form.Item>
        </div>

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
