import { eventService } from '@/services/eventService';
import { EVENT_BACKTESTER_BACKTESTING_FINISHED } from '@/types/events';
import { useEffect } from 'react';
import { useDataStore } from '@/stores/useDataStore';
import { useBacktesterStore } from '@/stores/useBacktesterStore';

export const useSub_EVENT_BACKTESTER_BACKTESTING_FINISHED = () => {
  const dataActions = useDataStore((state) => state.actions);
  const backtesterActions = useBacktesterStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_BACKTESTER_BACKTESTING_FINISHED, () => {
      backtesterActions.setIsBacktesting(false);
    });

    return () => {
      eventService.off(EVENT_BACKTESTER_BACKTESTING_FINISHED);
    };
  }, [backtesterActions, dataActions]);
};
