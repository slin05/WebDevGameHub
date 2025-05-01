import React, { useState } from 'react';
import { useUser } from '../UserContext';
import './UsernamePrompt.css';

const UsernamePrompt = () => {
  const { isPromptOpen, saveUsername } = useUser();
  const [inputName, setInputName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (inputName.trim().length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    
    saveUsername(inputName);
    setInputName('');
    setError('');
  };

  if (!isPromptOpen) {
    return null;
  }

  return (
    <div className="username-prompt-overlay">
      <div className="username-prompt-container">
        <h2>Welcome to ByteMe!</h2>
        <p>Please enter a username to use for all games:</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter your username"
            maxLength={15}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={!inputName.trim()}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernamePrompt;