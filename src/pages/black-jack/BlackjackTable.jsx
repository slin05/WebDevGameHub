import React, { useState, useEffect } from 'react';
import Card from './Card';
import Dealer from './Dealer';
import Player from './Player';
import Controls from './Controls';

const initialDeck = () => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = [
        '2', '3', '4', '5', '6', '7', '8', '9', '10',
        'j', 'q', 'k', 'a'
    ];
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push(`${rank}_of_${suit}.png`);
        }
    }
    const shuffledDeck = deck.sort(() => Math.random() - 0.5);
    console.log("Created new deck with", shuffledDeck.length, "cards");
    return shuffledDeck;
};

const BlackjackTable = () => {
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [playerBalance, setPlayerBalance] = useState(500);
    const [gameOver, setGameOver] = useState(true);
    const [isDealerTurn, setIsDealerTurn] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (deck.length === 0) {
            setDeck(initialDeck());
        }
    }, [deck.length]);

    useEffect(() => {
        console.log("Current game state:", {
            deckSize: deck.length,
            playerHand,
            dealerHand,
            playerBalance,
            gameOver,
            isDealerTurn
        });
    }, [deck, playerHand, dealerHand, playerBalance, gameOver, isDealerTurn]);

    const dealInitialCards = () => {
        try {
            console.log("Starting new game...");
            const newDeck = initialDeck();
            
            if (newDeck.length < 4) {
                setError("Deck initialization failed");
                return;
            }
            
            const playerCards = [newDeck.pop(), newDeck.pop()];
            const dealerCards = [newDeck.pop(), newDeck.pop()];

            console.log("Initial hands:", { playerCards, dealerCards });

            setDeck(newDeck);
            setPlayerHand(playerCards);
            setDealerHand(dealerCards);
            setGameOver(false);
            setIsDealerTurn(false);
            setError(null);
        } catch (err) {
            console.error("Error dealing cards:", err);
            setError("Failed to deal cards: " + err.message);
        }
    };

    const hit = () => {
        if (gameOver || !deck.length) return;
        
        try {
            const newDeck = [...deck];
            const newCard = newDeck.pop();
            console.log("Player hits, gets:", newCard);
            
            if (!newCard) {
                setError("No more cards in deck");
                return;
            }
            
            const newHand = [...playerHand, newCard];
            const handValue = calculateHandValue(newHand);
            console.log("New player hand value:", handValue);
            
            setDeck(newDeck);
            setPlayerHand(newHand);
            
            if (handValue > 21) {
                console.log("Player busts!");
                setGameOver(true);
            }
        } catch (err) {
            console.error("Error in hit:", err);
            setError("Error hitting: " + err.message);
        }
    };

    const stay = () => {
        if (gameOver) return;
        
        console.log("Player stays. Dealer's turn.");
        setIsDealerTurn(true);
        
        setTimeout(dealerTurn, 0);
    };

    const dealerTurn = () => {
        try {
            let dealerValue = calculateHandValue(dealerHand);
            let currentDealerHand = [...dealerHand];
            let currentDeck = [...deck];

            console.log("Dealer initial hand value:", dealerValue);

            while (dealerValue < 17) {
                if (currentDeck.length === 0) {
                    console.log("No more cards in deck!");
                    break;
                }
                
                const newCard = currentDeck.pop();
                if (!newCard) break;
                
                currentDealerHand.push(newCard);
                dealerValue = calculateHandValue(currentDealerHand);
                console.log("Dealer draws:", newCard, "New value:", dealerValue);
            }

            console.log("Final dealer hand:", currentDealerHand, "Value:", dealerValue);

            setDealerHand(currentDealerHand);
            setDeck(currentDeck);
            setGameOver(true);
        } catch (err) {
            console.error("Error in dealer turn:", err);
            setError("Error in dealer turn: " + err.message);
        }
    };

    const calculateHandValue = (hand) => {
        let value = 0;
        let aces = 0;
        
        if (!hand || !hand.length) return 0;
        
        hand.forEach(card => {
            if (!card) return;
            
            const parts = card.split('_');
            if (!parts.length) return;
            
            const rank = parts[0];
            
            if (['j', 'q', 'k'].includes(rank)) {
                value += 10;
            } else if (rank === 'a') {
                aces += 1;
                value += 11;
            } else {
                value += parseInt(rank) || 0;
            }
        });
        
        while (value > 21 && aces > 0) {
            value -= 10;
            aces -= 1;
        }
        
        return value;
    };

    return (
        <div className="blackjack-table">
            {error && (
                <div style={{ color: 'red', padding: '10px', margin: '10px 0' }}>{error}</div>
            )}
            <Dealer hand={dealerHand} isDealerTurn={isDealerTurn} />
            <Player hand={playerHand} balance={playerBalance} />
            <Controls hit={hit} stay={stay} gameOver={gameOver} dealInitialCards={dealInitialCards} />
            <div style={{ marginTop: '20px' }}>
                <p>Player Hand Value: {calculateHandValue(playerHand)}</p>
                {isDealerTurn && <p>Dealer Hand Value: {calculateHandValue(dealerHand)}</p>}
            </div>
        </div>
    );
};

export default BlackjackTable;