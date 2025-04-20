import React from 'react';

const Controls = ({ hit, stay, gameOver, dealInitialCards }) => {
    return (
        <div className="controls">
            {gameOver ? (
                <button onClick={dealInitialCards}>New Game</button>
            ) : (
                <>
                    <button onClick={hit}>Hit</button>
                    <button onClick={stay}>Stay</button>
                </>
            )}
        </div>
    );
};

export default Controls;