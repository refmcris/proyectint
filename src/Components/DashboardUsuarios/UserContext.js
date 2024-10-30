import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]); 

  const resetUserData = () => {
    setUserData(null);
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, notifications, setNotifications, resetUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
