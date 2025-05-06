import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useFavorites } from '../../context/FavoritesContext';

const type = 'PROFILE';

const mockProfiles = [
  { id: 1, name: 'Peteris Sirmais' },
  { id: 2, name: 'Janis Jaunais' },
  { id: 3, name: 'Hanna Vanna' },
];

const DraggableProfile = ({ profile, index, moveProfile }) => {
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
      </div>
      <div className="flex items-center space-x-4">
        <button className="bg-purple-800 hover:bg-purple-700 text-white px-3 py-1 rounded">
          Preview
        </button>
        <button
          onClick={() => toggleFavorite(profile)}
          className={`text-xl transition-colors ${
            isFavorite(profile.id) ? 'text-yellow-400' : 'text-white opacity-30'
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
  const [profiles, setProfiles] = useState(mockProfiles);

  const moveProfile = (from, to) => {
    const updated = [...profiles];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setProfiles(updated);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="text-white">
        <h1 className="text-2xl font-bold mb-6">Profiles</h1>
        <div className="space-y-4">
          {profiles.map((profile, index) => (
            <DraggableProfile
              key={profile.id}
              profile={profile}
              index={index}
              moveProfile={moveProfile}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default ProfilesView;
