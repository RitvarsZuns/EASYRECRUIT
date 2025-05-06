import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVacancy } from "../context/VacancyContext";

const CreateVacancyPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [vacancyName, setVacancyName] = useState("");
  const navigate = useNavigate();
  const { addVacancy } = useVacancy();

  const handleCreate = () => {
    if (vacancyName.trim() !== "") {
      addVacancy(vacancyName.trim());
      navigate("/dashboard/cv-documents");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <button
        onClick={() => setShowModal(true)}
        className="bg-purple-700 hover:bg-purple-600 text-white text-xl font-semibold px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform"
      >
        Create vacancy
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1e1e2f] p-6 rounded-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Enter vacancy name</h2>
            <input
              type="text"
              value={vacancyName}
              onChange={(e) => setVacancyName(e.target.value)}
              placeholder="Vacancy name"
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded bg-purple-700 hover:bg-purple-600 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateVacancyPage;
