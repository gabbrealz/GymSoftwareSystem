import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="bg-full full-screen flex justify-center items-center fixed top-0 left-0">
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col items-center w-[350px] gap-[15px] p-10"
      >
        <div className="text-center mb-[10px]">
          <img 
            src="/SertfitLogo.png" 
            alt="SertfitLogo" 
            className="w-[250px] h-auto" 
          />
        </div>
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 text-base rounded-[20px] border border-[#ccc] bg-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 text-base rounded-[20px] border border-[#ccc] bg-white"
          required
        />
        <button 
          type="submit" 
          className="w-1/2 p-[15px] bg-[rgb(119,14,0)] text-white border-none cursor-pointer rounded-[20px] text-base font-bold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;