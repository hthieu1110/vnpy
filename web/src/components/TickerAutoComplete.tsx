import { useDataStore } from '@/stores/useDataStore';
import { AutoComplete } from 'antd';
import { useMemo, useState } from 'react';

interface TickerAutoCompleteProps {
  onSelect?: (symbol: string) => void;
  onChange?: (symbol: string) => void;
  value?: string;
  style?: React.CSSProperties;
}

export const TickerAutoComplete = (props: TickerAutoCompleteProps) => {
  const contracts = useDataStore((state) => state.contracts);

  const [searchText, setSearchText] = useState<string>('');
  const options = useMemo(() => {
    return contracts
      .filter((contract) => contract.symbol.startsWith(searchText.toUpperCase()))
      .map((contract) => ({ label: contract.symbol, value: contract.symbol }));
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
