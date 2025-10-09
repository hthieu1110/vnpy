import { useDataStore } from '@/stores/useDataStore';
import { genColumns } from '@/utils/genColumns';
import { Input, Table } from 'antd';
import { useState } from 'react';

export const ContractsWidget = () => {
  const contracts = useDataStore((state) => state.contracts);
  const [searchText, setSearchText] = useState<string>('');
  const filteredContracts = contracts.filter((contract) => contract.symbol.startsWith(searchText.toUpperCase()));

  const columns = genColumns([
    'symbol',
    'name',
    'exchange',
    'product',
    'size',
    'history_data',
    'min_volume',
    'max_volume',
    // 'net_position',
    // 'option_expiry',
    // 'option_index',
    // 'option_listed',
    // 'option_portfolio',
  ]);

  return (
    <div>
      <Input.Search
        placeholder='Search...'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />

      <Table pagination={{ pageSize: 25 }} dataSource={filteredContracts} columns={columns} />
    </div>
  );
};
