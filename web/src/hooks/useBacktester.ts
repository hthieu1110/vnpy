import { getVtSymbol } from "@/utils/getVtSymbol";
import { backtesterEngineRPC } from "../engineRPCs/backtesterEngineRPC";
import { useBacktesterStore } from "../stores/useBacktesterStore";

export const useBacktester = () => {
  const { params } = useBacktesterStore();

  const downloadData = async () => {
    console.log("Downloading data for backtesting");
    const vtSymbol = getVtSymbol(params.symbol, params.exchange);
    await backtesterEngineRPC.startDownloading(
      vtSymbol,
      params.interval,
      params.startDate,
      params.endDate
    );
  };

  return {
    downloadData,
  };
};
