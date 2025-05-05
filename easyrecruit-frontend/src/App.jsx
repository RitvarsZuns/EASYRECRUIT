import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import RegistrationForm from './components/Auth/RegistrationForm';
import MainLayout from './components/Layout/MainLayout';
import CVDocumentsView from './components/Dashboard/CVDocumentsView';
import ProfilesView from './components/Dashboard/ProfilesView';
import FavouritesView from './components/Dashboard/FavouritesView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        
        {/* Layout with nested routes */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route path="cv-documents" element={<CVDocumentsView />} />
          <Route path="profiles" element={<ProfilesView />} />
          <Route path="favourites" element={<FavouritesView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
