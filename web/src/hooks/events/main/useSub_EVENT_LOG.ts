import { EVENT_LOG } from '@/types/events';
import { useAppStore } from '@/stores/useAppStore';
import { useDataStore } from '@/stores/useDataStore';
import { PublicationContext } from 'centrifuge';
import { useCallback, useEffect } from 'react';
import { eventService } from '@/services/eventService';

export const useSub_EVENT_LOG = () => {
  const dataActions = useDataStore((state) => state.actions);
  const appActions = useAppStore((state) => state.actions);

  const updateLogs = useCallback(
    (ctx: PublicationContext) => {
      const log = ctx.data;
      if (log.event_data.msg === 'Account data received') {
        appActions.setConnectedGateway('Vision');
      }
      dataActions.addLog('Main', log.event_data);
    },
    [dataActions, appActions]
  );

  useEffect(() => {
    eventService.on(EVENT_LOG, updateLogs);

    return () => {
      eventService.off(EVENT_LOG);
    };
  }, [dataActions, appActions, updateLogs]);
};
