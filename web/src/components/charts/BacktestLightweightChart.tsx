import { useEffect, useRef } from 'react';
import {
  CandlestickSeries,
  createChart,
  createSeriesMarkers,
  IChartApi,
  ISeriesApi,
  SeriesMarker,
  Time,
} from 'lightweight-charts';
import { BarData, TradeData } from '@/types/object';
import { Direction } from '@/types/constants';

interface BacktestLightweightChartProps {
  barDatas: BarData[];
  trades: TradeData[];
}

export const BacktestLightweightChart = ({ barDatas, trades }: BacktestLightweightChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    // --- 1️⃣ Create chart ---
    chartRef.current = createChart(containerRef.current!, {
      width: containerRef.current!.clientWidth,
      height: 600,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      crosshair: { mode: 0 },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    // --- 2️⃣ Add candlestick series ---
    seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickUpColor: '#26a69a',
    });

    // --- 3️⃣ Set candle data ---
    // Expect: candles = [{ time: 1728763200, open, high, low, close }]
    seriesRef.current.setData(barDatas.map((c) => ({
      time: (new Date(c.datetime).getTime() / 1000) as Time,
      open: c.open_price,
      high: c.high_price,
      low: c.low_price,
      close: c.close_price,
    })));

    // --- 4️⃣ Add buy/sell markers ---
    // Expect: trades = [{ time: 1728763200, side: 'buy'|'sell', price, qty }]
    const markers: SeriesMarker<Time>[] = trades.map((t) => ({
      time: (new Date(t.datetime).getTime() / 1000) as Time,
      position: (t.direction === Direction.LONG ? 'belowBar' : 'aboveBar') as 'belowBar' | 'aboveBar',
      color: t.direction === Direction.LONG ? '#26a69a' : '#ef5350',
      shape: (t.direction === Direction.LONG ? 'arrowUp' : 'arrowDown') as 'arrowUp' | 'arrowDown',
      text: `${t.direction === Direction.LONG ? 'Buy' : 'Sell'} ${t.volume || ''}`,
    }));

    const seriesMarkers = createSeriesMarkers(seriesRef.current);
    seriesMarkers.setMarkers(markers);

    // --- 5️⃣ Handle resizing ---
    const handleResize = () => {
      chartRef.current?.applyOptions({
        width: containerRef.current!.clientWidth,
      });
    };
    window.addEventListener('resize', handleResize);

    // --- 6️⃣ Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.remove();
    };
  }, [barDatas, trades]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '400px',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    />
  );
};
