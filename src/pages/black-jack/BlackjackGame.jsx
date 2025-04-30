import React from 'react';
import BlackjackTable from './BlackjackTable';
import '../../black-jack/styles/Blackjack.css';

const App = () => {
    return (
        <div className="App">
            <h1>Blackjack Game</h1>
            <BlackjackTable />
        </div>
    );
};

export default App; 