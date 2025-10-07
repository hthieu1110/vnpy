import { useCallback, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

export const useDebouncedList = <T>(delay: number) => {
  const [values, setValues] = useState<T[]>([]);

  const [debouncedValues] = useDebounce(values, delay);

  const setValuesRef = useRef<typeof setValues>();
  setValuesRef.current = setValues;

  const addValue = useCallback((value: T) => {
    setValuesRef.current?.(values => [...values, value]);
  }, [setValuesRef]);

  return [debouncedValues, addValue] as unknown as [T[], typeof addValue];
};
