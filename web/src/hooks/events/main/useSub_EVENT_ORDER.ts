import { EVENT_ORDER } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { OrderData } from '@/types/object';
import { useEffect } from 'react';
import { useDebouncedList } from '../../useDebouncedList';
import { eventService } from '@/services/eventService';

export const useSub_EVENT_ORDER = () => {
  const dataActions = useDataStore((state) => state.actions);

  const [debouncedValues, upsert] = useDebouncedList<OrderData>(100);
  useEffect(() => {
    dataActions.setOrderDatas(debouncedValues);
    console.log('Orders received', debouncedValues.length);
  }, [debouncedValues, dataActions]);

  useEffect(() => {
    eventService.on(EVENT_ORDER, (ctx) => upsert(ctx.data.event_data, 'orderid'));

    return () => {
      eventService.off(EVENT_ORDER);
    };
  }, [dataActions, upsert]);
};
