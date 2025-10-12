import { useBacktesterStore } from '@/stores/useBacktesterStore';
import { Table, InputNumber, Select, Row, Col, Button } from 'antd';
import { useMemo, useState, useEffect } from 'react';
import type { ColumnType } from 'antd/es/table';

interface OptiParam {
  parameter: string;
  start: number;
  step: number;
  end: number;
}

export const BacktesterOptimization = () => {
  const params = useBacktesterStore((state) => state.params);

  const optiParams = useMemo(() => {
    return Object.entries(JSON.parse(params.strategySettings)).map(([key, value]) => ({
      parameter: key,
      start: Number(value),
      step: 1,
      end: Number(value) + 1,
    }));
  }, [params.strategySettings]);

  const [optiParamsConfig, setOptiParamsConfig] = useState<OptiParam[]>([]);
  const [optimizationTarget, setOptimizationTarget] = useState<string>('total_return');
  const [processLimit, setProcessLimit] = useState<number>(4);

  useEffect(() => {
    setOptiParamsConfig(optiParams);
  }, [optiParams]);

  const handleUpdate = (parameter: string, field: keyof OptiParam, value: number) => {
    setOptiParamsConfig((prev) =>
      prev.map((item) => (item.parameter === parameter ? { ...item, [field]: value } : item))
    );
  };

  const columns: ColumnType<OptiParam>[] = [
    {
      title: 'Parameter',
      dataIndex: 'parameter',
      key: 'parameter',
    },
    {
      title: 'Start',
      dataIndex: 'start',
      key: 'start',
      render: (value: number, record: OptiParam) => (
        <InputNumber
          value={value}
          onChange={(newValue) => handleUpdate(record.parameter, 'start', newValue || 0)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Step',
      dataIndex: 'step',
      key: 'step',
      render: (value: number, record: OptiParam) => (
        <InputNumber
          value={value}
          onChange={(newValue) => handleUpdate(record.parameter, 'step', newValue || 1)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'End',
      dataIndex: 'end',
      key: 'end',
      render: (value: number, record: OptiParam) => (
        <InputNumber
          value={value}
          onChange={(newValue) => handleUpdate(record.parameter, 'end', newValue || 0)}
          style={{ width: '100%' }}
        />
      ),
    },
  ];

  const optimizationTargets = [
    { label: 'Total Return', value: 'total_return' },
    { label: 'Sharpe Ratio', value: 'sharpe_ratio' },
    { label: 'EWM Sharpe', value: 'ewm_sharpe' },
    { label: 'Return/Drawdown Ratio', value: 'return_drawdown_ratio' },
    { label: 'Daily P&L', value: 'daily_net_pnl' },
  ];

  return (
    <div>
      <Row style={{ width: 280 }}>
        <Col span={12}>
          <div>Target Optimization</div>
          <Select
            options={optimizationTargets}
            value={optimizationTarget}
            onChange={(value) => setOptimizationTarget(value)}
            style={{ width: 132 }}
          />
        </Col>

        <Col span={12}>
          <div>Process</div>
          <InputNumber
            value={processLimit}
            onChange={(value) => setProcessLimit(value || 4)}
            min={1}
            style={{ width: 44 }}
          />
        </Col>
      </Row>

      <div className='!mt-2' style={{ width: 240 }}>
        <Table columns={columns} dataSource={optiParamsConfig} rowKey='parameter' pagination={false} />
      </div>

      <Button type='primary' size='middle' className='!mt-2'>
        Optimization
      </Button>
    </div>
  );
};
