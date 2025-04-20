export class LocalStorageMultiplayerRPS {
    constructor(roomCode, playerName) {
      this.roomCode = roomCode;
      this.playerName = playerName;
      this.storageKey = `rps-game-${roomCode}`;
      this.pollInterval = null;
      this.onStateChanged = null;
      
      // Initialize or join the game
      const existingGameJSON = localStorage.getItem(this.storageKey);
      if (existingGameJSON) {
        // Game exists, join it
        this.joinExistingGame(JSON.parse(existingGameJSON));
      } else {
        // Create new game
        this.createNewGame();
      }
      
      // Set up polling to check for changes
      this.startPolling();
      
      // Listen for storage events from other tabs
      window.addEventListener('storage', this.handleStorageChange.bind(this));
    }
    
    createNewGame() {
      const gameState = {
        players: [this.playerName],
        scores: { [this.playerName]: 0 },
        selections: {},
        gameHistory: [],
        lastUpdated: Date.now()
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(gameState));
    }
    
    joinExistingGame(gameState) {
      // Add this player if not already in the game
      if (!gameState.players.includes(this.playerName)) {
        gameState.players.push(this.playerName);
        gameState.scores[this.playerName] = 0;
        gameState.lastUpdated = Date.now();
        
        localStorage.setItem(this.storageKey, JSON.stringify(gameState));
      }
    }
    
    getGameState() {
      const gameStateJSON = localStorage.getItem(this.storageKey);
      return gameStateJSON ? JSON.parse(gameStateJSON) : null;
    }
    
    updateGameState(updater) {
      const gameState = this.getGameState();
      if (!gameState) return;
      
      // Apply updates
      updater(gameState);
      
      // Mark as updated
      gameState.lastUpdated = Date.now();
      
      // Save back to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(gameState));
    }
    
    makeSelection(selection) {
      this.updateGameState(gameState => {
        // Record this player's selection
        gameState.selections[this.playerName] = selection;
        
        // Check if all players have made selections
        const allPlayersSelected = gameState.players.every(player => 
          gameState.selections[player] !== undefined
        );
        
        if (allPlayersSelected && gameState.players.length > 1) {
          this.determineRoundWinner(gameState);
          
          // Reset selections for next round
          gameState.selections = {};
        }
      });
      
      return this.checkRoundComplete();
    }
    
    checkRoundComplete() {
      const gameState = this.getGameState();
      if (!gameState) return false;
      
      // Check if all players have made selections
      const allPlayersSelected = gameState.players.every(player => 
        gameState.selections[player] !== undefined
      );
      
      return allPlayersSelected && gameState.players.length > 1;
    }
    
    determineRoundWinner(gameState) {
      const { players, selections, scores } = gameState;
      
      // For 2 players
      if (players.length === 2) {
        const p1 = players[0];
        const p2 = players[1];
        const p1Selection = selections[p1];
        const p2Selection = selections[p2];
        
        let result = '';
        
        if (p1Selection === p2Selection) {
          result = `Tie! Both players selected ${p1Selection}`;
        } else if (
          (p1Selection === 'rock' && p2Selection === 'scissors') ||
          (p1Selection === 'paper' && p2Selection === 'rock') ||
          (p1Selection === 'scissors' && p2Selection === 'paper')
        ) {
          scores[p1]++;
          result = `${p1} selected ${p1Selection}, ${p2} selected ${p2Selection}: ${p1} wins!`;
        } else {
          scores[p2]++;
          result = `${p1} selected ${p1Selection}, ${p2} selected ${p2Selection}: ${p2} wins!`;
        }
        
        gameState.gameHistory.push(result);
      } else if (players.length > 2) {
        // For 3+ players - implement multi-player logic
        // Similar to previous implementation
        
        // Simple implementation for multi-player
        let resultLog = 'Round results: ';
        players.forEach(player => {
          resultLog += `${player} chose ${selections[player]}, `;
        });
        
        gameState.gameHistory.push(resultLog);
      }
    }
    
    startPolling() {
      // Check for updates every 1 second
      this.pollInterval = setInterval(() => {
        const gameState = this.getGameState();
        
        if (gameState && this.onStateChanged) {
          this.onStateChanged(gameState);
        }
      }, 1000);
    }
    
    handleStorageChange(event) {
      // Check if the change is for our game
      if (event.key === this.storageKey && this.onStateChanged) {
        const gameState = JSON.parse(event.newValue);
        this.onStateChanged(gameState);
      }
    }
    
    leaveGame() {
      // Remove player from the game
      this.updateGameState(gameState => {
        gameState.players = gameState.players.filter(p => p !== this.playerName);
        delete gameState.scores[this.playerName];
        delete gameState.selections[this.playerName];
        
        // Add a history entry
        gameState.gameHistory.push(`${this.playerName} left the game`);
        
        // If no players left, remove the game entirely
        if (gameState.players.length === 0) {
          localStorage.removeItem(this.storageKey);
        }
      });
      
      // Stop polling
      clearInterval(this.pollInterval);
      
      // Remove event listener
      window.removeEventListener('storage', this.handleStorageChange);
    }
  }