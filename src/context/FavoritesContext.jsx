import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favoritesByVacancy, setFavoritesByVacancy] = useState({});

  const toggleFavorite = (vacancyId, profile) => {
    setFavoritesByVacancy((prev) => {
      const currentFavs = prev[vacancyId] || [];
      const exists = currentFavs.find((p) => p.id === profile.id);
      const updated = exists
        ? currentFavs.filter((p) => p.id !== profile.id)
        : [...currentFavs, profile];
      return { ...prev, [vacancyId]: updated };
    });
  };

  const isFavorite = (vacancyId, profileId) => {
    return (favoritesByVacancy[vacancyId] || []).some((p) => p.id === profileId);
  };

  const getFavorites = (vacancyId) => favoritesByVacancy[vacancyId] || [];

  return (
    <FavoritesContext.Provider value={{ toggleFavorite, isFavorite, getFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
