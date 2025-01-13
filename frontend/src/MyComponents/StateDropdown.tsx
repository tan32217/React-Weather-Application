import React from 'react';
import Select from 'react-select';

const stateOptions =  [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "District Of Columbia", value: "DC" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" }
];


interface Props {
  selectedState: string;
  onStateChange: (value: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  disabled: boolean; 
}

const StateDropdown: React.FC<Props> = ({ selectedState, onStateChange, error, setError, disabled }) => {
  const handleChange = (option: { value: string; label: string } | null) => {
    onStateChange(option ? option.value : '');
    setError(null);
  };

  const handleBlur = () => {
    if (!selectedState) {
      setError("Please select your state");
    }
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderColor: error ? 'red' : provided.borderColor,
      boxShadow: error ? '0 0 0 1px red' : provided.boxShadow,
      backgroundColor: disabled ? '#e9ecef' : provided.backgroundColor,
    }),
    placeholder: (provided: any) => ({
      ...provided,
      textAlign: 'left',
    }),
    menu: (provided: any) => ({
      ...provided,
      textAlign: 'left', 
    }),
    option: (provided: any) => ({
      ...provided,
      textAlign: 'left', 
    }),
    singleValue: (provided: any) => ({
      ...provided,
      textAlign: 'left',
    }),
  };
  

  return (
    <div className="mb-3 row">
      <label htmlFor="state" className="col-sm-2 col-form-label">
        State<span className="text-danger">*</span>
      </label>
      <div className="col-sm-4 col-form-select">
        <Select
          id="state"
          value={stateOptions.find(option => option.value === selectedState) || null}
          onChange={handleChange}
          onBlur={handleBlur}
          options={stateOptions}
          placeholder="Select your state"
          isClearable
          styles={customStyles}
          isDisabled={disabled}  
        />
      </div>
    </div>
  );
};

export default StateDropdown;


