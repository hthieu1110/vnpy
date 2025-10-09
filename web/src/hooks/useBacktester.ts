import { getVtSymbol } from '@/utils/getVtSymbol';
import { backtesterEngineRpc } from '../engineRPCs/backtesterEngineRpc';
import { useBacktesterStore } from '../stores/useBacktesterStore';
import { useCallback } from 'react';

export const useBacktester = () => {
  const { params, isDownloading, isBacktesting, actions: backtesterActions } = useBacktesterStore();

  const startDownloadData = useCallback(async () => {
    backtesterActions.setIsDownloading(true);

    const vtSymbol = getVtSymbol(params.symbol, params.exchange);
    await backtesterEngineRpc.startDownloading(
      vtSymbol,
      params.interval,
      params.startDate.valueOf(),
      params.endDate.valueOf()
    );
  }, [params, backtesterActions]);

  const startBacktesting = useCallback(async () => {
    backtesterActions.setIsBacktesting(true);

    const vtSymbol = getVtSymbol(params.symbol, params.exchange);
    const strategySettings = {
      fast_window: 10,
      slow_window: 20,
    };

    await backtesterEngineRpc.startBacktesting(
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
      strategySettings
    );
  }, [params, backtesterActions]);

  return {
    startDownloadData,
    startBacktesting,
    isDownloading,
    isBacktesting,
  };
};
