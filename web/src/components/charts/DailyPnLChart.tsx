import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import { DailyResult } from "@/types/object";
import { BACKTEST_FORM_HEIGHT } from "../forms/BacktestForm";

interface DailyPnLChartProps {
  dailyResults: DailyResult[];
}

export const DailyPnLChart = ({ dailyResults }: DailyPnLChartProps) => {
  const chartRef = useRef(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    // Initialize chart instance
    if (!chartInstance.current && chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Calculate cumulative PnL
    let cumulativePnL = 0;
    const cumulativePnLData = dailyResults.map((result) => {
      cumulativePnL += result.net_pnl;
      return cumulativePnL;
    });

    // Calculate drawdown
    const drawdownData: number[] = [];
    let peak = cumulativePnLData[0] || 0;
    cumulativePnLData.forEach((value) => {
      if (value > peak) {
        peak = value;
      }
      const drawdown = value - peak;
      drawdownData.push(drawdown);
    });

    // Prepare data for the chart
    const dates = dailyResults.map((r) => r.date);
    const netPnlData = dailyResults.map((r) => r.net_pnl);
    const tradingPnlData = dailyResults.map((r) => r.trading_pnl);
    const holdingPnlData = dailyResults.map((r) => r.holding_pnl);

    const option = {
      animation: false,
      showTitle: false,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        formatter: (params: any) => {
          let result = `<strong>${params[0].axisValue}</strong><br/>`;
          params.forEach((param: any) => {
            const value =
              typeof param.value === "number"
                ? param.value.toFixed(2)
                : param.value;
            result += `${param.marker} ${param.seriesName}: ${value}<br/>`;
          });
          return result;
        },
      },
      legend: {
        data: [
          "Net PnL",
          "Trading PnL",
          "Holding PnL",
          "Cumulative PnL",
          "Drawdown",
        ],
        top: 0,
      },
      grid: [
        {
          left: 60,
          right: 60,
          top: 38,
          height: "25%",
        },
        {
          left: 60,
          right: 60,
          top: "38%",
          height: "24%",
        },
        {
          left: 60,
          right: 60,
          top: "68%",
          height: "23%",
        },
      ],
      xAxis: [
        {
          type: "category",
          data: dates,
          gridIndex: 0,
          axisLabel: {
            show: false,
          },
        },
        {
          type: "category",
          data: dates,
          gridIndex: 1,
          axisLabel: {
            show: false,
          },
        },
        {
          type: "category",
          data: dates,
          gridIndex: 2,
          axisLabel: {
            rotate: 0,
            fontSize: 10,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          gridIndex: 0,
          axisLabel: {
            formatter: "{value}",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          name: "Daily PnL",
          nameLocation: "middle",
          nameGap: 45,
          nameTextStyle: {
            fontWeight: "bold",
            fontSize: 12,
          },
        },
        {
          type: "value",
          gridIndex: 1,
          axisLabel: {
            formatter: "{value}",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          name: "Cumulative",
          nameLocation: "middle",
          nameGap: 45,
          nameTextStyle: {
            fontWeight: "bold",
            fontSize: 12,
          },
        },
        {
          type: "value",
          gridIndex: 2,
          axisLabel: {
            formatter: "{value}",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          name: "Drawdown",
          nameLocation: "middle",
          nameGap: 45,
          nameTextStyle: {
            fontWeight: "bold",
            fontSize: 12,
          },
        },
      ],
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: [0, 1, 2],
          start: 0,
          end: 100,
        },
        {
          type: "slider",
          xAxisIndex: [0, 1, 2],
          start: 0,
          end: 100,
          bottom: 5,
          height: 18,
        },
      ],
      series: [
        {
          name: "Net PnL",
          type: "bar",
          data: netPnlData,
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            color: (params: any) => {
              return params.value >= 0 ? "#26a69a" : "#ef5350";
            },
          },
        },
        {
          name: "Trading PnL",
          type: "line",
          data: tradingPnlData,
          xAxisIndex: 0,
          yAxisIndex: 0,
          symbol: "circle",
          symbolSize: 4,
          lineStyle: {
            width: 1.5,
          },
          itemStyle: {
            color: "#5470c6",
          },
        },
        {
          name: "Holding PnL",
          type: "line",
          data: holdingPnlData,
          xAxisIndex: 0,
          yAxisIndex: 0,
          symbol: "circle",
          symbolSize: 4,
          lineStyle: {
            width: 1.5,
          },
          itemStyle: {
            color: "#fac858",
          },
        },
        {
          name: "Cumulative PnL",
          type: "line",
          data: cumulativePnLData,
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbol: "none",
          lineStyle: {
            width: 2,
          },
          itemStyle: {
            color: "#9a60b4",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(154, 96, 180, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(154, 96, 180, 0.05)",
              },
            ]),
          },
        },
        {
          name: "Drawdown",
          type: "line",
          data: drawdownData,
          xAxisIndex: 2,
          yAxisIndex: 2,
          symbol: "none",
          lineStyle: {
            width: 2,
          },
          itemStyle: {
            color: "#ee6666",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(238, 102, 102, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(238, 102, 102, 0.05)",
              },
            ]),
          },
        },
      ],
    };

    if (chartInstance.current) {
      chartInstance.current.setOption(option);
    }

    // Handle window resize
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);

    // Observe container size changes (for tab switches)
    const resizeObserver = new ResizeObserver(() => {
      // Add small delay to ensure tab transition is complete
      setTimeout(() => {
        chartInstance.current?.resize();
      }, 0);
    });

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [dailyResults]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: `calc(100vh - ${BACKTEST_FORM_HEIGHT}px)`,
      }}
    />
  );
};
