import React from 'react';

interface CardProps {
    image: string;
    isFaceDown: boolean;
}

const Card: React.FC<CardProps> = ({ image, isFaceDown }) => {
    return (
        <div className="card">
            {isFaceDown ? (
                <div className="card-back" style={{ backgroundColor: 'red', width: '70px', height: '100px' }} />
            ) : (
                <img src={image} alt="Playing card" />
            )}
        </div>
    );
};

export default Card;