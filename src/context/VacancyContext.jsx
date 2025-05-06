import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VacancyContext = createContext();

export const VacancyProvider = ({ children }) => {
  const [vacancies, setVacancies] = useState([]);
  const [activeVacancy, setActiveVacancy] = useState(null);
  const navigate = useNavigate();

  const addVacancy = (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const id = Date.now().toString(); // vai UUID, ja nepieciešams
    const newVacancy = { id, title: name, slug };
    setVacancies((prev) => [...prev, newVacancy]);
    setActiveVacancy(newVacancy);
    navigate('/dashboard/cv-documents');
  };

  const deleteVacancy = (id) => {
    setVacancies((prev) => prev.filter(v => v.id !== id));
    if (activeVacancy?.id === id) {
      setActiveVacancy(null);
      navigate('/dashboard');
    }
  };

  return (
    <VacancyContext.Provider
      value={{ vacancies, addVacancy, deleteVacancy, activeVacancy, setActiveVacancy }}
    >
      {children}
    </VacancyContext.Provider>
  );
};

export const useVacancy = () => useContext(VacancyContext);
