import { EVENT_CONTRACT } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { Contract } from '@/types/object';
import { useEffect } from 'react';
import { useDebouncedList } from '../../useDebouncedList';
import { eventService } from '@/services/eventService';

export const useSub_EVENT_CONTRACT = () => {
  const dataActions = useDataStore((state) => state.actions);

  const [debouncedValues, upsert] = useDebouncedList<Contract>(100);
  useEffect(() => {
    dataActions.setContracts(debouncedValues);
    console.log('Contracts received', debouncedValues.length);
  }, [debouncedValues, dataActions]);

  useEffect(() => {
    eventService.on(EVENT_CONTRACT, (ctx) => upsert(ctx.data.event_data));

    return () => {
      eventService.off(EVENT_CONTRACT);
    };
  }, [dataActions, upsert]);
};
