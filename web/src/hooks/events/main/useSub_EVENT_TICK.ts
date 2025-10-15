import { EVENT_TICK } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { Tick } from '@/types/object';
import { useEffect } from 'react';
import { useDebouncedList } from '../../useDebouncedList';
import { eventService } from '@/services/eventService';

export const useSub_EVENT_TICK = () => {
  const dataActions = useDataStore((state) => state.actions);

  const [debouncedTicks, upsertTick] = useDebouncedList<Tick>(100);
  useEffect(() => {
    dataActions.setTicks(debouncedTicks);
    console.log('Ticks received', debouncedTicks.length);
  }, [debouncedTicks, dataActions]);

  useEffect(() => {
    eventService.on(EVENT_TICK, (ctx) => upsertTick(ctx.data.event_data));

    return () => {
      eventService.off(EVENT_TICK);
    };
  }, [dataActions, upsertTick]);
};
