import {
  OptimizationParam,
  OptimizationParamsConfig,
  OptimizationTarget,
} from "@/types";
import { useEffect, useState } from "react";
import { useBacktesterStore } from "@/stores/useBacktesterStore";
import { getVtSymbol } from "@/utils/getVtSymbol";

export const useBacktestOptimization = () => {
  const params = useBacktesterStore((state) => state.params);

  const [optimizationParamsConfig, setOptimizationParamsConfig] =
    useState<OptimizationParamsConfig>({
      optimizationTarget: OptimizationTarget.TotalReturn,
      processLimit: 0,
      optimizationParams: [],
    });

  const genArgsForRpcCall = (
    useGa: boolean
  ): [
    string,
    string,
    string,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    OptimizationParamsConfig,
    boolean,
    number
  ] => {
    const vtSymbol = getVtSymbol(params.symbol, params.exchange);
    return [
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
      optimizationParamsConfig,
      useGa,
      optimizationParamsConfig.processLimit,
    ];
  };

  const updateConfig = (field: keyof OptimizationParamsConfig, value: any) => {
    setOptimizationParamsConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateParamConfig = (
    param: string,
    field: keyof OptimizationParam,
    value: any
  ) => {
    setOptimizationParamsConfig((prev) => ({
      ...prev,
      optimizationParams: prev.optimizationParams.map((item) =>
        item.parameter === param ? { ...item, [field]: value } : item
      ),
    }));
  };

  useEffect(() => {
    setOptimizationParamsConfig((prev) => ({
      ...prev,
      optimizationParams: Object.entries(
        JSON.parse(params.strategySettings)
      ).map(([key, value]) => ({
        parameter: key,
        start: Number(value),
        step: Number(value) % 1 === 0 ? 1 : 0.1,
        end: Number(value) + (Number(value) % 1 === 0 ? 1 : 0.1),
      })),
    }));
  }, [params.strategySettings]);

  return {
    optimizationParamsConfig,
    setOptimizationParamsConfig,
    updateConfig,
    updateParamConfig,
    genArgsForRpcCall,
  };
};
