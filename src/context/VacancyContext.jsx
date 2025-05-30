import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const VacancyContext = createContext();

export const VacancyProvider = ({ children }) => {
  const [vacancies, setVacancies] = useState([]);
  const [archivedVacancies, setArchivedVacancies] = useState([]);
  const [activeVacancy, setActiveVacancy] = useState(null);
  const navigate = useNavigate();
  const [cvResultsByVacancy, setCvResultsByVacancy] = useState({});
  const [cvFilesByVacancy, setCvFilesByVacancy] = useState({});
  const [promptHistoryByVacancy, setPromptHistoryByVacancy] = useState({});



  const addVacancy = (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const id = Date.now().toString();
    const newVacancy = { id, title: name, slug };
    setVacancies((prev) => [...prev, newVacancy]);
    setActiveVacancy(newVacancy);
    navigate(`/dashboard/${id}/cv-documents`);
    return newVacancy;
  };

  const deleteVacancy = (id) => {
    setVacancies((prev) => prev.filter((v) => v.id !== id));
    setArchivedVacancies((prev) => prev.filter((v) => v.id !== id));
    if (activeVacancy?.id === id) {
      setActiveVacancy(null);
      navigate("/dashboard");
    }
  };

  const renameVacancy = (id, newTitle) => {
    setVacancies((prev) =>
      prev.map((v) => (v.id === id ? { ...v, title: newTitle } : v))
    );
    setArchivedVacancies((prev) =>
      prev.map((v) => (v.id === id ? { ...v, title: newTitle } : v))
    );
  };

  const archiveVacancy = (id) => {
    const toArchive = vacancies.find((v) => v.id === id);
    if (toArchive) {
      setArchivedVacancies((prev) => [...prev, toArchive]);
      setVacancies((prev) => prev.filter((v) => v.id !== id));
      if (activeVacancy?.id === id) {
        setActiveVacancy(null);
        navigate("/dashboard");
      }
    }
  };

  const unarchiveVacancy = (id) => {
    const toRestore = archivedVacancies.find((v) => v.id === id);
    if (toRestore) {
      setVacancies((prev) => [...prev, toRestore]);
      setArchivedVacancies((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const setProfilesForVacancy = (vacancyId, profiles) => {
    setCvResultsByVacancy((prev) => ({
      ...prev,
      [vacancyId]: profiles,
    }));
  };

  const getProfilesForVacancy = (vacancyId) => {
    return cvResultsByVacancy[vacancyId] || [];
  };

  const setCvFilesForVacancy = (vacancyId, files) => {
    setCvFilesByVacancy((prev) => ({
      ...prev,
      [vacancyId]: files,
    }));
  };

  const getCvFilesForVacancy = (vacancyId) => {
    return cvFilesByVacancy[vacancyId] || [];
  };

  const addPromptForVacancy = (vacancyId, promptText) => {
  setPromptHistoryByVacancy((prev) => ({
    ...prev,
    [vacancyId]: [...(prev[vacancyId] || []), promptText],
  }));
};

const getPromptsForVacancy = (vacancyId) => {
  return promptHistoryByVacancy[vacancyId] || [];
};



  return (
    <VacancyContext.Provider
      value={{
        vacancies,
        archivedVacancies,
        activeVacancy,
        addVacancy,
        deleteVacancy,
        renameVacancy,
        archiveVacancy,
        unarchiveVacancy,
        setActiveVacancy,
        cvResultsByVacancy,
        setProfilesForVacancy,
        getProfilesForVacancy,
        cvFilesByVacancy,
        setCvFilesForVacancy,
        getCvFilesForVacancy,
        addPromptForVacancy,
        getPromptsForVacancy,
      }}
    >
      {children}
    </VacancyContext.Provider>
  );
};

export const useVacancy = () => useContext(VacancyContext);
