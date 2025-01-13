import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface FormButtonsProps {
  disabled: boolean;
}

const FormButtons: React.FC<FormButtonsProps> = ({ disabled }) => (
  <div className="d-flex justify-content-center">
    <button type="submit" className="btn btn-primary me-2" disabled={disabled}>
      <i className="fa fa-search" aria-hidden="true"></i> <FontAwesomeIcon icon={faSearch} /> Search
    </button>
    <button type="reset" className="btn btn-outline-secondary">
  <i className="bi bi-list-nested"></i> Clear
</button>
  </div>
);

export default FormButtons;
