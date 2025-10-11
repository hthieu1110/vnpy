import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import { DailyResult } from '@/types/object';

interface PnLDistributionChartProps {
  dailyResults: DailyResult[];
}

export const PnLDistributionChart = ({ dailyResults }: PnLDistributionChartProps) => {
  const chartRef = useRef(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    // Initialize chart instance
    if (!chartInstance.current && chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const netPnlData = dailyResults.map((r) => r.net_pnl);

    // Calculate PnL distribution (histogram)
    const minPnl = Math.min(...netPnlData);
    const maxPnl = Math.max(...netPnlData);
    const binCount = Math.min(20, Math.ceil(Math.sqrt(netPnlData.length))); // Sturges' rule
    const binSize = (maxPnl - minPnl) / binCount;

    const bins: number[] = new Array(binCount).fill(0);
    const binLabels: string[] = [];

    for (let i = 0; i < binCount; i++) {
      const binStart = minPnl + i * binSize;
      binLabels.push(`${binStart.toFixed(0)}`);
    }

    netPnlData.forEach((pnl) => {
      const binIndex = Math.min(Math.floor((pnl - minPnl) / binSize), binCount - 1);
      bins[binIndex]++;
    });

    const option = {
      animation: false,
      title: {
        text: 'PnL Distribution',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const param = params[0];
          const binStart = parseFloat(param.name);
          const binEnd = binStart + binSize;
          return `<strong>PnL Range: ${binStart.toFixed(0)} ~ ${binEnd.toFixed(0)}</strong><br/>
                  ${param.marker} Frequency: ${param.value}`;
        },
      },
      grid: {
        left: 60,
        right: 60,
        top: 60,
        bottom: 80,
      },
      xAxis: {
        type: 'category',
        data: binLabels,
        axisLabel: {
          rotate: 45,
          fontSize: 10,
        },
        name: 'PnL Range',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 12,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}',
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
        name: 'Frequency',
        nameLocation: 'middle',
        nameGap: 45,
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 12,
        },
      },
      series: [
        {
          name: 'Distribution',
          type: 'bar',
          data: bins,
          itemStyle: {
            color: '#91cc75',
          },
        },
      ],
    };

    if (chartInstance.current) {
      chartInstance.current.setOption(option);
    }

    // Handle window resize
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
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [dailyResults]);

  return <div ref={chartRef} style={{ width: '100%', height: 400 }} />;
};

