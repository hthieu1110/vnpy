import { Form, Select, InputNumber } from 'antd';
import { TickerAutoComplete } from '@/components/TickerAutoComplete';
import { useBacktesterStore } from '@/stores/useBacktesterStore';
import { Interval } from '@/types';

type BacktestFormProps = {
  /** placeholder */
};

export const BacktestForm = (_props: BacktestFormProps) => {
  const { params, actions: backtesterActions } = useBacktesterStore();

  const [form] = Form.useForm();

  const handleValuesChange = (_: any, allFields: any) => {
    backtesterActions.updateParams(allFields);
  };

  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={params}
      onValuesChange={handleValuesChange}
      style={{ display: 'flex', flexDirection: 'row', gap: 16 }}
    >
      <div>
        <Form.Item label='Strategy' name='strategy' rules={[{ required: true }]}>
          <Select style={{ width: 180 }}>
            <Select.Option value='DoubleMaStrategy'>Double Ma Strategy</Select.Option>
            <Select.Option value='AtrRsiStrategy'>Atr Rsi Strategy</Select.Option>
          </Select>
        </Form.Item>
      </div>

      <div>
        <Form.Item label='Symbol' name='symbol' rules={[{ required: true, message: 'Please input symbol!' }]}>
          <TickerAutoComplete style={{ width: 180 }} />
        </Form.Item>
      </div>

      <div>
        <Form.Item label='Exchange' name='exchange' rules={[{ required: true }]}>
          <Select style={{ width: 100 }} options={[{ label: 'GLOBAL', value: 'GLOBAL' }]} />
        </Form.Item>
      </div>

      <div>
        <Form.Item label='Interval' name='interval' rules={[{ required: true }]}>
          <Select
            style={{ width: 64 }}
            options={Object.values(Interval).map((value) => ({
              label: value,
              value,
            }))}
          />
        </Form.Item>
      </div>

      <div>
        <Form.Item label='Commission' name='rate' rules={[{ required: true, message: 'Please input price!' }]}>
          <InputNumber placeholder='Rate' min={0} controls={false} />
        </Form.Item>
      </div>

      <div>
        <Form.Item label='Slippage' name='slippage' rules={[{ required: true, message: 'Please input price!' }]}>
          <InputNumber placeholder='Slippage' min={0} style={{ width: 48 }} controls={false} />
        </Form.Item>
      </div>

      <div>
        <Form.Item label='Size' name='size' rules={[{ required: true, message: 'Please input size!' }]}>
          <InputNumber placeholder='Size' min={0} style={{ width: 64 }} controls={false} />
        </Form.Item>
      </div>

      <div>
        <Form.Item label='Pricetick' name='pricetick' rules={[{ required: true, message: 'Please input volume!' }]}>
          <InputNumber placeholder='Pricetick' controls={false} />
        </Form.Item>
      </div>

      <div>
        <Form.Item
          label='Init Capital'
          name='initialCapital'
          rules={[{ required: true, message: 'Please input volume!' }]}
        >
          <InputNumber placeholder='Initial Capital' controls={false} min={1} style={{ width: 100 }} />
        </Form.Item>
      </div>

      {/* 
        <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit'>
              Submit Order
            </Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </Space>
        </Form.Item> */}
    </Form>
  );
};
