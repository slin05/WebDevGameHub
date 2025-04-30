export class ApiMultiplayerRPS {
    constructor(roomCode, playerName) {
      this.roomCode = roomCode;
      this.playerName = playerName;
      this.apiBaseUrl = 'https://game-room-api.fly.dev/api';
      this.pollInterval = null;
      this.onStateChanged = null;
      
      if (roomCode) {
        this.joinExistingRoom();
      } else {
        this.createNewRoom();
      }
      
      this.startPolling();
    }
    
    async createNewRoom() {
      try {
        const initialState = {
          players: [this.playerName],
          scores: { [this.playerName]: 0 },
          selections: {},
          gameHistory: [],
          lastUpdated: Date.now()
        };
        
        const response = await fetch(`${this.apiBaseUrl}/rooms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ initialState })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create room: ${response.status}`);
        }
        
        const data = await response.json();
        this.roomCode = data.roomId;
        
        return data.gameState;
      } catch (error) {
        console.error('Error creating room:', error);
        throw error;
      }
    }
    
    async joinExistingRoom() {
      try {
        const gameState = await this.getGameState();
        
        if (!gameState.players.includes(this.playerName)) {
          gameState.players.push(this.playerName);
          gameState.scores[this.playerName] = 0;
          gameState.lastUpdated = Date.now();
          
          await this.updateRemoteGameState(gameState);
        }
        
        return gameState;
      } catch (error) {
        console.error('Error joining room:', error);
        throw error;
      }
    }
    
    async getGameState() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/rooms/${this.roomCode}`);
        
        if (!response.ok) {
          throw new Error(`Failed to get room: ${response.status}`);
        }
        
        const data = await response.json();
        return data.gameState;
      } catch (error) {
        console.error('Error getting game state:', error);
        throw error;
      }
    }
    
    async updateRemoteGameState(gameState) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/rooms/${this.roomCode}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ gameState })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update room: ${response.status}`);
        }
        
        const data = await response.json();
        return data.gameState;
      } catch (error) {
        console.error('Error updating game state:', error);
        throw error;
      }
    }
    
    async makeSelection(selection) {
      try {
        let gameState = await this.getGameState();
        
        gameState.selections[this.playerName] = selection;
        
        const allPlayersSelected = gameState.players.every(player => 
          gameState.selections[player] !== undefined
        );
        
        if (allPlayersSelected && gameState.players.length > 1) {
          this.determineRoundWinner(gameState);
          
          gameState.selections = {};
        }
        
        await this.updateRemoteGameState(gameState);
        
        return allPlayersSelected && gameState.players.length > 1;
      } catch (error) {
        console.error('Error making selection:', error);
        throw error;
      }
    }
    
    determineRoundWinner(gameState) {
      const { players, selections, scores } = gameState;
      
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
        let resultLog = 'Round results: ';
        players.forEach(player => {
          resultLog += `${player} chose ${selections[player]}, `;
        });
        
        gameState.gameHistory.push(resultLog);
      }
    }
    
    startPolling() {
      this.pollInterval = setInterval(async () => {
        try {
          const gameState = await this.getGameState();
          
          if (gameState && this.onStateChanged) {
            this.onStateChanged(gameState);
          }
        } catch (error) {
          console.error('Error in poll:', error);
        }
      }, 1500); 
    }
    
    async leaveGame() {
      try {
        const gameState = await this.getGameState();
        
        gameState.players = gameState.players.filter(p => p !== this.playerName);
        delete gameState.scores[this.playerName];
        delete gameState.selections[this.playerName];
        
        gameState.gameHistory.push(`${this.playerName} left the game`);
        await this.updateRemoteGameState(gameState);
        
        clearInterval(this.pollInterval);
      } catch (error) {
        console.error('Error leaving game:', error);
      }
    }
  }