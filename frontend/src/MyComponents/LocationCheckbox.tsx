import React from 'react';

interface Props {
  checked: boolean;
  onToggle: () => void;
}

const LocationCheckbox: React.FC<Props> = ({ checked, onToggle }) => (
  <div className="d-flex justify-content-center">
    <div className="ff">
      Autodetect Location<span className="text-danger">*</span>
    </div>
    <div className="ff">
      <input
        type="checkbox"
        className="form-check-input me-2"
        id="autodetectLocation"
        checked={checked}
        onChange={onToggle}
      />
      <label htmlFor="autodetectLocation" className="form-check-label">
        Current Location
      </label>
    </div>
  </div>
);

export default LocationCheckbox;
