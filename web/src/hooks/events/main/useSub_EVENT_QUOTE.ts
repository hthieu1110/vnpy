import { EVENT_QUOTE } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { Quote } from '@/types/object';
import { useEffect } from 'react';
import { useDebouncedList } from '../../useDebouncedList';
import { eventService } from '@/services/eventService';

export const useSub_EVENT_QUOTE = () => {
  const dataActions = useDataStore((state) => state.actions);

  const [debouncedValues, upsert] = useDebouncedList<Quote>(100);
  useEffect(() => {
    dataActions.setQuotes(debouncedValues);
    console.log('Quotes received', debouncedValues.length);
  }, [debouncedValues, dataActions]);

  useEffect(() => {
    eventService.on(EVENT_QUOTE, (ctx) => upsert(ctx.data.event_data));

    return () => {
      eventService.off(EVENT_QUOTE);
    };
  }, [dataActions, upsert]);
};
