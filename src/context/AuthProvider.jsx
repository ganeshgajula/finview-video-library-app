import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

const setupAuthHeaderForServiceCalls = (token) => {
  console.log("header called");
  if (token) {
    return (axios.defaults.headers.common["Authorization"] = `Bearer ${token}`);
  }
  delete axios.defaults.headers.common["Authorization"];
};

const setupAuthExceptionHandler = (logoutUser, navigate) => {
  const UNAUTHORIZED = 401;
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === UNAUTHORIZED) {
        logoutUser();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
};

export const AuthProvider = ({ children }) => {
  const {
    token: savedToken,
    userId: savedUserId,
    username: savedUsername,
  } = JSON.parse(localStorage.getItem("userInfo")) || {
    userId: null,
    username: null,
    token: null,
  };
  const navigate = useNavigate();

  const [token, setToken] = useState(savedToken);
  const [username, setUsername] = useState(savedUsername);
  const [userId, setUserId] = useState(savedUserId);

  useEffect(
    () => {
      setupAuthExceptionHandler(logoutUser, navigate);
    },
    // eslint-disable-next-line
    []
  );

  const loginUser = (token) => {
    setToken(token);
    setupAuthHeaderForServiceCalls(token);
  };

  const logoutUser = () => {
    setUserId(null);
    setUsername(null);
    loginUser(null);
    localStorage?.removeItem("userInfo");
  };

  setupAuthHeaderForServiceCalls(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        userId,
        setToken,
        setUsername,
        setUserId,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
