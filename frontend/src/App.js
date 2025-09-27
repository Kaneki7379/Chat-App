import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) setUser({ username });
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {!user ? (
        <Login onLogin={(u) => setUser(u)} />
      ) : (
        <Chat user={user} onLogout={logout} />
      )}
    </div>
  );
}
