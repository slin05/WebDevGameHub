import { useState, useEffect } from 'react';

const useUsername = () => {
  const [username, setUsername] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('byteme_username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setShowPrompt(true);
    }
  }, []);

  const saveUsername = (name) => {
    if (name && name.trim() !== '') {
      const trimmedName = name.trim();
      localStorage.setItem('byteme_username', trimmedName);
      setUsername(trimmedName);
      setShowPrompt(false);
    }
  };

  return { username, showPrompt, saveUsername };
};

export default useUsername;