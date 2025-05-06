import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (profile) => {
    const exists = favorites.find((fav) => fav.id === profile.id);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.id !== profile.id));
    } else {
      setFavorites([...favorites, profile]);
    }
  };

  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
