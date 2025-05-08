import React from 'react';
import { useFavorites } from '../../context/FavoritesContext';

const FavouritesView = () => {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Favourites</h1>

      <div className="space-y-4">
        {favorites.length === 0 ? (
          <p className="text-gray-500">No favourites selected yet.</p>
        ) : (
          favorites.map((fav) => (
            <div
              key={fav.id}
              className="bg-[#1e1e2f] p-4 rounded flex items-center justify-between"
            >
              <span>{fav.name}</span>
              <div className="flex items-center space-x-4">
                <button className="bg-purple-800 hover:bg-purple-700 text-white px-3 py-1 rounded">
                  Preview
                </button>
                <button
                  className="text-white text-xl hover:text-red-500"
                  onClick={() => toggleFavorite(fav)}
                  title="Remove from favourites"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FavouritesView;
