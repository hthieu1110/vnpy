import { eventService } from "@/services/eventService";
import {
  EVENT_BACKTESTER_BACKTESTING_FINISHED,
  EVENT_BACKTESTER_LOG,
  EVENT_BACKTESTER_OPTIMIZATION_FINISHED,
} from "@/types/events";
import { useEffect } from "react";
import { useDataStore } from "../stores/useDataStore";
import { useBacktesterStore } from "@/stores/useBacktesterStore";

export const useRegisterBacktesterEvents = () => {
  const dataActions = useDataStore((state) => state.actions);
  const backtesterActions = useBacktesterStore((state) => state.actions);

  useEffect(() => {
    eventService.on(EVENT_BACKTESTER_LOG, (ctx) => {
      const log: any = {
        msg: ctx.data.event_data,
      };

      if (log.msg.includes("download completed")) {
        console.log("download completed");
        backtesterActions.setIsDownloading(false);
      } else if (log.msg.includes("unable to get historical data")) {
        console.error("unable to get historical data");
        backtesterActions.setIsDownloading(false);
      } else if (
        log.msg.includes("optimization completed") ||
        log.msg.includes("algorithm complete") ||
        log.msg.includes("calculation completed")
      ) {
        console.log("optimization completed");
        backtesterActions.setIsOptimizing(false);
      }
      dataActions.addLog("Backtester", log);
    });

    eventService.on(EVENT_BACKTESTER_BACKTESTING_FINISHED, () => {
      backtesterActions.setIsBacktesting(false);
    });

    eventService.on(EVENT_BACKTESTER_OPTIMIZATION_FINISHED, () => {
      backtesterActions.setIsOptimizing(false);
    });

    return () => {
      eventService.off(EVENT_BACKTESTER_LOG);
      eventService.off(EVENT_BACKTESTER_BACKTESTING_FINISHED);
      eventService.off(EVENT_BACKTESTER_OPTIMIZATION_FINISHED);
    };
  }, []);
};
