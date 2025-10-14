import { Form, Select, InputNumber, DatePicker, Input, Button } from "antd";
import { TickerAutoComplete } from "@/components/TickerAutoComplete";
import { useBacktesterStore } from "@/stores/useBacktesterStore";
import { Interval, Strategy } from "@/types";
import { useEffect, useMemo } from "react";
import { useBacktester } from "@/hooks/useBacktester";

export const BACKTEST_FORM_HEIGHT = 350;

type BacktestFormProps = {
  strategies: Strategy[];
};

export const BacktestForm = (props: BacktestFormProps) => {
  const { strategies } = props;
  const { params, actions: backtesterActions } = useBacktesterStore();
  const { startDownloadData, isDownloading } = useBacktester();

  const [form] = Form.useForm();
  const currentStrategyName = form.getFieldValue("strategy");

  const handleValuesChange = (_: any, allFields: any) => {
    backtesterActions.updateParams(allFields);
  };

  useEffect(() => {
    const strategyParams = strategies.find(
      (strategy) => strategy.strategy_name === currentStrategyName
    )?.strategy_params;
    const strategySettings = strategyParams
      ? JSON.stringify(strategyParams)
      : "";
    backtesterActions.updateParams({ strategySettings });

    form.setFieldsValue({ strategySettings });
  }, [currentStrategyName, strategies, backtesterActions, form]);

  const strategiesGroups = useMemo(() => {
    return [
      {
        label: "User Strategies ------",
        options: strategies.filter((strategy) =>
          strategy.strategy_name.startsWith("My")
        ),
      },
      {
        label: "Default Strategies ------",
        options: strategies.filter(
          (strategy) => !strategy.strategy_name.startsWith("My")
        ),
      },
    ];
  }, [strategies]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={params}
      onValuesChange={handleValuesChange}
      style={{ display: "flex", flexDirection: "column" }}
      className="form-compact"
    >
      <div style={{ display: "flex", flexDirection: "row", gap: 16 }}>
        <Form.Item
          label="Symbol"
          name="symbol"
          rules={[{ required: true, message: "Please input symbol!" }]}
        >
          <TickerAutoComplete style={{ width: 200 }} />
        </Form.Item>

        <Form.Item
          label="Exchange"
          name="exchange"
          rules={[{ required: true }]}
        >
          <Select
            style={{ width: 100 }}
            options={[{ label: "GLOBAL", value: "GLOBAL" }]}
          />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true }]}
        >
          <DatePicker showTime style={{ width: 180 }} />
        </Form.Item>

        <Form.Item label="End Date" name="endDate" rules={[{ required: true }]}>
          <DatePicker showTime style={{ width: 180 }} />
        </Form.Item>

        <Form.Item
          label="Interval"
          name="interval"
          rules={[{ required: true }]}
        >
          <Select
            style={{ width: 100 }}
            options={Object.values(Interval).map((value) => ({
              label: value,
              value,
            }))}
          />
        </Form.Item>

        <Button
          size="middle"
          variant="solid"
          color="green"
          loading={isDownloading}
          onClick={startDownloadData}
          style={{ marginTop: 20 }}
        >
          Download Data
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "row", gap: 16 }}>
        <Form.Item
          label="Strategy"
          name="strategy"
          rules={[{ required: true }]}
        >
          <Select style={{ width: 200 }} placement="bottomLeft">
            {strategiesGroups.map((group) => (
              <Select.OptGroup key={group.label} label={group.label}>
                {group.options.map((strategy) => (
                  <Select.Option
                    key={strategy.strategy_name}
                    value={strategy.strategy_name}
                  >
                    {strategy.strategy_name}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Commission"
          name="rate"
          rules={[{ required: true, message: "Please input price!" }]}
        >
          <InputNumber
            placeholder="Rate"
            min={0}
            controls={false}
            style={{ width: 100 }}
          />
        </Form.Item>

        <Form.Item
          label="Slippage"
          name="slippage"
          rules={[{ required: true, message: "Please input price!" }]}
        >
          <InputNumber
            placeholder="Slippage"
            min={0}
            style={{ width: 80 }}
            controls={false}
          />
        </Form.Item>

        <Form.Item
          label="Size"
          name="size"
          rules={[{ required: true, message: "Please input size!" }]}
        >
          <InputNumber
            placeholder="Size"
            min={0}
            style={{ width: 84 }}
            controls={false}
          />
        </Form.Item>

        <Form.Item
          label="Pricetick"
          name="pricetick"
          rules={[{ required: true, message: "Please input volume!" }]}
        >
          <InputNumber
            placeholder="Pricetick"
            controls={false}
            style={{ width: 74 }}
          />
        </Form.Item>

        <Form.Item
          label="Init Capital"
          name="initialCapital"
          rules={[{ required: true, message: "Please input volume!" }]}
        >
          <InputNumber
            placeholder="Initial Capital"
            controls={false}
            min={1}
            style={{ width: 90 }}
          />
        </Form.Item>
      </div>

      {params.strategy && (
        <div style={{ marginTop: 8 }}>
          <Form.Item name="strategySettings" rules={[{ required: true }]}>
            <Input
              placeholder="Settings"
              onChange={(e) => {
                backtesterActions.updateParams({
                  strategySettings: e.target.value,
                });
              }}
              style={{ width: 825 }}
            ></Input>
          </Form.Item>
        </div>
      )}
    </Form>
  );
};
