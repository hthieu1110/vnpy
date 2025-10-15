import { EVENT_ORDER } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { useEffect } from 'react';
import { eventService } from '@/services/eventService';

export const useSub_EVENT_ORDER = () => {
  const dataActions = useDataStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_ORDER, (ctx) => {
      dataActions.upsertOrder(ctx.data.event_data);
    });

    return () => {
      eventService.off(EVENT_ORDER);
    };
  }, [dataActions]);
};
