import { OptimizationForm } from "@/components/forms/OptimizationForm";
import { OptimizationResultsTable } from "@/components/tables/OptimizationResultsTable";
import { backtesterRpc } from "@/services/rpcs/backtesterRpc";
import { useBacktesterStore } from "@/stores/useBacktesterStore";
import { usePrevious } from "@uidotdev/usehooks";
import { useEffect, useState, useCallback } from "react";

export const OptimizationTab = () => {
  const { isOptimizing } = useBacktesterStore();
  const prevIsOptimizing = usePrevious(isOptimizing);

  const [optimizationResults, setOptimizationResults] = useState<any[]>([]);

  const fetchOptimizationResults = useCallback(async () => {
    setTimeout(async () => {
      const results = await backtesterRpc.getResultValues();
      setOptimizationResults(results);
    }, 300);
  }, []);

  useEffect(() => {
    if (prevIsOptimizing && !isOptimizing) {
      fetchOptimizationResults();
    }
  }, [isOptimizing, prevIsOptimizing, fetchOptimizationResults]);

  return (
    <div className="flex flex-row gap-1">
      <OptimizationForm />
      <div className="flex-1">
        <OptimizationResultsTable optimizationResults={optimizationResults} />
      </div>
    </div>
  );
};
