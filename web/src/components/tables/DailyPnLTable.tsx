import { DailyResult } from '@/types/object';
import { Modal } from 'antd';
import { useTableColumns } from '@/hooks/useTableColumns';
import { useState } from 'react';
import { TradesTable } from './TradesTable';
import { InfoCircleOutlined } from '@ant-design/icons';
import { DataTable } from '../ui/DataTable';

type DailyPnLTableProps = {
  pageSize?: number;
  dailyResults: DailyResult[];
};

export const DailyPnLTable = (props: DailyPnLTableProps) => {
  const [selectedDailyResult, setSelectedDailyResult] = useState<DailyResult | null>(null);

  const handleShowDailyTrades = (dailyResult: DailyResult) => {
    setSelectedDailyResult(dailyResult);
  };

  const handleCloseDailyTrades = () => {
    setSelectedDailyResult(null);
  };

  const columns = useTableColumns([
    ['date', 2],
    ['close_price', 2],
    ['pre_close', 2],
    'trade_count',
    'start_pos',
    'end_pos',
    ['turnover', 2],
    ['commission', 2],
    'slippage',
    ['trading_pnl', 2],
    ['holding_pnl', 2],
    ['total_pnl', 2],
    ['net_pnl', 2],
  ]);

  return (
    <div>
      <Modal open={!!selectedDailyResult} onCancel={handleCloseDailyTrades} width={680}>
        <div className='text-md font-bold !mb-4 text-center'>Daily Result: {selectedDailyResult?.date}</div>

        <div style={{ height: 480 }}>
          <TradesTable trades={selectedDailyResult?.trades || []} pageSize={16} />
        </div>
      </Modal>

      <div className='text-sm text-gray-500 !mb-4 italic'>
        <InfoCircleOutlined className='!mr-1' />
        Click on a row to see daily trades !
      </div>

      <DataTable
        dataSource={props.dailyResults}
        columns={columns}
        rowKey='date'
        headTextMode='normal'
        onRow={(record) => ({
          onClick: () => handleShowDailyTrades(record),
        })}
      />
    </div>
  );
};
