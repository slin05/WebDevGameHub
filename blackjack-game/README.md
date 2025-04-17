# Blackjack Game

## Overview
This is a simple Blackjack game built with React. The game follows standard Blackjack rules where the player competes against the dealer. The player starts with a balance of $500 and can choose to hit or stay during their turn.

## Features
- User vs House gameplay
- Hit or Stay buttons for player interaction
- Dealer's first card is hidden and displayed as a red rectangle
- Visual representation of used cards from the deck
- Player can go for broke with their balance

## Project Structure
```
blackjack-game
├── public
│   ├── index.html
│   └── 52-cards
│       └── [card images like 3_of_hearts.png]
├── src
│   ├── components
│   │   ├── BlackjackTable.tsx
│   │   ├── Card.tsx
│   │   ├── Dealer.tsx
│   │   ├── Player.tsx
│   │   └── Controls.tsx
│   ├── App.tsx
│   ├── index.tsx
│   └── styles
│       └── App.css
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd blackjack-game
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Game
To start the game, run:
```
npm start
```
This will launch the application in your default web browser.

### Game Rules
- The player and dealer are each dealt two cards.
- The player can choose to "Hit" (take another card) or "Stay" (end their turn).
- The goal is to get as close to 21 without going over.
- The dealer reveals their hidden card after the player stands.

## Contributing
Feel free to submit issues or pull requests for improvements or bug fixes.

## License
This project is open-source and available under the MIT License.