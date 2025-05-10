import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Auth/LoginForm";
import RegistrationForm from "./components/Auth/RegistrationForm";
import MainLayout from "./components/Layout/MainLayout";
import CVDocumentsView from "./components/Dashboard/CVDocumentsView";
import ProfilesView from "./components/Dashboard/ProfilesView";
import FavouritesView from "./components/Dashboard/FavouritesView";
import SettingsView from "./components/Dashboard/SettingsView";
import { FavoritesProvider } from "./context/FavoritesContext";
import CreateVacancyPage from "./pages/CreateVacancyPage";
import { VacancyProvider } from "./context/VacancyContext";

function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter>
        <VacancyProvider>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/dashboard" element={<MainLayout />}>
              <Route index element={<CreateVacancyPage />} />
              <Route path=":vacancyId/cv-documents" element={<CVDocumentsView />} />
              <Route path=":vacancyId/profiles" element={<ProfilesView />} />
              <Route path=":vacancyId/favourites" element={<FavouritesView />} />

              <Route path="settings" element={<SettingsView />} />
            </Route>
          </Routes>
        </VacancyProvider>
      </BrowserRouter>
    </FavoritesProvider>
  );
}

export default App;
