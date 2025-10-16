import { EVENT_ACCOUNT } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { Account } from '@/types/object';
import { useEffect } from 'react';
import { eventService } from '@/services/eventService';

export const useSub_EVENT_ACCOUNT = () => {
  const dataActions = useDataStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_ACCOUNT, (ctx) => {
      const account = ctx.data.event_data as Account;
      dataActions.addData('accounts', account);
      console.log('EVENT_ACCOUNT', account);
    });

    return () => {
      eventService.off(EVENT_ACCOUNT);
    };
  }, [dataActions]);
};
