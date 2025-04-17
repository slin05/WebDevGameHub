import React from 'react';

interface PlayerProps {
    hand: string[];
    balance: number;
}

const Player: React.FC<PlayerProps> = ({ hand, balance }) => {
    return (
        <div className="player">
            <h2>Player's Hand</h2>
            <div className="hand">
                {hand.map((card, index) => (
                    <img key={index} src={`./52-cards/${card}.png`} alt={card} />
                ))}
            </div>
            <h3>Balance: ${balance}</h3>
        </div>
    );
};

export default Player;