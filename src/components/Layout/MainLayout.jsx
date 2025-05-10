import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import VacancySidebar from "../Sidebar/VacancySidebar";
import hamburgerIcon from "../../assets/hamburger.png";
import { useVacancy } from "../../context/VacancyContext";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showHamburger, setShowHamburger] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newVacancyName, setNewVacancyName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameTargetId, setRenameTargetId] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showGeneralSettings, setShowGeneralSettings] = useState(false);
  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const [deleteArchivedTarget, setDeleteArchivedTarget] = useState(null);
  const [showConfirmArchiveAll, setShowConfirmArchiveAll] = useState(false);
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const {
    addVacancy,
    deleteVacancy,
    renameVacancy,
    vacancies,
    archivedVacancies,
    archiveVacancy,
    unarchiveVacancy,
  } = useVacancy();
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

  useEffect(() => {
    if (showProfileDropdown !== "settings") {
      const handleClickOutside = (event) => {
        const dropdown = document.getElementById("profile-dropdown");
        if (dropdown && !dropdown.contains(event.target)) {
          setShowProfileDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showProfileDropdown]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

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

  const handleRenameOpen = (id, title) => {
    setRenameTargetId(id);
    setRenameValue(title);
    setRenameModalOpen(true);
  };

  const handleRenameConfirm = () => {
    if (renameValue.trim()) {
      renameVacancy(renameTargetId, renameValue.trim());
      setRenameModalOpen(false);
      setRenameValue("");
    }
  };

  const filteredVacancies = vacancies.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnarchiveAll = () => {
    archivedVacancies.forEach((v) => unarchiveVacancy(v.id));
  };

  const handleArchiveAllConfirm = () => {
    vacancies.forEach((v) => archiveVacancy(v.id));
    setShowConfirmArchiveAll(false);
  };

  const handleDeleteAllConfirm = () => {
    vacancies.forEach((v) => deleteVacancy(v.id));
    setShowConfirmDeleteAll(false);
  };

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
          onRenameStart={handleRenameOpen}
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
      {/* Profile dropdown top right */}
      <div className="absolute top-4 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-purple-700 flex items-center justify-center text-white hover:opacity-80 overflow-hidden"
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="User"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-lg font-semibold">U</span>
            )}
          </button>

          {showProfileDropdown && (
            <div
              id="profile-dropdown"
              className="absolute right-0 mt-2 w-48 bg-[#2c2c3a] rounded shadow-lg z-50"
            >
              <button
                onClick={() => setShowProfileDropdown("settings")}
                className="block w-full px-4 py-2 text-left hover:bg-purple-700 text-sm text-white"
              >
                Profile settings
              </button>
              <button
                onClick={() => setShowGeneralSettings(true)}
                className="block w-full px-4 py-2 text-left hover:bg-purple-700 text-sm text-white"
              >
                General settings
              </button>

              <button className="block w-full px-4 py-2 text-left hover:bg-purple-700 text-sm text-white">
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } p-4`}
      >
        <Outlet />
      </main>
      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#2c2c3a] p-6 rounded shadow-lg w-[300px]">
            <h2 className="text-lg mb-4">
              Are you sure you want to delete this vacancy?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteTarget(null)}
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

      {/* Create Modal */}
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
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-1 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Rename Modal */}
      {renameModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1e1e2f] p-6 rounded shadow-lg w-[350px]">
            <h2 className="text-lg font-semibold mb-4">Enter vacancy name</h2>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="Vacancy name"
              className="w-full p-2 mb-4 rounded bg-[#222b3c] text-white outline-none"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRenameModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameConfirm}
                className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-1 rounded"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      {showProfileDropdown === "settings" && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-[#1e1e2f] p-6 rounded-xl w-[90%] max-w-xl relative text-white">
            <button
              onClick={() => setShowProfileDropdown(false)}
              className="absolute top-2 right-3 text-white text-2xl"
            >
              ×
            </button>

            {/* Avatar un vārds */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={avatarPreview || "/default-avatar.jpeg"}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full bg-purple-800 object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute -top-2 -right-2 bg-[#1e1e2f] rounded-full p-1 hover:bg-[#333] transition"
                  title="Change avatar"
                >
                  <FiEdit className="text-white w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-lg font-semibold">RZK</p>
            </div>

            {/* Rediģējamie lauki (bez zīmulīšiem) */}
            <div className="space-y-4">
              <div>
                <label className="block text-purple-300 text-sm mb-1">
                  Organization name
                </label>
                <input
                  type="text"
                  defaultValue="RZK Solutions"
                  className="w-full bg-[#2d2d3d] text-white px-3 py-2 rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-purple-300 text-sm mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="email@rzk.com"
                  className="w-full bg-[#2d2d3d] text-white px-3 py-2 rounded outline-none"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button className="text-purple-400 underline hover:text-purple-300 text-sm">
                Change password
              </button>
              <button
                className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  // nākotnē varētu pievienot saglabāšanas loģiku
                  setShowProfileDropdown(false);
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showGeneralSettings && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-[#1e1e2f] p-6 rounded-xl w-[90%] max-w-xl text-white relative">
            <button
              onClick={() => setShowGeneralSettings(false)}
              className="absolute top-2 right-3 text-white text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold text-center mb-6">
              General settings
            </h2>
            <div className="divide-y divide-gray-600 space-y-4">
              <div className="flex justify-between items-center pt-2">
                <span>Archived vacancies</span>
                <button
                  className="bg-purple-800 hover:bg-purple-700 px-4 py-1 rounded text-white"
                  onClick={() => {
                    setShowGeneralSettings(false);
                    setShowArchivedModal(true);
                  }}
                >
                  Manage
                </button>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span>Archive all vacancies</span>
                <button
                  onClick={() => setShowConfirmArchiveAll(true)}
                  className="bg-purple-800 hover:bg-purple-700 px-4 py-1 rounded text-white"
                >
                  Archive
                </button>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span>Delete all vacancies</span>
                <button
                  onClick={() => setShowConfirmDeleteAll(true)}
                  className="bg-red-700 hover:bg-red-600 px-4 py-1 rounded text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showArchivedModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-[#1e1e2f] p-6 rounded-xl w-[90%] max-w-xl text-white relative">
            <button
              onClick={() => setShowArchivedModal(false)}
              className="absolute top-2 right-3 text-white text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Archived vacancies
            </h2>
            <div className="space-y-3">
              {archivedVacancies.map((v) => (
                <div
                  key={v.id}
                  className="flex justify-between items-center bg-[#2c2c3a] rounded px-4 py-2"
                >
                  <span className="text-purple-300 hover:underline cursor-pointer">
                    {v.title}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => unarchiveVacancy(v.id)}
                      className="bg-purple-800 hover:bg-purple-700 px-3 py-1 rounded text-white text-sm"
                    >
                      Unarchive
                    </button>
                    <button
                      onClick={() => setDeleteArchivedTarget(v.id)}
                      className="text-white hover:text-red-500 text-xl"
                      title="Delete archived vacancy"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleUnarchiveAll}
                className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Unarchive all
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteArchivedTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#2c2c3a] p-6 rounded shadow-lg w-[300px]">
            <h2 className="text-lg mb-4">
              Are you sure you want to delete this archived vacancy?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteArchivedTarget(null)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteVacancy(deleteArchivedTarget);
                  setDeleteArchivedTarget(null);
                }}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDeleteAll && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#2c2c3a] p-6 rounded shadow-lg w-[300px]">
            <h2 className="text-lg mb-4">
              Are you sure you want to delete all vacancies?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDeleteAll(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllConfirm}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmArchiveAll && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#2c2c3a] p-6 rounded shadow-lg w-[300px]">
            <h2 className="text-lg mb-4">
              Are you sure you want to archive all vacancies?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmArchiveAll(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleArchiveAllConfirm}
                className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-1 rounded"
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

export default MainLayout;
