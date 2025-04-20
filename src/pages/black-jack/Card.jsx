import React from 'react';

const Card = ({ card, isFaceDown }) => {
    // Parse card info
    const parts = card.split('_of_');
    const rank = parts[0];
    const suit = parts[1]?.split('.')[0];
    
    // Convert rank to display format
    let displayRank;
    switch(rank) {
        case 'a': displayRank = 'A'; break;
        case 'k': displayRank = 'K'; break;
        case 'q': displayRank = 'Q'; break;
        case 'j': displayRank = 'J'; break;
        default: displayRank = rank;
    }
    
    // Get suit symbol
    const getSuitSymbol = () => {
        switch(suit) {
            case 'hearts': return '♥';
            case 'diamonds': return '♦';
            case 'clubs': return '♣';
            case 'spades': return '♠';
            default: return '';
        }
    };
    
    // Determine color based on suit
    const isRed = suit === 'hearts' || suit === 'diamonds';
    const color = isRed ? 'red' : 'black';
    
    // Card back (for face down)
    if (isFaceDown) {
        return (
            <div className="card" style={{ margin: '5px' }}>
                <div 
                    className="card-back" 
                    style={{
                        backgroundColor: '#b00',
                        backgroundImage: 'repeating-linear-gradient(45deg, #a00, #a00 5px, #b00 5px, #b00 10px)',
                        width: '100px',
                        height: '140px',
                        borderRadius: '8px',
                        border: '2px solid #000',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} 
                />
            </div>
        );
    }
    
    // Card front with Unicode symbols
    return (
        <div className="card" style={{ margin: '5px' }}>
            <div style={{
                width: '100px',
                height: '140px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '2px solid #000',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '8px',
                boxSizing: 'border-box',
                position: 'relative',
                color: color,
                fontFamily: 'Arial, sans-serif'
            }}>
                {/* Top left corner */}
                <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    textAlign: 'left',
                    lineHeight: 1
                }}>
                    {displayRank}
                    <div style={{ fontSize: '18px' }}>
                        {getSuitSymbol()}
                    </div>
                </div>
                
                {/* Center symbol */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: displayRank === '10' ? '32px' : '42px',
                    fontWeight: 'bold'
                }}>
                    {getSuitSymbol()}
                </div>
                
                {/* Bottom right corner (inverted) */}
                <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    textAlign: 'right',
                    alignSelf: 'flex-end',
                    transform: 'rotate(180deg)',
                    lineHeight: 1
                }}>
                    {displayRank}
                    <div style={{ fontSize: '18px' }}>
                        {getSuitSymbol()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;