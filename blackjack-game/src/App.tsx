import React from 'react';
import BlackjackTable from './components/BlackjackTable';
import './styles/App.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Blackjack Game</h1>
            <BlackjackTable />
        </div>
    );
};

export default App;