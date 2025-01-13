
import React from 'react';

const weatherCodes: { [key: string]: [string, string] } = {
  "4201": ["Heavy Rain", "rain_heavy.svg"],
  "4001": ["Rain", "rain.svg"],
  "4200": ["Light Rain", "rain_light.svg"],
  "6201": ["Heavy Freezing Rain", "freezing_rain_heavy.svg"],
  "6001": ["Freezing Rain", "freezing_rain.svg"],
  "6200": ["Light Freezing Rain", "freezing_rain_light.svg"],
  "6000": ["Freezing Drizzle", "freezing_drizzle.svg"],
  "4000": ["Drizzle", "drizzle.svg"],
  "7101": ["Heavy Ice Pellets", "ice_pellets_heavy.svg"],
  "7000": ["Ice Pellets", "ice_pellets.svg"],
  "7102": ["Light Ice Pellets", "ice_pellets_light.svg"],
  "5101": ["Heavy Snow", "snow_heavy.svg"],
  "5000": ["Snow", "snow.svg"],
  "5100": ["Light Snow", "snow_light.svg"],
  "5001": ["Flurries", "flurries.svg"],
  "8000": ["Thunderstorm", "tstorm.svg"],
  "2100": ["Light Fog", "fog_light.svg"],
  "2000": ["Fog", "fog.svg"],
  "1001": ["Cloudy", "cloudy.svg"],
  "1102": ["Mostly Cloudy", "mostly_cloudy.svg"],
  "1101": ["Partly Cloudy", "partly_cloudy_day.svg"],
  "1100": ["Mostly Clear", "mostly_clear_day.svg"],
  "1000": ["Clear", "clear_day.svg"]
}

type DayViewProps = {
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
            };
          }>;
        }
      ];
    };
  };
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  onDateClick: (
    interval: DayViewProps["weatherData"]["data"]["timelines"][0]["intervals"][0],
    city: string,
    state: string,
    latitude: number,
    longitude: number
  ) => void;
};
const DayView: React.FC<DayViewProps> = ({ weatherData, city, state, latitude, longitude, onDateClick }) => {
  const dailyIntervals = weatherData.data.timelines[0].intervals;

  return (
    <div className="table-responsive">
      <table className="table  day-table text-start">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col">Temp. High(°F)</th>
            <th scope="col">Temp. Low(°F)</th>
            <th scope="col">Wind Speed(mph)</th>
          </tr>
        </thead>
        <tbody>
          {dailyIntervals.map((interval, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td
                onClick={() => onDateClick(interval, city, state, latitude, longitude)  }
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
              >
                {new Date(interval.startTime).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td className="status-cell">
                <span className="status-content">
                  <img
                    src={`/Images/weather_symbols/${weatherCodes[String(interval.values.weatherCode)][1]}`}
                    className="img-fluid weather-icon"
                    alt={weatherCodes[String(interval.values.weatherCode)][0]}
                  />
                  {weatherCodes[String(interval.values.weatherCode)][0]}
                </span>
              </td>
              <td>{interval.values.temperatureMax.toFixed(2)}</td>
              <td>{interval.values.temperatureMin.toFixed(2)}</td>
              <td>{interval.values.windSpeed.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DayView;
