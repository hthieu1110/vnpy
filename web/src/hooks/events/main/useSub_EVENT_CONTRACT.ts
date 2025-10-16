import { EVENT_CONTRACT } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { Contract } from '@/types/object';
import { useEffect } from 'react';
import { eventService } from '@/services/eventService';

export const useSub_EVENT_CONTRACT = () => {
  const dataActions = useDataStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_CONTRACT, (ctx) => {
      const contract = ctx.data.event_data as Contract;
      dataActions.addData('contracts', contract);
      console.log('EVENT_CONTRACT', contract);
    });

    return () => {
      eventService.off(EVENT_CONTRACT);
    };
  }, [dataActions]);
};
