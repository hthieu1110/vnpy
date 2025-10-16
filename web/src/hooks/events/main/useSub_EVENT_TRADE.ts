import { EVENT_TRADE } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { useEffect } from 'react';
import { eventService } from '@/services/eventService';
import { TradeData } from '@/types/object';

export const useSub_EVENT_TRADE = () => {
  const dataActions = useDataStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_TRADE, (ctx) => {
      const trade = ctx.data.event_data as TradeData;
      dataActions.addData('trades', trade);
      console.log('EVENT_TRADE', trade);
    });

    return () => {
      eventService.off(EVENT_TRADE);
    };
  }, [dataActions]);
};
