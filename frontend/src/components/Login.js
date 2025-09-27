import React, { useState } from "react";
import API from "../utils/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const path = isRegister ? "/auth/register" : "/auth/login";
      const res = await API.post(path, { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      onLogin({ username: res.data.username });
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="w-96 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {isRegister ? "Create Account" : "Login"}
      </h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="mt-4 text-blue-600 hover:underline block mx-auto"
      >
        {isRegister ? "Switch to Login" : "Create an Account"}
      </button>
      {error && <div className="mt-2 text-red-500 text-center">{error}</div>}
    </div>
  );
}
