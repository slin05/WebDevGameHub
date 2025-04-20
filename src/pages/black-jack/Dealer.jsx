import React from 'react';
import Card from './Card';

const Dealer = ({ hand, isDealerTurn }) => {
    return (
        <div className="dealer">
            <h2>Dealer's Hand</h2>
            <div className="hand">
                {hand.map((card, index) => (
                    <Card
                        key={index}
                        card={card}
                        isFaceDown={index === 1 && !isDealerTurn}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dealer;