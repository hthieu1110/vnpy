import { EVENT_POSITION } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { Position } from '@/types/object';
import { useEffect } from 'react';
import { eventService } from '@/services/eventService';

export const useSub_EVENT_POSITION = () => {
  const dataActions = useDataStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_POSITION, (ctx) => {
      const position = ctx.data.event_data as Position;
      dataActions.upsertData('positions', position, ['symbol', 'exchange', 'direction']);
      console.log('EVENT_POSITION', position);
    });

    return () => {
      eventService.off(EVENT_POSITION);
    };
  }, [dataActions]);
};
