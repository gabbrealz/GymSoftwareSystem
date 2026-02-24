import { useState, useEffect, useContext } from 'react'
import LoginForm from './Login.jsx'
import Dashboard from './Dashboard.jsx'
import './App.css'  
import { AuthContext, NotifContext } from './Context.jsx';
import Notifications from './components/Notifications.jsx'

function App() {
  const { addToNotifs } = useContext(NotifContext);
  const { isAuthenticated, setIsAuthenticated, getAuthToken } = useContext(AuthContext);

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
        localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME, data.token);
        localStorage.setItem(import.meta.env.VITE_AUTH_USER_VAR_NAME, JSON.stringify(data.employee));

        addToNotifs({
          message: "Login successful!",
          bgcolor: "bg-green-600"
        });

      } else {
        addToNotifs({
          message: data.message || "Invalid email or password.",
          bgcolor: "bg-red-600"
        });
      }

    } catch (error) {
      console.error(error);

      addToNotifs({
        message: "Server error. Please try again later.",
        bgcolor: "bg-red-600"
      });
    }
  };

  const handleLogout = async () => {
    const token = getAuthToken();
    if (token === null) {
      setIsAuthenticated(false);
      return;
    }

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
      
      addToNotifs({
        message: "Server error. Please try again later.",
        bgcolor: "bg-red-600"
      });
    }
  }

  return (
    <div className="App">
      <Notifications />
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App