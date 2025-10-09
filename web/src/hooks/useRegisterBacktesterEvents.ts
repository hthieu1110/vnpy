import { eventService } from "@/services/eventService";
import {
  EVENT_BACKTESTER_BACKTESTING_FINISHED,
  EVENT_BACKTESTER_LOG,
  EVENT_BACKTESTER_OPTIMIZATION_FINISHED,
} from "@/types/events";
import { useEffect } from "react";
import { useDataStore } from "../stores/useDataStore";

export const useRegisterEvents = () => {
  const dataActions = useDataStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_BACKTESTER_LOG, (ctx) => {
      const log: any = {
        msg: ctx.data.event_data,
      };
      dataActions.addLog("Backtester", log);
    });

    eventService.on(EVENT_BACKTESTER_BACKTESTING_FINISHED, (ctx) => {
      console.log(ctx);
    });

    eventService.on(EVENT_BACKTESTER_OPTIMIZATION_FINISHED, (ctx) => {
      console.log(ctx);
    });

    return () => {
      eventService.off(EVENT_BACKTESTER_LOG);
      eventService.off(EVENT_BACKTESTER_BACKTESTING_FINISHED);
      eventService.off(EVENT_BACKTESTER_OPTIMIZATION_FINISHED);
    };
  }, []);
};
