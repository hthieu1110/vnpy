import { getVtSymbol } from '@/utils/getVtSymbol';
import { backtesterRpc } from '../services/rpcs/backtesterRpc';
import { useBacktesterStore } from '../stores/useBacktesterStore';
import { useCallback } from 'react';

export const useBacktester = () => {
  const { params, isDownloading, isBacktesting, actions: backtesterActions } = useBacktesterStore();

  const startDownloadData = useCallback(async () => {
    backtesterActions.setIsDownloading(true);

    const vtSymbol = getVtSymbol(params.symbol, params.exchange);
    await backtesterRpc.startDownloading(
      vtSymbol,
      params.interval,
      params.startDate.valueOf(),
      params.endDate.valueOf()
    );
    console.log(params.strategySettings);
  }, [params, backtesterActions]);

  const startBacktesting = useCallback(async () => {
    backtesterActions.setIsBacktesting(true);

    const vtSymbol = getVtSymbol(params.symbol, params.exchange);

    await backtesterRpc.startBacktesting(
      params.strategy,
      vtSymbol,
      params.interval,
      params.startDate.valueOf(),
      params.endDate.valueOf(),
      params.rate,
      params.slippage,
      params.size,
      params.pricetick,
      params.initialCapital,
      JSON.parse(params.strategySettings)
    );
  }, [params, backtesterActions]);

  return {
    startDownloadData,
    startBacktesting,
    isDownloading,
    isBacktesting,
  };
};
