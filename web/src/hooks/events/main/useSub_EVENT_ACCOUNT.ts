import { EVENT_ACCOUNT } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { Account } from '@/types/object';
import { useEffect } from 'react';
import { useDebouncedList } from '../../useDebouncedList';
import { eventService } from '@/services/eventService';

export const useSub_EVENT_ACCOUNT = () => {
  const dataActions = useDataStore((state) => state.actions);

  const [debouncedValues, upsert] = useDebouncedList<Account>(100);
  useEffect(() => {
    dataActions.setAccounts(debouncedValues);
    console.log('Accounts received', debouncedValues.length);
  }, [debouncedValues, dataActions]);

  useEffect(() => {
    eventService.on(EVENT_ACCOUNT, (ctx) => upsert(ctx.data.event_data));

    return () => {
      eventService.off(EVENT_ACCOUNT);
    };
  }, [dataActions, upsert]);
};
