import React from 'react';

const mockProfiles = [
  { id: 1, name: 'Name Surname' },
  { id: 2, name: 'Name Surname' },
  { id: 3, name: 'Name Surname' },
];

const ProfilesView = () => {
  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-6">Profiles</h1>
      <div className="space-y-4">
        {mockProfiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-[#1e1e2f] p-4 rounded flex items-center justify-between"
          >
            <span>{profile.name}</span>
            <div className="flex items-center space-x-4">
              <button className="bg-purple-800 hover:bg-purple-700 text-white px-3 py-1 rounded">
                Preview
              </button>
              <button className="text-yellow-400 text-xl">★</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilesView;
