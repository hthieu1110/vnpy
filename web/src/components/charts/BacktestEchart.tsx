import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import { BarData, TradeData } from '@/types/object';
import { Direction } from '@/types/constants';

interface BacktestEChartProps {
  barDatas: BarData[];
  trades: TradeData[];
}

export const BacktestEchart = ({ barDatas, trades }: BacktestEChartProps) => {
  const chartRef = useRef(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    // Initialize only once
    if (!chartInstance.current && chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Calculate vertical offset for trades on the same bar
    const getTradesWithOffset = (filteredTrades: TradeData[], isLong: boolean) => {
      const tradesByDatetime = new Map<number, TradeData[]>();

      // Group trades by datetime
      filteredTrades.forEach((trade) => {
        const existing = tradesByDatetime.get(trade.datetime) || [];
        existing.push(trade);
        tradesByDatetime.set(trade.datetime, existing);
      });

      // Create a map of datetime to bar data for quick lookup
      const barDataMap = new Map<number, BarData>();
      barDatas.forEach((bar) => {
        barDataMap.set(bar.datetime, bar);
      });

      // Calculate price range for offset calculation
      const allPrices = barDatas.flatMap((b) => [b.high_price, b.low_price]);
      const priceRange = Math.max(...allPrices) - Math.min(...allPrices);
      const offsetMultiplier = priceRange * 0.008; // 0.8% of price range per marker (reduced spacing)
      const gapFromBar = priceRange * 0.003; // 0.3% gap between marker and bar (reduced from 1%)

      // Apply vertical offset for multiple trades on same bar
      const result: Array<{ value: [number, number]; label: any }> = [];
      tradesByDatetime.forEach((tradesAtTime) => {
        const bar = barDataMap.get(tradesAtTime[0].datetime);
        const basePrice = bar ? (isLong ? bar.low_price : bar.high_price) : tradesAtTime[0].price;
        const basePriceWithGap = basePrice + (isLong ? -gapFromBar : gapFromBar);

        tradesAtTime.forEach((trade, index) => {
          const offset = offsetMultiplier * index * (isLong ? -1 : 1);
          result.push({
            value: [trade.datetime, basePriceWithGap + offset],
            label: {
              show: true,
              position: isLong ? 'bottom' : 'top',
              formatter: isLong ? 'Buy' : 'Sell',
              fontSize: 10,
              color: isLong ? '#26a69a' : '#ef5350',
              distance: 0,
            },
          });
        });
      });

      return result;
    };

    // Calculate y-axis range based on visible data with 10% margin
    const calculateYAxisRange = (startPercent: number, endPercent: number) => {
      const totalBars = barDatas.length;
      const startIndex = Math.floor((startPercent / 100) * totalBars);
      const endIndex = Math.ceil((endPercent / 100) * totalBars);

      const visibleBars = barDatas.slice(startIndex, endIndex);

      if (visibleBars.length === 0) {
        return { min: 'dataMin', max: 'dataMax' };
      }

      const visiblePrices = visibleBars.flatMap((b) => [b.high_price, b.low_price]);
      const minPrice = Math.min(...visiblePrices);
      const maxPrice = Math.max(...visiblePrices);

      const margin = (maxPrice - minPrice) * 0.1;

      return {
        min: minPrice - margin,
        max: maxPrice + margin,
      };
    };

    const buyTrades = trades.filter((t) => t.direction === Direction.LONG);
    const sellTrades = trades.filter((t) => t.direction === Direction.SHORT);

    // Initial y-axis range
    const initialYRange = calculateYAxisRange(0, 100);

    const option = {
      animation: false,
      grid: { left: 60, right: 20, top: 20, bottom: 60 },
      xAxis: {
        type: 'category',
        data: barDatas.map((c) => c.datetime),
        axisLabel: {
          formatter: (value: string) => {
            // Format datetime to shorter format (e.g., "MM-DD HH:mm" or "MM-DD")
            const date = new Date(value);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            // Show time if not midnight, otherwise just show date
            if (hours === '00' && minutes === '00') {
              return `${month}-${day}`;
            }
            return `${month}-${day} ${hours}:${minutes}`;
          },
          rotate: 0,
          fontSize: 10,
          interval: 'auto',
          showMaxLabel: true,
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      yAxis: {
        scale: true,
        splitNumber: 5,
        min: initialYRange.min,
        max: initialYRange.max,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          start: 0,
          end: 100,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          moveOnMouseWheel: false,
        },
        {
          type: 'slider',
          xAxisIndex: 0,
          start: 0,
          end: 100,
          bottom: 10,
          height: 20,
          brushSelect: false,
        },
      ],
      series: [
        {
          name: 'Price',
          type: 'candlestick',
          data: barDatas.map((c) => [c.open_price, c.close_price, c.low_price, c.high_price]),
        },
        {
          name: 'Buy',
          type: 'scatter',
          symbol: 'triangle',
          symbolSize: 10,
          symbolRotate: 0,
          data: getTradesWithOffset(buyTrades, true),
          itemStyle: {
            color: '#26a69a',
          },
        },
        {
          name: 'Sell',
          type: 'scatter',
          symbol: 'triangle',
          symbolSize: 10,
          symbolRotate: 180,
          data: getTradesWithOffset(sellTrades, false),
          itemStyle: {
            color: '#ef5350',
          },
        },
      ],
      tooltip: { trigger: 'axis' },
    };

    // Handle dataZoom events to update y-axis dynamically
    const handleDataZoom = (params: any) => {
      const batch = params.batch ? params.batch[0] : params;
      if (batch && batch.start !== undefined && batch.end !== undefined) {
        const yRange = calculateYAxisRange(batch.start, batch.end);
        chartInstance.current?.setOption({
          yAxis: {
            min: yRange.min,
            max: yRange.max,
          },
        });
      }
    };

    if (chartInstance.current) {
      chartInstance.current.setOption(option);
      chartInstance.current.on('dataZoom', handleDataZoom);
    }

    // Auto resize on window resize
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);

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
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      chartInstance.current?.off('dataZoom', handleDataZoom);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [barDatas, trades]);

  return <div ref={chartRef} style={{ width: '100%', height: 400 }} />;
};
