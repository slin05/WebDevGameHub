import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('byteme_username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setIsPromptOpen(true);
    }
  }, []);

  const saveUsername = (name) => {
    if (name && name.trim() !== '') {
      const trimmedName = name.trim();
      localStorage.setItem('byteme_username', trimmedName);
      setUsername(trimmedName);
      setIsPromptOpen(false);
    }
  };

  const value = {
    username,
    setUsername,
    isPromptOpen,
    setIsPromptOpen,
    saveUsername
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;