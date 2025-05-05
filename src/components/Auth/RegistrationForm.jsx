import React, { useState } from 'react';
import logo from '../../assets/logo.png';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    organization: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.organization) newErrors.organization = 'Organization name is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      alert('Registration successful!');
      // Te nākotnē būs fetch() uz backend
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-white pt-16">
      <img src={logo} alt="EasyRecruit Logo" className="w-[200px] mb-6" />
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-80">
        <form onSubmit={handleSubmit}>
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-1 p-2 rounded bg-gray-800 text-white"
          />
          {errors.email && <p className="text-red-400 text-sm mb-2">{errors.email}</p>}

          <label className="block mb-1 text-sm">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full mb-1 p-2 rounded bg-gray-800 text-white"
          />
          {errors.username && <p className="text-red-400 text-sm mb-2">{errors.username}</p>}

          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-1 p-2 rounded bg-gray-800 text-white"
          />
          {errors.password && <p className="text-red-400 text-sm mb-2">{errors.password}</p>}

          <label className="block mb-1 text-sm">Organization name</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
          />
          {errors.organization && <p className="text-red-400 text-sm mb-2">{errors.organization}</p>}

          <button
            type="submit"
            className="w-full bg-purple-800 hover:bg-purple-700 p-2 rounded text-white mt-4"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
