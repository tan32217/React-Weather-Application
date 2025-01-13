import React, { useState } from 'react';
import StreetInput from './StreetInput';
import CityInput from './CityInput';
import StateDropdown from './StateDropdown';
import LocationCheckbox from './LocationCheckbox';
import FormButtons from './FormButtons';
import Buttons from './Buttons';
import ErrorAlert from './ErrorAlert';
import ForecastDisplay from './ForecastDisplay';
import { LoadScript } from '@react-google-maps/api';
import Favorites from './Favorites';

type Errors = {
  street: string | null;
  city: string | null;
  state: string | null;
};

const stateNames: { [key: string]: string }  = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "DC": "District Of Columbia",
  "FL": "Florida",
  "GA": "Georgia",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PA": "Pennsylvania",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
};

const WeatherForm: React.FC = () => {
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [autodetectLocation, setAutodetectLocation] = useState<boolean>(false);
  const [locationData, setLocationData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [hourlyData, setHourlyData] = useState<any>(null);
  const [errors, setErrors] = useState<Errors>({ street: null, city: null, state: null });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<string>('results');

  const isFormValid = () => {
    return autodetectLocation || (
      !errors.street &&
      !errors.city &&
      !errors.state &&
      street.trim() !== '' &&
      city.trim() !== '' &&
      state.trim() !== ''
    );
  };

  const validateField = (field: keyof Errors, value: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value ? null : `Please enter a valid ${field}`,
    }));
  };

  const fetchWeatherData = async (formattedResult: { city: string; state: string; lat: number; lon: number }) => {
    const { city, state} = formattedResult;
     const lat = parseFloat(String(formattedResult.lat));
     const lon = parseFloat(String(formattedResult.lon));
    const weatherUrl = `http://127.0.0.1:5000/get-weather?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`;
    const hourlyUrl = `http://127.0.0.1:5000/hourly-weather-data?lat=${lat}&lon=${lon}`;

    try {
      const weatherResponse = await fetch(weatherUrl);
      const hourlyResponse = await fetch(hourlyUrl);

      if (weatherResponse.ok && hourlyResponse.ok) {
        const weatherData = await weatherResponse.json();
        const hourlyData = await hourlyResponse.json();

        setWeatherData({ city, state, latitude: lat, longitude: lon, weather: weatherData });
        setHourlyData(hourlyData);
      } else {
        setErrorMessage("Failed to fetch weather data.");
      }
    } catch (error) {
      setErrorMessage("Error fetching weather data.");
    }
  };

  const handleFavoriteSelect = async (city: string, state: string) => {
    setActiveButton('results');
    setWeatherData(null);
    setHourlyData(null);
    setErrorMessage(null);
    setProgress(0);
    setShowProgress(true);

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 20, 100));
    }, 50);

    try {
      const encodedAddress = encodeURIComponent(`${city}, ${state}`);
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const formattedResult = {
          city,
          state,
          lat: location.lat,
          lon: location.lng,
        };
        await fetchWeatherData(formattedResult);
      } else {
        setErrorMessage("No results found for the address.");
      }
    } catch (error) {
      setErrorMessage("Error fetching location data from Google Maps API.");
    } finally {
      clearInterval(interval);  
      setProgress(100);
      setTimeout(() => setShowProgress(false), 100);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setActiveButton('results');
    setWeatherData(null);
    setHourlyData(null);
    setErrorMessage(null);
    setProgress(0);
    setShowProgress(true);

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 20, 100));
    }, 50);

    const completeFetch = async () => {
      if (autodetectLocation && locationData) {
        const [lat, lon] = locationData.loc.split(',');
        setActiveButton('results');
        const formattedResult = {
          city: locationData.city,
          state: stateNames[locationData.region] || locationData.region,
          lat,
          lon,
        };
        await fetchWeatherData(formattedResult);
      } else {
        setErrors({
          street: street ? null : 'Please enter a valid street',
          city: city ? null : 'Please enter a valid city',
          state: state ? null : 'Please select your state',
        });

        if (isFormValid()) {
          const encodedAddress = encodeURIComponent(`${street}, ${city}, ${state}`);
          try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
              const location = data.results[0].geometry.location;
              const formattedResult = {
                city,
                state: stateNames[state] || state,
                lat: location.lat,
                lon: location.lng,
              };
              await fetchWeatherData(formattedResult);
              console.log("geo coding data", formattedResult);
            } else {
              setErrorMessage("No results found for the address.");
            }
          } catch (error) {
            setErrorMessage("Error fetching location data from Google Maps API.");
          }
        }
      }
    };

    await completeFetch();
    clearInterval(interval);
    setProgress(100);
    setTimeout(() => setShowProgress(false), 100); 
  };

  const handleReset = () => {
    setStreet('');
    setCity('');
    setState('');
    setAutodetectLocation(false);
    setLocationData(null);
    setWeatherData(null);
    setHourlyData(null);
    setErrors({ street: null, city: null, state: null });
    setErrorMessage(null);
    setActiveButton('results');
  };

    const fetchLocationData = async () => {
    try {
      const response = await fetch('https://ipinfo.io?token={token}');
      const data = await response.json();
      setLocationData(data);
    } catch (error) {
      setErrorMessage("Error fetching location data.");
    }
  };

    const handleCheckboxToggle = () => {
    setAutodetectLocation(!autodetectLocation);
    if (!autodetectLocation) {
      fetchLocationData();
    } else {
      setLocationData(null);
    }
  };

  return (
    <>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''} libraries={['places']}>
        <div className="container">
          <form
            className="pt-4 pl-4 pr-4 border-left border-right border-top border-bottom"
            style={{ backgroundColor: '#f5f5f5' }}
            onSubmit={handleSubmit}
            onReset={handleReset}
          >
            <h1 className="mb-4 text-center">
              Weather Search <span role="img" aria-label="cloud">⛅</span>
            </h1>

            <div className='form-group row justify-content-center'>
              <div className='col-md-12'>
                <StreetInput 
                  street={street} 
                  setStreet={(value) => {
                    setStreet(value);
                    setErrors(prevErrors => ({ ...prevErrors, street: null }));
                  }} 
                  onBlur={() => validateField('street', street)}
                  error={errors.street} 
                  disabled={autodetectLocation}  
                />
                <CityInput 
                  city={city} 
                  setCity={(value) => {
                    setCity(value);
                    setErrors(prevErrors => ({ ...prevErrors, city: null }));
                  }} 
                  onBlur={() => validateField('city', city)}
                  error={errors.city} 
                  disabled={autodetectLocation && !!locationData} 
                />
                <StateDropdown 
                  selectedState={state} 
                  onStateChange={(value) => {
                    setState(value);
                    setErrors(prevErrors => ({ ...prevErrors, state: null }));
                  }} 
                  error={errors.state} 
                  setError={(error) => setErrors(prevErrors => ({ ...prevErrors, state: error }))}
                  disabled={autodetectLocation && !!locationData}  
                />
              </div>
            </div>

            <hr />
            <LocationCheckbox checked={autodetectLocation} onToggle={handleCheckboxToggle} />
            <FormButtons disabled={!isFormValid()} />
          </form>

          <Buttons activeButton={activeButton} setActiveButton={setActiveButton} />

          {activeButton === 'results' && weatherData && (
            <ForecastDisplay weatherData={weatherData} hourlyData={hourlyData} />
          )}
          {activeButton === 'favorites' && (
            <Favorites onSelectFavorite={handleFavoriteSelect} />
          )}
          
          {showProgress && (
            <div className="progress mb-3" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          {activeButton === 'results' && errorMessage && <ErrorAlert message="An error occurred. Please try again later." />}
        </div>
      </LoadScript>
    </>
  );
};

export default WeatherForm;
