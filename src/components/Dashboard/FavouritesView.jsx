import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useVacancy } from '../../context/VacancyContext';

const FavouritesView = () => {
  const { vacancyId } = useParams();
  const { getFavorites, toggleFavorite } = useFavorites();
  const { vacancies } = useVacancy();

  const favorites = getFavorites(vacancyId);
  const currentVacancy = vacancies.find(v => v.id === vacancyId);
  const vacancyName = currentVacancy?.title || 'Unknown Vacancy';
  const [previewProfile, setPreviewProfile] = useState(null);

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {vacancyName} - Favourites
      </h1>

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
                <button
                  onClick={() => setPreviewProfile(fav)}
                  className="bg-purple-800 hover:bg-purple-700 text-white px-3 py-1 rounded"
                >
                  Preview
                </button>
                <button
                  className="text-white text-xl hover:text-red-500"
                  onClick={() => toggleFavorite(vacancyId, fav)}
                  title="Remove from favourites"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {previewProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-[#1e1e2f] p-6 rounded-lg w-[90%] max-w-xl text-white relative">
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={() => setPreviewProfile(null)}
            >
              ✕
            </button>
            <div className="text-center mb-4">
              <div className="w-20 h-20 rounded-full bg-purple-300 text-purple-800 mx-auto flex items-center justify-center text-3xl font-bold">
                👤
              </div>
              <p className="mt-2 font-medium">{previewProfile.name}</p>
            </div>
            <div>
              <h3 className="font-semibold underline text-lg mb-1">Stands out with:</h3>
              <p className="text-sm mb-3">Info Info Info Info Info Info Info Info Info Info Info Info Info Info Info Info Info Info Info Info Info Info</p>
              <h3 className="font-semibold text-lg mb-1">Experience</h3>
              <p className="text-sm mb-3">Info Info Info Info Info Info Info Info Info Info</p>
              <h3 className="font-semibold underline text-lg mb-1">Education:</h3>
              <p className="text-sm">Info Info Info</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavouritesView;
