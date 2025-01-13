import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


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

type DetailViewDayProps = {
  interval: {
    startTime: string;
    values: {
      cloudCover: number;
      humidity: number;
      moonPhase: number;
      precipitationProbability: number;
      precipitationType: number;
      pressureSeaLevel: number;
      sunriseTime: string;
      sunsetTime: string;
      temperature: number;
      temperatureApparent: number;
      temperatureMax: number;
      temperatureMin: number;
      uvIndex: number;
      visibility: number;
      weatherCode: number;
      windDirection: number;
      windSpeed: number;
      status: string;
    };
  };
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  onBack: () => void;
};

const loadGoogleMapsScript = (callback: () => void) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  const existingScript = document.getElementById('googleMaps');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.id = 'googleMaps';
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.body.appendChild(script);
  } else {
    existingScript.onload = callback;
  }
};

const DetailViewDay: React.FC<DetailViewDayProps> = ({ interval, city, state, latitude, longitude, onBack }) => {
  const formattedDate = new Date(interval.startTime).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const tweetText = `The temperature in ${city}, ${state} on ${formattedDate} is ${interval.values.temperature}°F. The weather conditions are ${weatherCodes[interval.values.weatherCode][0]} #CSCI571WeatherSearch`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapLoaded) {
      loadGoogleMapsScript(() => {
        if (window.google && mapRef.current) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: latitude, lng: longitude },
            zoom: 12,
          });
          new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
          });
          setMapLoaded(true);
        }
      });
    }
  }, [latitude, longitude, mapLoaded]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-light d-flex align-items-center" onClick={onBack}>
          <i className="material-icons">chevron_left</i> List
        </button>
        <h3 className="text-center" id="detail_view_title">{formattedDate}</h3>
        <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
          <button className="btn btn-light bi bi-twitter-x" style={{ fontSize: '1.5rem' }}></button>
        </a>
      </div>
      
      <table className="table detail-table table-striped">
        <tbody className="text-start">
          <tr>
            <th scope="row" style={{ width: '30%' }}>Status</th>
            <td>{weatherCodes[interval.values.weatherCode][0]}</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: '30%' }}>Max Temperature</th>
            <td>{interval.values.temperatureMax.toFixed(2)}°F</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: '35%' }}>Min Temperature</th>
            <td>{interval.values.temperatureMin.toFixed(2)}°F</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: '35%' }}>Apparent Temperature</th>
            <td>{interval.values.temperatureApparent.toFixed(2)}°F</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: '35%' }}>Sun Rise Time</th>
            <td>{new Date(interval.values.sunriseTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: '35%' }}>Sun Set Time</th>
            <td>{new Date(interval.values.sunsetTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: '35%' }}>Humidity</th>
            <td>{interval.values.humidity}%</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: '35%' }}>Wind Speed</th>
            <td>{interval.values.windSpeed} mph</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: '35%' }}>Visibility</th>
            <td>{interval.values.visibility} mi</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: '35%' }}>Cloud Cover</th>
            <td>{interval.values.cloudCover}%</td>
          </tr>
        </tbody>
      </table>
      <div className="map-container" style={{ height: '400px', width: '100%', marginBottom: '20px' }}>
        <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
      </div>
    </div>
  );
};

export default DetailViewDay;

