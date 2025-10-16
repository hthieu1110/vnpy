import { EVENT_ORDER } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { useEffect } from 'react';
import { eventService } from '@/services/eventService';
import { OrderData } from '@/types';

export const useSub_EVENT_ORDER = () => {
  const dataActions = useDataStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_ORDER, (ctx) => {
      const order = ctx.data.event_data as OrderData;
      dataActions.upsertData('orders', order, 'orderid');
      console.log("EVENT_ORDER", order);
    });

    return () => {
      eventService.off(EVENT_ORDER);
    };
  }, [dataActions]);
};
