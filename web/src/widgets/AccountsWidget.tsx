import { useDataStore } from '@/store/useDataStore';
import { genColumns } from '@/utils/genColumns';
import { Input, Table } from 'antd';
import { useState } from 'react';

export const AccountsWidget = () => {
  const accounts = useDataStore((state) => state.accounts);
  const columns = genColumns(['accountid', 'balance', 'frozen', 'available', 'gateway_name']);
  
  const [searchText, setSearchText] = useState<string>('');
  const filteredAccounts = accounts.filter((account) => account.accountid.startsWith(searchText.toUpperCase()));
  
  return (
    <div>
      <Input.Search
        placeholder='Search...'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table size='small' dataSource={filteredAccounts} columns={columns} />
    </div>
  );
};
