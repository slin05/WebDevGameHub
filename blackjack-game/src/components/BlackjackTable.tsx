import React, { useState } from 'react';
import Card from './Card';
import Dealer from './Dealer';
import Player from './Player';
import Controls from './Controls';

const initialDeck = () => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = [
        '2', '3', '4', '5', '6', '7', '8', '9', '10', 
        'jack', 'queen', 'king', 'ace'
    ];
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push(`${rank}_of_${suit}.png`);
        }
    }
    return deck.sort(() => Math.random() - 0.5);
};

const BlackjackTable = () => {
    const [deck, setDeck] = useState(initialDeck());
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [playerBalance, setPlayerBalance] = useState(500);
    const [gameOver, setGameOver] = useState(false);
    const [isDealerTurn, setIsDealerTurn] = useState(false);

    const dealInitialCards = () => {
        const playerCards = [deck.pop(), deck.pop()];
        const dealerCards = [deck.pop(), deck.pop()];
        setPlayerHand(playerCards);
        setDealerHand(dealerCards);
    };

    const hit = () => {
        if (!gameOver) {
            const newCard = deck.pop();
            setPlayerHand((prev) => [...prev, newCard]);
            if (calculateHandValue([...playerHand, newCard]) > 21) {
                setGameOver(true);
            }
        }
    };

    const stay = () => {
        setIsDealerTurn(true);
        dealerTurn();
    };

    const dealerTurn = () => {
        let dealerValue = calculateHandValue(dealerHand);
        while (dealerValue < 17) {
            const newCard = deck.pop();
            setDealerHand((prev) => [...prev, newCard]);
            dealerValue = calculateHandValue([...dealerHand, newCard]);
        }
        setGameOver(true);
    };

    const calculateHandValue = (hand) => {
        let value = 0;
        let aces = 0;
        hand.forEach(card => {
            const rank = card.split('_')[0];
            if (['jack', 'queen', 'king'].includes(rank)) {
                value += 10;
            } else if (rank === 'ace') {
                aces += 1;
                value += 11;
            } else {
                value += parseInt(rank);
            }
        });
        while (value > 21 && aces) {
            value -= 10;
            aces -= 1;
        }
        return value;
    };

    return (
        <div className="blackjack-table">
            <Dealer hand={dealerHand} isDealerTurn={isDealerTurn} />
            <Player hand={playerHand} balance={playerBalance} />
            <Controls hit={hit} stay={stay} gameOver={gameOver} dealInitialCards={dealInitialCards} />
        </div>
    );
};

export default BlackjackTable;