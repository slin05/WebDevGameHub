import React from 'react';

interface ControlsProps {
    onHit: () => void;
    onStay: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onHit, onStay }) => {
    return (
        <div className="controls">
            <button onClick={onHit}>Hit</button>
            <button onClick={onStay}>Stay</button>
        </div>
    );
};

export default Controls;