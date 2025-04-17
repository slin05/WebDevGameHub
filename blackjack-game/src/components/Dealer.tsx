import React from 'react';
import Card from './Card';

interface DealerProps {
    dealerHand: Array<{ rank: string; suit: string }>;
    isDealerTurn: boolean;
}

const Dealer: React.FC<DealerProps> = ({ dealerHand, isDealerTurn }) => {
    return (
        <div className="dealer">
            <h2>Dealer's Hand</h2>
            <div className="hand">
                {dealerHand.map((card, index) => {
                    if (index === 0 && !isDealerTurn) {
                        return <div key={index} className="card back" style={{ backgroundColor: 'red', width: '100px', height: '140px' }} />;
                    }
                    return <Card key={index} rank={card.rank} suit={card.suit} />;
                })}
            </div>
        </div>
    );
};

export default Dealer;