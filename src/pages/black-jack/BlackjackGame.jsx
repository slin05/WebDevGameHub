import React from 'react';
import BlackjackTable from './BlackjackTable';
import { useUser } from '../../UserContext';
import './BlackJack.css';

const BlackjackGame = () => {
    const { username } = useUser();
    
    return (
        <div className="App">
            <h1>Blackjack Game</h1>
            <div className="welcome-message">
                Welcome, {username}! Ready to test your luck?
            </div>
            <BlackjackTable playerName={username} />
        </div>
    );
};

export default BlackjackGame;