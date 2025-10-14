import { EVENT_TRADE } from '@/types/events';
import { useDataStore } from '@/stores/useDataStore';
import { Trade } from '@/types/object';
import { useEffect } from 'react';
import { useDebouncedList } from '../../useDebouncedList';
import { eventService } from '@/services/eventService';

export const useSub_EVENT_TRADE = () => {
  const dataActions = useDataStore((state) => state.actions);

  const [debouncedTrades, upsertTrade] = useDebouncedList<Trade>(100);
  useEffect(() => {
    dataActions.setTrades(debouncedTrades);
    console.log('Trades received', debouncedTrades.length);
  }, [debouncedTrades, dataActions]);

  useEffect(() => {
    eventService.on(EVENT_TRADE, (ctx) => upsertTrade(ctx.data.event_data));

    return () => {
      eventService.off(EVENT_TRADE);
    };
  }, [dataActions, upsertTrade]);
};
