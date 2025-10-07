import { useDataStore } from '@/store/useDataStore';
import { Contract } from '@/types';
import { AutoComplete, AutoCompleteProps } from 'antd';
import { useEffect, useState } from 'react';

interface TickerSelectProps {
  onSelect?: (contract: Contract) => void;
  style?: React.CSSProperties;
}

export const TickerSelect = (props: TickerSelectProps) => {
  const contracts = useDataStore((state) => state.contracts);

  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    setOptions(
      contracts
        .filter((contract) => contract.symbol.startsWith(searchText.toUpperCase()))
        .map((contract) => ({ label: contract.symbol, value: contract.symbol }))
    );
  }, [contracts, searchText]);

  const onSelect = (selectedSymbol: string) => {
    console.log('onSelect', selectedSymbol);

    const contract = contracts.find((contract) => contract.symbol === selectedSymbol);
    if (!contract) {
      throw Error(`Contract not found for symbol: ${selectedSymbol}`);
    }
    props.onSelect?.(contract);
  };

  return (
    <AutoComplete
      options={options}
      style={{ ...props.style, width: props.style?.width || 280 }}
      onSelect={onSelect}
      onSearch={(text) => setSearchText(text)}
      placeholder='Input symbol'
    />
  );
};
