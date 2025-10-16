import { EVENT_QUOTE } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { Quote } from '@/types/object';
import { useEffect } from 'react';
import { eventService } from '@/services/eventService';

export const useSub_EVENT_QUOTE = () => {
  const dataActions = useDataStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_QUOTE, (ctx) => {
      const quote = ctx.data.event_data as Quote;
      dataActions.upsertData('quotes', quote, 'quoteid');
      console.log('EVENT_QUOTE', quote);
    });

    return () => {
      eventService.off(EVENT_QUOTE);
    };
  }, [dataActions]);
};
