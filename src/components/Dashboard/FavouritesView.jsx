import React from 'react';

const mockFavourites = [
  { id: 1, name: 'Name Surname' },
];

const FavouritesView = () => {
  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-6">Favourites</h1>

      <div className="space-y-4">
        {mockFavourites.map((fav) => (
          <div
            key={fav.id}
            className="bg-[#1e1e2f] p-4 rounded flex items-center justify-between"
          >
            <span>{fav.name}</span>
            <div className="flex items-center space-x-4">
              <button className="bg-purple-800 hover:bg-purple-700 text-white px-3 py-1 rounded">
                Preview
              </button>
              <button className="text-white text-xl hover:text-red-500">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavouritesView;
