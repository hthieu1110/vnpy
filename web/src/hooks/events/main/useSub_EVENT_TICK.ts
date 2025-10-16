import { EVENT_TICK } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { useEffect } from 'react';
import { eventService } from '@/services/eventService';

import { TickData } from '@/types/object';

export const useSub_EVENT_TICK = () => {
  const dataActions = useDataStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_TICK, (ctx) => {
      const tick = ctx.data.event_data as TickData;
      dataActions.upsertData('ticks', tick, 'symbol');
      const { symbol, exchange, datetime, last_price } = tick;
      console.log('EVENT_TICK', { symbol, exchange, datetime, last_price });
    });

    return () => {
      eventService.off(EVENT_TICK);
    };
  }, [dataActions]);
};
