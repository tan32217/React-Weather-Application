import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

interface Favorite {
  _id: string;
  city: string;
  state: string;
}

interface FavoritesProps {
  onSelectFavorite: (city: string, state: string) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ onSelectFavorite }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/favorites');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data: Favorite[] = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const deleteFavorite = async (city: string, state: string) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/favorites?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setFavorites(favorites.filter(favorite => favorite.city !== city || favorite.state !== state));
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  return (
    <div className="container mt-4">
      {favorites.length === 0 ? (
        <div className="alert alert-warning" role="alert" style={{ backgroundColor: "#FFF3CD", color: "#856404", textAlign: 'left' }}>
          Sorry. No records found.
        </div>
      ) : (
        <table className="table favourite-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">City</th>
              <th scope="col">State</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {favorites.map((item, index) => (
              <tr key={item._id}>
                <th scope="row">{index + 1}</th>
                <td>
                  <a href="#" onClick={() => onSelectFavorite(item.city, item.state)}>
                    {item.city}
                  </a>
                </td>
                <td>
                  <a href="#" onClick={() => onSelectFavorite(item.city, item.state)}>
                    {item.state}
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => deleteFavorite(item.city, item.state)}
                    className="btn btn-link" id="dusbin"
                  >
                    <FontAwesomeIcon icon={faTrashCan} color="black" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Favorites;
