import React from 'react';
import BlackjackTable from './BlackjackTable';
import '/src/pages/black-jack/Blackjack.css';

const App = () => {
    return (
        <div className="App">
            <h1>Blackjack Game</h1>
            <BlackjackTable />
        </div>
    );
};

export default App; 