import { TradingForm } from '@/components/forms/TradingForm';
import { OrderDatasWidget } from '@/widgets/OrderDatasWidget';
import { PositionsWidget } from '@/widgets/PositionsWidget';
import { AccountsWidget } from '@/widgets/AccountsWidget';

export const Trading = () => {
  return (
    <div>
      <h1 className='!mb-4 text-lg font-bold'>Trading</h1>

      <div className='flex gap-4 flex-row'>
        <div>
          <TradingForm layout='vertical' />
        </div>
        <div className='flex-1 flex flex-col gap-4'>
          <OrderDatasWidget pageSize={4} />
          <PositionsWidget pageSize={4} />
          <AccountsWidget pageSize={4} />
        </div>
      </div>
    </div>
  );
};
