import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useVacancy } from "../../context/VacancyContext";
import { useFavorites } from "../../context/FavoritesContext";
import { Plus, Search, MoreVertical } from "lucide-react";
import hamburgerIcon from "../../assets/hamburger.png";

const Badge = ({ count }) =>
  count > 0 && (
    <span className="ml-2 bg-purple-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
      {count}
    </span>
  );

const VacancySidebar = ({
  closeSidebar,
  onShowCreateModal,
  onConfirmDelete,
  onSearch,
  onRenameStart,
}) => {
  const location = useLocation();
  const { vacancies, archiveVacancy, renameVacancy, getProfilesForVacancy } = useVacancy();
  const { getFavorites } = useFavorites();
  const [openSections, setOpenSections] = useState({});
  const [dropdowns, setDropdowns] = useState({});
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdowns({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const match = vacancies.find((v) => location.pathname.includes(v.id));
    if (match) {
      setOpenSections({ [match.id]: true });
    }
  }, [location, vacancies]);

  const toggleDropdown = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMenu = (id) => {
    setDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRenameStart = (id, title) => {
    onRenameStart(id, title);
    setDropdowns({});
  };

  const handleArchive = (id) => {
    archiveVacancy(id);
    setDropdowns({});
  };

  return (
    <>
      <div className="w-64 bg-[#1e1e2f] text-white p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <button onClick={closeSidebar} title="Close sidebar">
            <img src={hamburgerIcon} alt="Close Sidebar" className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <button onClick={onSearch} title="Search" className="ml-2">
              <Search className="text-white hover:text-purple-400 w-5 h-6" />
            </button>
            <button onClick={onShowCreateModal} title="Add vacancy">
              <Plus className="text-white hover:text-purple-400 w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-3 scrollbar-custom">
          {vacancies
            .slice()
            .reverse()
            .map((vacancy) => {
              const isOpen = openSections[vacancy.id];
              const favCount = getFavorites(vacancy.id).length;
              const profileCount = getProfilesForVacancy(vacancy.id).length;

              return (
                <div key={vacancy.id} className="mb-4 relative">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => toggleDropdown(vacancy.id)}
                      className="text-purple-400 font-semibold text-left focus:outline-none"
                    >
                      {vacancy.title}
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleMenu(vacancy.id)}
                        className="text-gray-400 hover:text-white text-sm"
                        title="More"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onConfirmDelete(vacancy.id)}
                        className="text-gray-400 hover:text-red-500 text-sm"
                        title="Delete vacancy"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {dropdowns[vacancy.id] && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-6 mt-2 bg-[#2a2a3a] rounded shadow-lg z-50 w-32"
                    >
                      <button
                        className="block w-full px-4 py-2 text-left hover:bg-purple-700 text-sm"
                        onClick={() =>
                          handleRenameStart(vacancy.id, vacancy.title)
                        }
                      >
                        Rename
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-left hover:bg-purple-700 text-sm"
                        onClick={() => handleArchive(vacancy.id)}
                      >
                        Archive
                      </button>
                    </div>
                  )}

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="pl-4 space-y-1 pt-1">
                      <li>
                        <Link
                          to={`/dashboard/${vacancy.id}/cv-documents`}
                          className="hover:underline"
                        >
                          CV documents
                        </Link>
                      </li>
                      <li className="flex items-center">
                        <Link
                          to={`/dashboard/${vacancy.id}/profiles`}
                          className="hover:underline"
                        >
                          Profiles
                        </Link>
                        <Badge count={profileCount} />
                      </li>
                      <li className="flex items-center">
                        <Link
                          to={`/dashboard/${vacancy.id}/favourites`}
                          className="hover:underline"
                        >
                          Favourites
                        </Link>
                        <Badge count={favCount} />
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="pt-4">
          <img
            src={require("../../assets/logo.png")}
            alt="EASYRECRUIT Logo"
            style={{ width: "150px", height: "auto" }}
            className="mx-auto opacity-90"
          />
        </div>
      </div>
    </>
  );
};

export default VacancySidebar;
