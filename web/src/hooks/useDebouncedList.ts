import { useCallback, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

export const useDebouncedList = <T>(delay: number) => {
  const [values, setValues] = useState<T[]>([]);

  const [debouncedValues] = useDebounce(values, delay);

  const setValuesRef = useRef<typeof setValues>();
  setValuesRef.current = setValues;

  const addValue = useCallback(
    (value: T) => {
      setValuesRef.current?.((values) => [...values, value]);
    },
    [setValuesRef]
  );

  const removeValue = useCallback(
    (value: T) => {
      setValuesRef.current?.((values) => values.filter((v) => v !== value));
    },
    [setValuesRef]
  );

  const upsertValue = useCallback(
    (newItem: T, key: keyof T | null = null) => {
      if (!key) {
        return addValue(newItem);
      }

      setValuesRef.current?.((values) => {
        const index = values.findIndex((item) => item[key] === newItem[key]);

        if (index === -1) {
          // not found → insert
          return [...values, newItem];
        }

        // found → replace
        const updated = [...values];
        updated[index] = newItem;
        return updated;
      });
    },
    [setValuesRef, addValue]
  );

  return [debouncedValues, upsertValue, removeValue] as unknown as [
    T[],
    typeof upsertValue,
    typeof removeValue
  ];
};
