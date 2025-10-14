import { EVENT_POSITION } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { Position } from '@/types/object';
import { useEffect } from 'react';
import { useDebouncedList } from '../../useDebouncedList';
import { eventService } from '@/services/eventService';

export const useSub_EVENT_POSITION = () => {
  const dataActions = useDataStore((state) => state.actions);

  const [debouncedPositions, upsertPosition] = useDebouncedList<Position>(100);
  useEffect(() => {
    dataActions.setPositions(debouncedPositions);
    console.log('Positions received', debouncedPositions.length);
  }, [debouncedPositions, dataActions]);

  useEffect(() => {
    eventService.on(EVENT_POSITION, (ctx) => upsertPosition(ctx.data.event_data));

    return () => {
      eventService.off(EVENT_POSITION);
    };
  }, [upsertPosition]);
};
