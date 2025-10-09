import { TradingForm } from '@/components/forms/TradingForm';
import { OrderDatasWidget } from '@/widgets/OrderDatasWidget';
import { PositionsWidget } from '@/widgets/PositionsWidget';
import { AccountsWidget } from '@/widgets/AccountsWidget';

export const Trading = () => {
  return (
    <div className='flex gap-4 flex-row'>
      <div>
        <TradingForm layout='vertical' />
      </div>
      <div className='flex-1 flex flex-col gap-4'>
        <OrderDatasWidget pageSize={6} />
        <PositionsWidget pageSize={4} />
        <AccountsWidget pageSize={4} />
      </div>
    </div>
  );
};
