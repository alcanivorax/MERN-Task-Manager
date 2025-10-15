import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false); // Track if initial load is done

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        const userData = { ...response.data, token: accessToken };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setLoading(false);
    setIsInitialized(true); // Mark as initialized when manually updating
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Also clear user from localStorage
  };

  return (
    <UserContext.Provider
      value={{ user, loading, isInitialized, updateUser, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
