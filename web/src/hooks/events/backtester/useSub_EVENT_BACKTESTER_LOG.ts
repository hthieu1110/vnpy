import { eventService } from '@/services/eventService';
import { EVENT_BACKTESTER_LOG } from '@/types/events';
import { useEffect } from 'react';
import { useDataStore } from '@/stores/useDataStore';
import { useBacktesterStore } from '@/stores/useBacktesterStore';

export const useSub_EVENT_BACKTESTER_LOG = () => {
  const dataActions = useDataStore((state) => state.actions);
  const backtesterActions = useBacktesterStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_BACKTESTER_LOG, (ctx) => {
      const log: any = {
        msg: ctx.data.event_data,
      };

      if (log.msg.includes('download completed')) {
        console.log('download completed');
        backtesterActions.setIsDownloading(false);
      } else if (log.msg.includes('unable to get historical data')) {
        console.error('unable to get historical data');
        backtesterActions.setIsDownloading(false);
      } else if (
        log.msg.includes('optimization completed') ||
        log.msg.includes('algorithm complete') ||
        log.msg.includes('calculation completed')
      ) {
        console.log('optimization completed');
        backtesterActions.setIsOptimizing(false);
      }
      dataActions.addLog('Backtester', log);
    });

    return () => {
      eventService.off(EVENT_BACKTESTER_LOG);
    };
  }, [backtesterActions, dataActions]);
};
