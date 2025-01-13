import React from 'react';

interface Props {
  street: string;
  setStreet: (value: string) => void;
  error: string | null;
  onBlur: () => void;
  disabled: boolean; 
}

const StreetInput: React.FC<Props> = ({ street, setStreet, error, onBlur, disabled }) => (
  <div className="form-group row">
    <label htmlFor="street" className="col-12 col-sm-2 col-form-label text-left">
      Street<span className="text-danger">*</span>
    </label>
    <div className="col-sm-7 col-form-input">
      <input
        type="text"
        className={`form-control ${error ? 'is-invalid' : ''}`}
        id="street"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}  
      />
      {error && <div className="invalid-feedback" style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem', textAlign: 'left' }}>{error}</div>}
    </div>
  </div>
);

export default StreetInput;

