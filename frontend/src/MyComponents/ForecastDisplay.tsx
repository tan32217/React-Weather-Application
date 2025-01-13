import React, { useState, useEffect } from 'react';
import DayView from './DayView';
import DailyTempChart from './DailyTempChart';
import Meteogram from './Meteogram';
import DetailViewDay from './DetailViewDay';

type ForecastDisplayProps = {
  weatherData: {
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    weather: any;
  };
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

const ForecastDisplay: React.FC<ForecastDisplayProps> = ({ weatherData, hourlyData }) => {
  const [activeTab, setActiveTab] = useState<string>('dayView');
  const [selectedInterval, setSelectedInterval] = useState<any>(null);
  const [lastVisitedInterval, setLastVisitedInterval] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [animationClass, setAnimationClass] = useState<string>(''); 

  const { city, state, latitude, longitude } = weatherData;

  useEffect(() => {
    if (!lastVisitedInterval && weatherData.weather.weather.data.timelines[0].intervals.length > 0) {
      setLastVisitedInterval(weatherData.weather.weather.data.timelines[0].intervals[0]);
    }
  }, [weatherData, lastVisitedInterval]);


  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/favorites');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const favorites = await response.json();
        const isFavorite = favorites.some((fav: { city: string, state: string }) => fav.city === city && fav.state === state);
        setIsFavorited(isFavorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
    checkFavoriteStatus();
  }, [city, state]);

  const addFavorite = async () => {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city, state }), 
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setIsFavorited(true);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };
  

  const deleteFavorite = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/favorites?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setIsFavorited(false);
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  const toggleFavorite = () => {
    if (isFavorited) {
      deleteFavorite();
    } else {
      addFavorite();
    }
  };

  const handleDateClick = (interval: any) => {
    setAnimationClass('slide-out-left');
    setTimeout(() => {
      setSelectedInterval({ interval, city, state, latitude, longitude });
      setLastVisitedInterval(interval);
      setAnimationClass('slide-in-right');
    }, 250);
  };

  const handleBackClick = () => {
    setAnimationClass('slide-out-right');
    setTimeout(() => {
      setSelectedInterval(null);
      setAnimationClass('slide-in-left');
    }, 250);
  };

  const handleLastVisitedClick = () => {
    if (lastVisitedInterval) {
      setAnimationClass('slide-out-left');
      setTimeout(() => {
        setSelectedInterval({ interval: lastVisitedInterval, city, state, latitude, longitude });
        setAnimationClass('slide-in-right');
      }, 250);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dayView':
        return (
          <DayView
            weatherData={weatherData.weather.weather}
            city={city}
            state={state}
            latitude={latitude}
            longitude={longitude}
            onDateClick={handleDateClick}
          />
        );
      case 'dailyTempChart':
        return <DailyTempChart weatherData={weatherData.weather.weather} />;
      case 'meteogram':
        return <Meteogram hourlyData={hourlyData} />;
      default:
        return null;
    }
  };

  return (
    <div className={`container mt-4 ${animationClass}`}>
      {selectedInterval ? (
        <DetailViewDay
          interval={selectedInterval.interval}
          city={selectedInterval.city}
          state={selectedInterval.state}
          latitude={selectedInterval.latitude}
          longitude={selectedInterval.longitude}
          onBack={handleBackClick}
        />
      ) : (
        <>
          <div className="text-center mb-3">
  <h2 id="forcast_title">Forecast at {city}, {state}</h2>
</div>

<div className="d-flex justify-content-end align-items-center mb-3">
  <button 
    type="button"
    onClick={toggleFavorite}
    className="btn d-flex align-items-center p-1 rounded"
    style={{ 
      marginInlineEnd: '8px', 
      border: '1px solid black', 
      backgroundColor: 'transparent' 
    }}
  >
    <span 
      className="material-icons" 
      style={{ 
        color: isFavorited ? 'yellow' : 'white', 
        WebkitTextStroke: '1px black' 
      }}
    >
      star
    </span>
  </button>
  
  <div
    className="d-flex align-items-center"
    style={{ cursor: 'pointer' }}
    onClick={handleLastVisitedClick}
  >
    <span>Details</span>
    <span className="material-icons">arrow_forward_ios</span>
  </div>
</div>

          <ul className="nav nav-tabs justify-content-end">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'dayView' ? 'active' : ''}`}
                onClick={() => setActiveTab('dayView')}
              >
                Day view
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'dailyTempChart' ? 'active' : ''}`}
                onClick={() => setActiveTab('dailyTempChart')}
              >
                Daily Temp. Chart
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'meteogram' ? 'active' : ''}`}
                onClick={() => setActiveTab('meteogram')}
              >
                Meteogram
              </button>
            </li>
          </ul>

          <div>{renderTabContent()}</div>
        </>
      )}
    </div>
  );
};

export default ForecastDisplay;
