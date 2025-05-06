import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useVacancy } from '../../context/VacancyContext';

const VacancySidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vacancies, deleteVacancy } = useVacancy();
  const [openSections, setOpenSections] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const match = vacancies.find((v) => location.pathname.includes(v.id));
    if (match) {
      setOpenSections((prev) => ({ ...prev, [match.id]: true }));
    }
  }, [location, vacancies]);

  const toggleDropdown = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const confirmDelete = (id) => {
    setDeleteTarget(id);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleDelete = () => {
    const isCurrentVacancy = location.pathname.includes(deleteTarget);
    deleteVacancy(deleteTarget);
    setDeleteTarget(null);
    if (isCurrentVacancy) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="w-64 bg-[#1e1e2f] text-white p-4 flex flex-col justify-between relative">
      <div>
        <h2 className="text-lg font-semibold mb-6">EASYRECRUIT</h2>

        {vacancies.map((vacancy) => {
          const isOpen = openSections[vacancy.id];
          return (
            <div key={vacancy.id} className="mb-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => toggleDropdown(vacancy.id)}
                  className="text-purple-400 font-semibold text-left focus:outline-none"
                >
                  {vacancy.title}
                </button>
                <button
                  onClick={() => confirmDelete(vacancy.id)}
                  className="text-gray-400 hover:text-red-500 text-sm ml-2"
                  title="Delete vacancy"
                >
                  ✕
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <ul className="pl-4 space-y-1 pt-1">
                  <li>
                    <Link to="/dashboard/cv-documents" className="hover:underline">
                      CV documents
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/profiles" className="hover:underline">
                      Profiles
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/favourites" className="hover:underline">
                      Favourites
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-purple-700 mt-4">EASYRECRUIT</p>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#2c2c3a] p-6 rounded shadow-lg w-[300px]">
            <h2 className="text-lg mb-4">Are you sure you want to delete this vacancy?</h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacancySidebar;
