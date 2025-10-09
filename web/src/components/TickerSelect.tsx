import { useDataStore } from '@/stores/useDataStore';
import { AutoComplete, AutoCompleteProps } from 'antd';
import { useEffect, useState } from 'react';

interface TickerSelectProps {
  onSelect?: (symbol: string) => void;
  onChange?: (symbol: string) => void;
  value?: string;
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
    const contract = contracts.find((contract) => contract.symbol === selectedSymbol);
    if (!contract) {
      throw Error(`Contract not found for symbol: ${selectedSymbol}`);
    }
    props.onSelect?.(selectedSymbol);
  };

  return (
    <AutoComplete
      value={props.value}
      onChange={(value) => props.onChange?.(value)}
      options={options}
      style={props.style}
      onSelect={onSelect}
      onSearch={(text) => setSearchText(text)}
      placeholder='Input symbol'
    />
  );
};
