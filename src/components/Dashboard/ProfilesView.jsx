import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import { useVacancy } from "../../context/VacancyContext";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const type = "PROFILE";

const DraggableProfile = ({ profile, index, moveProfile, vacancyId, onPreview }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [, ref] = useDrag({ type, item: { index } });
  const [, drop] = useDrop({
    accept: type,
    hover: (item) => {
      if (item.index !== index) {
        moveProfile(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className="bg-[#1e1e2f] p-4 rounded flex items-center justify-between cursor-move"
    >
      <div className="flex items-center space-x-4">
        <span className="text-gray-400 w-4">{index + 1}.</span>
        <span>{profile.name}</span>
        <span className="text-xs text-gray-400 ml-2">(Rank: {profile.ranking})</span>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onPreview(profile)}
          className="bg-purple-800 hover:bg-purple-700 text-white px-3 py-1 rounded"
        >
          Preview
        </button>
        <button
          onClick={() => toggleFavorite(vacancyId, profile)}
          className={`text-xl transition-colors ${
            isFavorite(vacancyId, profile.id)
              ? "text-yellow-400"
              : "text-white opacity-30"
          }`}
          title="Toggle favorite"
        >
          ★
        </button>
      </div>
    </div>
  );
};

const ProfilesView = () => {
  const { vacancyId } = useParams();
  const { vacancies, getProfilesForVacancy } = useVacancy();
  const vacancy = vacancies.find((v) => v.id === vacancyId);
  const vacancyTitle = vacancy?.title || vacancyId;

  const initialProfiles = [...getProfilesForVacancy(vacancyId)].sort(
    (a, b) => a.ranking - b.ranking
  );

  const [profiles, setProfiles] = useState(initialProfiles);
  const [previewProfile, setPreviewProfile] = useState(null);

  const moveProfile = (from, to) => {
    const updated = [...profiles];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setProfiles(updated);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {vacancyTitle} - Profiles
        </h1>
        {profiles.length === 0 ? (
          <p className="text-center text-gray-500">No profiles generated yet.</p>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile, index) => (
              <DraggableProfile
                key={profile.id}
                profile={profile}
                index={index}
                moveProfile={moveProfile}
                vacancyId={vacancyId}
                onPreview={setPreviewProfile}
              />
            ))}
          </div>
        )}
      </div>

      {previewProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-[#1e1e2f] p-6 rounded-lg w-[90%] max-w-xl text-white relative">
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={() => setPreviewProfile(null)}
            >
              ✕
            </button>
            <div className="text-center mb-4">
              <div className="w-20 h-20 rounded-full bg-purple-300 text-purple-800 mx-auto flex items-center justify-center text-3xl font-bold">
                👤
              </div>
              <p className="mt-2 font-medium">{previewProfile.name}</p>
              <p className="text-sm text-gray-400">
                {previewProfile.email} | {previewProfile.phone_number}
              </p>
              <p className="text-sm text-gray-400">{previewProfile.location}</p>
            </div>
            <div className="text-sm text-white">
              <h3 className="font-semibold underline text-lg mb-1">
                Stands out with:
              </h3>
              <p className="mb-3">{previewProfile.stands_out_with}</p>

              <h3 className="font-semibold text-lg mb-1">About me</h3>
              <p className="mb-3">{previewProfile.about_me}</p>

              <h3 className="font-semibold text-lg mb-1">Experience</h3>
              <p className="mb-3 whitespace-pre-wrap">{previewProfile.experience}</p>

              <h3 className="font-semibold underline text-lg mb-1">Education:</h3>
              <p className="whitespace-pre-wrap">{previewProfile.education}</p>
            </div>
          </div>
        </div>
      )}
    </DndProvider>
  );
};

export default ProfilesView;
