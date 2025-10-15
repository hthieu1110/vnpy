import { eventService } from '@/services/eventService';
import { EVENT_BACKTESTER_OPTIMIZATION_FINISHED } from '@/types/events';
import { useEffect } from 'react';
import { useDataStore } from '@/stores/useDataStore';
import { useBacktesterStore } from '@/stores/useBacktesterStore';

export const useSub_EVENT_BACKTESTER_OPTIMIZATION_FINISHED = () => {
  const dataActions = useDataStore((state) => state.actions);
  const backtesterActions = useBacktesterStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_BACKTESTER_OPTIMIZATION_FINISHED, () => {
      backtesterActions.setIsOptimizing(false);
    });

    return () => {
      eventService.off(EVENT_BACKTESTER_OPTIMIZATION_FINISHED);
    };
  }, [backtesterActions, dataActions]);
};
