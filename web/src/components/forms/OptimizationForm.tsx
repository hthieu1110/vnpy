import { Table, InputNumber, Select, Button } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { useBacktestOptimization } from '@/hooks/useBacktestOptimization';
import { OptimizationParam, OptimizationTarget } from '@/types';
import { backtesterRpc } from '@/services/rpcs/backtesterRpc';
import { useBacktesterStore } from '@/stores/useBacktesterStore';

function snakeToText(snake: string) {
  return snake
    .replace(/_/g, ' ') // replace underscores with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize first letter of each word
}

export const OptimizationForm = () => {
  const { optimizationParamsConfig, updateConfig, updateParamConfig, genArgsForRpcCall } = useBacktestOptimization();
  const backtesterActions = useBacktesterStore((state) => state.actions);
  const isOptimizing = useBacktesterStore((state) => state.isOptimizing);

  const columns: ColumnType<OptimizationParam>[] = [
    {
      title: 'Parameter',
      dataIndex: 'parameter',
      key: 'parameter',
    },
    {
      title: 'Start',
      dataIndex: 'start',
      key: 'start',
      render: (value: number, record: OptimizationParam) => (
        <InputNumber
          value={value}
          onChange={(newValue) => updateParamConfig(record.parameter, 'start', newValue)}
          style={{ width: 64 }}
        />
      ),
    },
    {
      title: 'Step',
      dataIndex: 'step',
      key: 'step',
      render: (value: number, record: OptimizationParam) => (
        <InputNumber
          value={value}
          onChange={(newValue) => updateParamConfig(record.parameter, 'step', newValue)}
          style={{ width: 50 }}
        />
      ),
    },
    {
      title: 'End',
      dataIndex: 'end',
      key: 'end',
      render: (value: number, record: OptimizationParam) => (
        <InputNumber
          value={value}
          onChange={(newValue) => updateParamConfig(record.parameter, 'end', newValue)}
          style={{ width: 64 }}
        />
      ),
    },
  ];

  const handleMultiProcessOptimization = async () => {
    backtesterActions.setIsOptimizing(true);
    const args = genArgsForRpcCall(false);
    const res = await backtesterRpc.startOptimization(...args);
    console.log('Multi-process Optimization', res);
  };

  const handleGeneticAlgorithmOptimization = async () => {
    backtesterActions.setIsOptimizing(true);
    const args = genArgsForRpcCall(true);
    const res = await backtesterRpc.startOptimization(...args);
    console.log('Genetic Algorithm Optimization', res);
  };

  return (
    <div>
      <div style={{ width: 320, display: 'flex', flexDirection: 'row', gap: 8 }}>
        <div>
          <div>Target Optimization</div>
          <Select
            options={Object.values(OptimizationTarget).map((target) => ({
              label: snakeToText(target),
              value: target,
            }))}
            value={optimizationParamsConfig.optimizationTarget}
            onChange={(value) => updateConfig('optimizationTarget', value)}
            style={{ width: 210 }}
          />
        </div>

        <div>
          <div>Process</div>
          <InputNumber
            value={optimizationParamsConfig.processLimit}
            onChange={(value) => updateConfig('processLimit', value)}
            min={1}
            style={{ width: 64 }}
          />
        </div>
      </div>

      <div className='!mt-2' style={{ width: 240 }}>
        <Table
          columns={columns}
          dataSource={optimizationParamsConfig.optimizationParams}
          rowKey='parameter'
          pagination={false}
        />
      </div>

      <div className='!mt-2 flex flex-col w-[240px]'>
        <Button
          onClick={handleMultiProcessOptimization}
          type='primary'
          size='middle'
          className='!mt-2'
          loading={isOptimizing}
        >
          Multi-process Optimization
        </Button>

        <Button
          onClick={handleGeneticAlgorithmOptimization}
          type='primary'
          size='middle'
          className='!mt-2'
          loading={isOptimizing}
        >
          Genetic Algorithm Optimization
        </Button>
      </div>
    </div>
  );
};
