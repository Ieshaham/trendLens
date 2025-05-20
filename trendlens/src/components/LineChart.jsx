import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ trends, selectedTrends = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Clean up any existing chart before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!chartRef.current || selectedTrends.length === 0) return;

    // Get the filtered trends that are selected
    const filteredTrends = trends.filter(trend => 
      selectedTrends.includes(trend.id)
    );

    if (filteredTrends.length === 0) return;

    // Get the months for the x-axis from the first trend
    // Assuming all trends have the same month data points
    const months = filteredTrends[0].popularity.map(item => item.month);

    // Create datasets for the chart
    const datasets = filteredTrends.map(trend => ({
      label: trend.name,
      data: trend.popularity.map(item => item.score),
      borderColor: trend.color,
      backgroundColor: `${trend.color}20`, // add transparency
      borderWidth: 2,
      pointBackgroundColor: trend.color,
      pointRadius: 4,
      tension: 0.3,
      fill: true,
    }));

    // Create the chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                family: "'Inter', sans-serif",
                size: 12
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleFont: {
              family: "'Inter', sans-serif",
              size: 14,
            },
            bodyFont: {
              family: "'Inter', sans-serif",
              size: 13,
            },
            padding: 12,
            cornerRadius: 6,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: 11
              }
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(156, 163, 175, 0.1)',
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: 11
              },
              callback: function(value) {
                return value + '%';
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        animations: {
          tension: {
            duration: 1000,
            easing: 'easeInOutQuad',
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [trends, selectedTrends]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Fashion Trend Popularity (2023-2024)</h2>
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="mt-4 text-sm text-gray-500 text-center">
        Data represents trend popularity score based on social media mentions, search volume, and retail adoption
      </div>
    </div>
  );
};

export default LineChart;