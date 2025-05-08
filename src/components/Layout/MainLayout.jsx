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

  const { addVacancy, deleteVacancy, activeVacancy } = useVacancy();
  const navigate = useNavigate();
  const location = useLocation();

  // Hamburger parādīšana ar aizkavi pēc aizvēršanas
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

  return (
    <div className="flex min-h-screen bg-black text-white relative">
      {/* Sidebar */}
      <div
        className={`fixed z-40 top-0 left-0 h-full transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <VacancySidebar
          closeSidebar={() => setIsSidebarOpen(false)}
          onShowCreateModal={() => setShowCreateModal(true)}
          onConfirmDelete={(id) => setDeleteTarget(id)}
        />
      </div>

      {/* Hamburger */}
      {showHamburger && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 opacity-0 animate-fadeIn"
        >
          <img src={hamburgerIcon} alt="Open Sidebar" className="w-8 h-8" />
        </button>
      )}

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} p-4`}>
        <Outlet />
      </main>

      {/* Modāļi ārpus Sidebar */}
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
    </div>
  );
};

export default MainLayout;
