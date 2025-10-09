import { AccountsWidget } from '@/widgets/AccountsWidget';

export const Accounts = () => {
  return (
    <div>
      <AccountsWidget pageSize={25} />
    </div>
  );
};