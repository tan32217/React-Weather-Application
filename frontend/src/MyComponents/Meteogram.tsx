import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import windbarb from 'highcharts/modules/windbarb';
import HighchartsReact from 'highcharts-react-official';


type HourlyTempChartProps = {
  hourlyData: {
    data: {
      startTime: string;
      values: {
        humidity: number;
        pressureSeaLevel: number;
        temperature: number;
        windDirection: number;
        windSpeed: number;
      };
    }[];
  };
};

windbarb(Highcharts);

const Meteogram: React.FC<HourlyTempChartProps> = ({ hourlyData }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  class Meteogram {
    humidity: { x: number; y: number }[] = [];
    winds: { x: number; value: number; direction: number }[] = [];
    temperatures: { x: number; y: number }[] = [];
    pressures: { x: number; y: number }[] = [];
    json: typeof hourlyData;
    chart: Highcharts.Chart | null = null;

    constructor(json: typeof hourlyData) {
      this.json = json;
      this.parseYrData();
    }

    parseYrData() {
      this.json.data.forEach((node,index) => {
        const x = Date.parse(node.startTime);
        this.temperatures.push({ x, y: node.values.temperature });
        this.humidity.push({ x, y: node.values.humidity });
        if (index % 3 === 0) {
          this.winds.push({
            x,
            value: parseFloat(node.values.windSpeed.toFixed(2)),
            direction: node.values.windDirection,
          });
        }
        this.pressures.push({ x, y: node.values.pressureSeaLevel });
      });
    }

    getChartOptions(container: HTMLElement): Highcharts.Options {
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const chartHeight = containerHeight * 1; 
      const windBarbYOffset = containerWidth < 576 ? -5 : -10; 

      return {
        chart: {
          renderTo: container,
          plotBorderWidth: 1,
          height: chartHeight,
          alignTicks: false,
          scrollablePlotArea: { minWidth: 720 },
        },
        title: {
          text: 'Hourly Weather (For Next 5 Days)',
          align: 'center',
          style: { fontSize: '1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
        },
        legend: {
          enabled: false, 
        },
        tooltip: {
          shared: true,
          useHTML: true,
          headerFormat: '<small>{point.x:%A, %b %e, %H:%M}</small><br>',
          style: { fontSize: '0.9em' },
        },
        xAxis: [
          {
            type: 'datetime',
            tickInterval: 2 * 36e5,
            minorTickInterval: 36e5,
            tickLength: 0,
            gridLineWidth: 0,
            tickWidth: 0,            
            minorTickWidth: 0,   
            gridLineColor: 'rgba(128, 128, 128, 0.1)',
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
            offset: containerWidth * 0.03,
            showLastLabel: true,
            labels: { format: '{value:%H}', style: { fontSize: '1em' } },
            crosshair: true,
          },
          {
            linkedTo: 0,
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            labels: {
              format: '{value:<span style="font-size: 1em; font-weight: bold">%a</span> %b %e}',
              align: 'left',
              x: 3,
              y: 2,
              style: { fontSize: '1em' },
            },
            opposite: true,
            tickLength: 20,
            gridLineWidth: 1,
            tickWidth: 1,           
           
            
          },
        ],
        yAxis: [
          {
            title: { text: null },
            labels: { format: '{value}°', style: { fontSize: '0.7em' }, x: -3 },
            plotLines: [{ value: 0, color: '#BBBBBB', width: 1 }],
            maxPadding: 0.3,
            minRange: 8,
            tickInterval: 10,
            gridLineColor: 'rgba(128, 128, 128, 0.1)',
            min:1,
          },
          {
            title: { text: null },
            labels: { enabled: false },
            gridLineWidth: 0,
            minRange: 10,
            min: 0,
            max: 100,
          },
          {
            allowDecimals: false,
            title: {
              text: 'hPa',
              offset: 0,
              align: 'high',
              rotation: 0,
              style: { fontSize: '1em', color: '#FFD700' },
              textAlign: 'left',
              x: 3,
            },
            labels: {
              style: { fontSize: '1em', color: '#FFD700' },
              y: 2,
              x: 3,
            },
            gridLineWidth: 0,
            opposite: true,
            showLastLabel: false,
          },
        ],
        series: [
          {
            name: 'Temperature',
            data: this.temperatures,
            type: 'line',
            color: '#FF3333',
            marker: { enabled: false },
            zIndex: 10,
            tooltip: { pointFormat: '<span style="color:{point.color}">\u25CF</span> Temperature: <b>{point.y}°F</b><br/>' },
          },
          {
            name: 'Humidity',
            data: this.humidity,
            type: 'column',
            color: '#68CFE8',
            yAxis: 1,
            pointPadding: 0,
            groupPadding: 0,
            dataLabels: {
              enabled: true,
              inside: false,
              align: 'center',
              verticalAlign: 'bottom',
              y: -5,
              format: '{y}',
              style: {
                fontSize: '0.4em',
                color: '#333',
                fontWeight: 'bold', 
                textOutline: '2px contrast', 
              },
            },
            tooltip: { valueSuffix: ' %' },
          },
          {
            name: 'Air pressure',
            data: this.pressures,
            type: 'spline',
            color: '#FFD700',
            yAxis: 2,
            tooltip: { valueSuffix: ' hPa' },
          },
          {
            name: 'Wind',
            type: 'windbarb',
            id: 'windbarbs',
            data: this.winds,
            color: '#FF3333',
            vectorLength: containerWidth * 0.009,
            yOffset: windBarbYOffset, 
            tooltip: { valueSuffix: ' m/s' },
          },
        ],
      };
    }
    
    
    

    createChart(container: HTMLElement) {
      this.chart = new Highcharts.Chart(this.getChartOptions(container), (chart) => {
        this.onChartLoad(chart);
      });
    }

    onChartLoad(chart: Highcharts.Chart) {
     // this.drawBlocksForWindArrows(chart);
    }

    drawBlocksForWindArrows(chart: Highcharts.Chart) {
      const xAxis = chart.xAxis[0];
      for (let pos = xAxis.min || 0, max = xAxis.max || 0; pos <= max + 36e5; pos += 36e5) {
        const x = Math.round(xAxis.toPixels(pos)) - 0.5;
    
        const path: Highcharts.SVGPathArray = [
          ['M', x, chart.plotTop + chart.plotHeight],
          ['L', x, chart.plotTop + chart.plotHeight + 32],
          ['Z']
        ];
    
        chart.renderer
          .path(path)
          .attr({
            stroke: chart.options.chart?.plotBorderColor || '#999',
            'stroke-width': 1,
          })
          .add();
      }
    }
  }

  // Move the useEffect hook here, outside of the Meteogram class
  useEffect((): void => {
    if (containerRef.current) {
      const meteogram = new Meteogram(hourlyData);
      meteogram.createChart(containerRef.current);
    }
  }, [hourlyData]);

  return <div ref={containerRef} className="container my-3" style={{ width: '100%', height: '400px' }} />;
};

export default Meteogram;
