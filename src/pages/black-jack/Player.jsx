import React from 'react';
import Card from './Card';

const Player = ({ hand, balance, playerName = "Player" }) => {
    return (
        <div className="player">
            <h2>{playerName}'s Hand</h2>
            <div className="hand" style={{ display: 'flex' }}>
                {hand.map((card, index) => (
                    <Card key={index} card={card} isFaceDown={false} />
                ))}
            </div>
            <h3>Balance: ${balance}</h3>
        </div>
    );
};

export default Player;