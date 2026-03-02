import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    setLoading(false);
  }, []);



const login = async (email, password) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/login",
      { email, password }
    );

    const { token, user } = res.data;

    const authData = {
      token,
      id: user.id,
      name: user.name,
      role: user.role
    };

    localStorage.setItem("user", JSON.stringify(authData));
    setUser(authData);

    toast.success("Login Successful 🎉");

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Invalid Email or Password ❌"
    );
  }
};
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};