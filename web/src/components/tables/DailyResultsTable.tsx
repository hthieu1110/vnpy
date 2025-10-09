import { DailyResult } from '@/types/object';
import { Modal, Table } from 'antd';
import { genColumns } from '@/utils/genColumns';
import { useState } from 'react';
import { TradesTable } from './TradesTable';

type DailyResultsTableProps = {
  pageSize?: number;
  dailyResults: DailyResult[];
};

export const DailyResultsTable = (props: DailyResultsTableProps) => {
  const [selectedDailyResult, setSelectedDailyResult] = useState<DailyResult | null>(null);

  const handleShowDailyTrades = (dailyResult: DailyResult) => {
    setSelectedDailyResult(dailyResult);
  };

  const handleCloseDailyTrades = () => {
    setSelectedDailyResult(null);
  };

  const columns = genColumns([
    'date',
    'close_price',
    'pre_close',
    'trade_count',
    'start_pos',
    'end_pos',
    'turnover',
    'commission',
    'slippage',
    'trading_pnl',
    'holding_pnl',
    'total_pnl',
    'net_pnl',
  ]);

  return (
    <div>
      <Modal open={!!selectedDailyResult} onCancel={handleCloseDailyTrades} width={680}>
        <div className='text-md font-bold !mb-4 text-center'>
            Daily Result: {selectedDailyResult?.date}
        </div>
        
        <TradesTable trades={selectedDailyResult?.trades || []} />
      </Modal>

      <Table
        dataSource={props.dailyResults}
        columns={columns}
        pagination={{ pageSize: props.pageSize }}
        rowKey='date'
        onRow={(record) => ({
          onClick: () => handleShowDailyTrades(record),
        })}
      />
    </div>
  );
};
