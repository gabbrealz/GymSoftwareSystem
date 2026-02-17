import { useState, useEffect } from 'react'
import LoginForm from './Login.jsx'
import Dashboard from './Dashboard.jsx'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME)) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    let res, data;

    try {
      res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(e.target)
      });
      data = await res.json();

      if (res.ok && "token" in data) {
        setIsAuthenticated(true);
        localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME, data["token"]);
        localStorage.setItem(import.meta.env.VITE_AUTH_USER_VAR_NAME, data["employee"]);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  const handleLogout = async () => {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME) || null;
    if (token === null) return;

    let res, data;
    
    try {
      res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      data = await res.json();

      if (res.ok) {
        setIsAuthenticated(false);
        localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME);
      }
      else {
        console.log("Log out failed: ", data['message']);
      }
    }
    catch (error) {
      console.error(error);   
    }
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App