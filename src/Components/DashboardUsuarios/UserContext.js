import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]); 

  return (
    <UserContext.Provider value={{ userData, setUserData, notifications, setNotifications }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
