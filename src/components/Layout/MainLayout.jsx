import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import VacancySidebar from "../Sidebar/VacancySidebar";
import hamburgerIcon from "../../assets/hamburger.png";
import { useVacancy } from "../../context/VacancyContext";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showHamburger, setShowHamburger] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newVacancyName, setNewVacancyName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { addVacancy, deleteVacancy, vacancies } = useVacancy();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timer;
    if (!isSidebarOpen) {
      timer = setTimeout(() => setShowHamburger(true), 300);
    } else {
      setShowHamburger(false);
    }
    return () => clearTimeout(timer);
  }, [isSidebarOpen]);

  const handleCreate = () => {
    if (newVacancyName.trim()) {
      addVacancy(newVacancyName.trim());
      setNewVacancyName("");
      setShowCreateModal(false);
    }
  };

  const handleDelete = () => {
    const isCurrent = location.pathname.includes(deleteTarget);
    deleteVacancy(deleteTarget);
    setDeleteTarget(null);
    if (isCurrent) navigate("/dashboard");
  };

  const handleSearchNavigate = (vacancyId) => {
    setSearchQuery("");
    setShowSearchModal(false);
    navigate(`/dashboard/${vacancyId}/cv-documents`);
  };

  const filteredVacancies = vacancies.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-black text-white relative">
      <div
        className={`fixed z-40 top-0 left-0 h-full transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <VacancySidebar
          closeSidebar={() => setIsSidebarOpen(false)}
          onShowCreateModal={() => setShowCreateModal(true)}
          onConfirmDelete={(id) => setDeleteTarget(id)}
          onSearch={() => setShowSearchModal(true)}
        />
      </div>

      {showHamburger && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 opacity-0 animate-fadeIn"
        >
          <img src={hamburgerIcon} alt="Open Sidebar" className="w-8 h-8" />
        </button>
      )}

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} p-4`}>
        <Outlet />
      </main>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#2c2c3a] p-6 rounded shadow-lg w-[300px]">
            <h2 className="text-lg mb-4">Are you sure you want to delete this vacancy?</h2>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setDeleteTarget(null)} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded">Yes</button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1e1e2f] p-6 rounded shadow-lg w-[350px]">
            <h2 className="text-lg font-semibold mb-4">Enter vacancy name</h2>
            <input
              type="text"
              value={newVacancyName}
              onChange={(e) => setNewVacancyName(e.target.value)}
              placeholder="Vacancy name"
              className="w-full p-2 mb-4 rounded bg-[#222b3c] text-white outline-none"
            />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowCreateModal(false)} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded">Cancel</button>
              <button onClick={handleCreate} className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-1 rounded">Create</button>
            </div>
          </div>
        </div>
      )}

      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-[#1e1e2f] p-6 rounded-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Search vacancy</h2>
            <input
              type="text"
              placeholder="Start typing a vacancy name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
            />
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredVacancies.length === 0 ? (
                <p className="text-gray-400">No matching vacancies.</p>
              ) : (
                filteredVacancies.map((v) => (
                  <button
                    key={v.id}
                    className="block w-full text-left text-purple-400 hover:underline"
                    onClick={() => handleSearchNavigate(v.id)}
                  >
                    {v.title}
                  </button>
                ))
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
