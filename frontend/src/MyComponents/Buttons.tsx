import React from 'react';

interface ButtonsProps {
  activeButton: string;
  setActiveButton: (button: string) => void;
}

const Buttons: React.FC<ButtonsProps> = ({ activeButton, setActiveButton }) => {
  return (
    <div className="container text-center mt-4">
      <button
        type="button"
        className={`btn me-2 ${activeButton === 'results' ? 'btn-primary text-white' : 'btn-link text-primary btn-no-underline'}`}
        onClick={() => setActiveButton('results')}
      >
        <i className="fa fa-search" aria-hidden="true"></i> Results
      </button>
      <button
        type="button"
        className={`btn ${activeButton === 'favorites' ? 'btn-primary text-white' : 'btn-link text-primary btn-no-underline'}`}
        onClick={() => setActiveButton('favorites')}
      >
        <i className="fa fa-heart" aria-hidden="true"></i> Favorites
      </button>
    </div>
  );
};

export default Buttons;



