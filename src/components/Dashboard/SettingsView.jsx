import React, { useRef, useState } from 'react';
import defaultProfilePicture from '../../assets/blank-profile-picture.png';
import uploadIcon from '../../assets/upload.png';

const SettingsView = () => {
  const profileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [confirmPassChange, setConfirmPassChange] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [profileData, setProfileData] = useState({
    picture: defaultProfilePicture,
    email: 'johndoe@example.com',
    username: 'John Doe',
    password: '<password>',
    organization: 'Example Inc.',
  });

  const validate = () => {
    const newErrors = {};

    if (!profileData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(profileData.email)) newErrors.email = 'Invalid email format';

    if (!profileData.username) newErrors.username = 'Username is required';
    if (!profileData.organization) newErrors.organization = 'Organization name is required';

    return newErrors;
  };

  const handleProfilePicture = (event) => {
    if (event.target.files < 0) return;

    const file = event.target.files[0];
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/bmp"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only PNG, JPEG, and BMP are allowed.");
      return;
    }

    setProfileData(profileData => ({
      ...profileData,
      picture: URL.createObjectURL(file)
    }));
    event.target.value = null;
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (e) => {
    setEmailChanged(true);
    handleChange(e);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      alert('Profile saved successfully!');

      if (emailChanged) {
        alert('Email change verification sent!');
        setEmailChanged(false);
      }

      // Te nākotnē būs fetch() uz backend
    }
  };

  const handleChangePassword = (e) => {
    setConfirmPassChange(false);
    alert('Password change email sent!');
    // Te nākotnē būs fetch() uz backend
  }

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Profila Uzstādījumi
      </h1>

      <div className="flex">
        <form onSubmit={handleSubmit} className="flex-1 flex-col space-y-4 m-4">

          <label className="inline-block mb-1 text-sm">Username</label>
          {errors.username && <label className="text-red-400 text-sm ml-2">{errors.username}</label>}
          <input
            type="text"
            name="username"
            value={profileData.username}
            onChange={handleChange}
            className="w-full mb-1 p-2 rounded bg-gray-800 text-white"
          />

          <label className="inline-block mb-1 text-sm">Organization name</label>
          {errors.organization && <label className="text-red-400 text-sm ml-2">{errors.organization}</label>}
          <input
            type="text"
            name="organization"
            value={profileData.organization}
            onChange={handleChange}
            className="w-full mb-1 p-2 rounded bg-gray-800 text-white"
          />

          <label className="inline-block mb-1 text-sm">Email</label>
          {errors.email && <label className="text-red-400 text-sm ml-2">{errors.email}</label>}
          <div>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleEmailChange}
              className="w-full mb-1 p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <div className="space-x-2">
            <button type="submit" className="bg-purple-800 hover:bg-purple-700 p-2 rounded text-white">Saglabāt</button>
            <button type="button"
              onClick={() => alert("TODO: change email")}
              className="bg-gray-600 hover:bg-gray-500 p-2 rounded text-white">Mainīt e-pastu</button>
            <button type="button"
              onClick={() => setConfirmPassChange(true)}
              className="bg-gray-600 hover:bg-gray-500 p-2 rounded text-white">Mainīt paroli</button>
          </div>
        </form>

        <div className='m-4'>
          <label className="block mb-1 text-sm text-center">Profila bilde</label>
          <input type="file" accept=".jpg,.jpeg,.png,.bmp" onChange={handleProfilePicture} ref={profileInputRef} hidden/>
          <div className="group min-w-[270px] w-[270px] cursor-pointer" onClick={() => profileInputRef.current?.click()}>
            <img
                src={uploadIcon}
                alt="Upload icon"
                className="absolute z-10 m-0 w-[270px] opacity-0 brightness-200 group-hover:opacity-75"
            />
            <img
                src={profileData.picture}
                alt="Profile picture"
                className="mt-5 rounded-xl w-full group-hover:brightness-50"
            />
          </div>
        </div>
      </div>

      {confirmPassChange && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1e1e2f] p-6 rounded-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Vai tiešām vēlaties mainīt paroli?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setConfirmPassChange(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white">
                Nē
              </button>
              <button onClick={handleChangePassword}
                className="px-4 py-2 rounded bg-purple-700 hover:bg-purple-600 text-white">
                Jā
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
