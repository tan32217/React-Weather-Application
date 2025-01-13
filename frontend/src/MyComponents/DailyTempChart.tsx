import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);




type DailyTempChartProps = {
    weatherData: {
        data: {
            timelines: [
                {
                    timestep: string;
                    endTime: string;
                    startTime: string;
                    intervals: Array<{
                        startTime: string;
                        values: {
                            temperatureMax: number;
                            temperatureMin: number;
                            windSpeed: number;
                            weatherCode: number;
                            status: string;
                        };
                    }>;
                }
            ];
        };
    };
};



type Interval = {
  startTime: string;
  values: {
    temperatureMin: number;
    temperatureMax: number;
  };
};


function prepareTemperatureData(jsonData: Interval[]) {
  return jsonData.map(item => {
    const date = new Date(item.startTime);
    return [
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
      item.values.temperatureMin,
      item.values.temperatureMax
    ];
  });
}


const DailyTempChart: React.FC<DailyTempChartProps> = ({ weatherData }) => {
  const data = weatherData.data.timelines[0].intervals;
  const tempWeather = prepareTemperatureData(data).slice(0, 6);

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'arearange',
      zoomType: 'x' as any
    } as Highcharts.ChartOptions,
    title: {
      text: 'Temperature Ranges (Min, Max)',
      style: {
        fontSize: '1rem' 
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%e %b'
      },
      crosshair: true
    },
    yAxis: {
      title: {
        text: 'Temperature (°F)'
      }
    },
    tooltip: {
      shared: true,
      valueSuffix: '°F'
    },
    legend: {
      enabled: false
    },
    series: [
      {
        name: 'Temperature',
        data: tempWeather,
        type: 'arearange',
        color: '#5db4ee',
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, 'rgba(255,152,0,0.6)'],
            [1, 'rgba(0,121,199,0.4)']
          ]
        },
        marker: {
          fillColor: '#5db4ee',
          lineWidth: 2
        }
      }
    ]
  };
  
  return (
    <div className="container my-3">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );

};

export default DailyTempChart;
