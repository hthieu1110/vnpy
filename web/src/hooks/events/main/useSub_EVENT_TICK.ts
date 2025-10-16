import { EVENT_TICK } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { useEffect } from 'react';
import { eventService } from '@/services/eventService';
import { TickData } from '@/types';


export const useSub_EVENT_TICK = () => {
  const dataActions = useDataStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_TICK, (ctx) => {
      const tick = ctx.data.event_data as TickData;
      console.log("Tick received", tick);
      dataActions.upsertTick(tick);
    });

    return () => {
      eventService.off(EVENT_TICK);
    };
  }, [dataActions]);
};
