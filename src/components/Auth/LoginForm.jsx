import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const LoginForm = () => {
  const navigate = useNavigate(); // <-- Navigācijas funkcija

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-white pt-[190px]">
      <img src={logo} alt="EasyRecruit Logo" className="w-[270px] mb-8" />
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-80">
        <label className="block mb-2 text-sm">username</label>
        <input type="text" className="w-full mb-4 p-2 rounded bg-gray-800 text-white" />

        <label className="block mb-2 text-sm">password</label>
        <input type="password" className="w-full mb-4 p-2 rounded bg-gray-800 text-white" />

        <button className="w-full bg-purple-800 hover:bg-purple-700 p-2 rounded text-white mb-4">Login</button>

        <div className="text-sm flex flex-col items-start mt-4">
          <button className="text-purple-400 hover:underline block">Forgot a password?</button>

          {/* Register poga ar maršrutēšanu */}
          <button
            onClick={() => navigate('/register')}
            className="text-purple-400 hover:underline mt-2"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

