import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useVacancy } from "../../context/VacancyContext";
import { Plus } from "lucide-react";
import hamburgerIcon from "../../assets/hamburger.png";

const VacancySidebar = ({
  closeSidebar,
  onShowCreateModal,
  onConfirmDelete,
}) => {
  const location = useLocation();
  const { vacancies } = useVacancy();
  const [openSections, setOpenSections] = useState({});

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

  return (
    <div className="w-64 bg-[#1e1e2f] text-white p-4 flex flex-col h-full">
      {/* Augša: ikonas */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={closeSidebar} title="Close sidebar">
          <img src={hamburgerIcon} alt="Close Sidebar" className="w-6 h-6" />
        </button>
        <button onClick={onShowCreateModal} title="Add vacancy">
          <Plus className="text-white hover:text-purple-400 w-5 h-6" />
        </button>
      </div>

      {/* Vakances ritināmais bloks */}
      <div className="flex-1 overflow-y-auto pr-3 scrollbar-custom">
        {vacancies
          .slice()
          .reverse()
          .map((vacancy) => {
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
                    onClick={() => onConfirmDelete(vacancy.id)}
                    className="text-gray-400 hover:text-red-500 text-sm ml-2"
                    title="Delete vacancy"
                  >
                    ✕
                  </button>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="pl-4 space-y-1 pt-1">
                    <li>
                      <Link
                        to="/dashboard/cv-documents"
                        className="hover:underline"
                      >
                        CV documents
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/profiles"
                        className="hover:underline"
                      >
                        Profiles
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/favourites"
                        className="hover:underline"
                      >
                        Favourites
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
      </div>

      {/* Logo apakšā */}
      <div className="pt-4">
        <img
          src={require("../../assets/logo.png")}
          alt="EASYRECRUIT Logo"
          style={{ width: "150px", height: "auto" }}
          className="mx-auto opacity-90"
        />
      </div>
    </div>
  );
};

export default VacancySidebar;
