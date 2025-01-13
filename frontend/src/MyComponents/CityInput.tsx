import React, { useState, useEffect, useRef } from 'react';

interface Props {
  city: string;
  setCity: (value: string) => void;
  error: string | null;
  onBlur: () => void;
  disabled: boolean;
}

const CityInput: React.FC<Props> = ({ city, setCity, error, onBlur, disabled }) => {
  const [suggestions, setSuggestions] = useState<Array<{ place_id: string; cityName: string }> | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (city) {
      const autocompleteService = new google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        {
          input: city,
          types: ['(cities)'],
          componentRestrictions: { country: 'us' },
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.map(prediction => ({
              place_id: prediction.place_id,
              cityName: prediction.structured_formatting.main_text,
            })));
          } else {
            setSuggestions(null);
          }
        }
      );
    } else {
      setSuggestions(null);
    }
  }, [city]);

  return (
    <div className="form-group row" style={{ position: 'relative' }}>
      <label htmlFor="city" className="col-sm-2 col-form-label">
        City<span className="text-danger">*</span>
      </label>
      <div className="col-sm-7 col-form-input" style={{ position: 'relative' }}>
        <input
          type="text"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          id="city"
          value={city}
          ref={inputRef}
          onChange={(e) => {
            setCity(e.target.value);
            setShowDropdown(true);
          }}
          onBlur={() => {
            
            setTimeout(() => setShowDropdown(false), 100);
            onBlur();
          }}
          onFocus={() => setShowDropdown(true)}  
          disabled={disabled}
        />

        {error && <div className="validation-error" style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem', textAlign: 'left' }}>{error}</div>}

        {showDropdown && suggestions && (
          <ul
            style={{
              position: 'absolute',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              maxHeight: '150px',
              overflowY: 'auto',
              zIndex: 1000,
              padding: 0,
              margin: 0,
              listStyle: 'none',
              textAlign: 'left',
              width: '100%',
              boxSizing: 'border-box',
              top: '100%',
            }}
          >
            {suggestions.map(suggestion => (
              <li
                key={suggestion.place_id}
                onMouseDown={(e) => {
                  e.preventDefault(); 
                  setCity(suggestion.cityName);
                  setShowDropdown(false);
                }}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                }}
              >
                {suggestion.cityName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CityInput;
