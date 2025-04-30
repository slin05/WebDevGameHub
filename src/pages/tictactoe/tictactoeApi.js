// Game Room API service for Tic Tac Toe
const API_BASE_URL = 'https://game-room-api.fly.dev/api';

export const TicTacToeApi = {
  /**
   * Create a new game room
   * @param {string} player1 - Name of player 1 (X)
   * @returns {Promise<{roomId: string, gameState: Object}>}
   */
  createRoom: async (player1) => {
    try {
      const initialState = {
        squares: Array(9).fill(null),
        isXNext: true,
        player1: player1,
        player2: null,
        lastUpdate: Date.now(),
        status: 'waiting' // waiting, active, finished
      };

      const response = await fetch(`${API_BASE_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ initialState })
      });

      if (!response.ok) {
        throw new Error(`Failed to create room: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  /**
   * Join an existing game room
   * @param {string} roomId - The room ID to join
   * @param {string} player2 - Name of player 2 (O)
   * @returns {Promise<Object>} - Updated game state
   */
  joinRoom: async (roomId, player2) => {
    try {
      // First get the current game state
      const currentState = await TicTacToeApi.getGameState(roomId);
      
      if (!currentState) {
        throw new Error('Room not found');
      }

      if (currentState.player2) {
        throw new Error('Room is full');
      }

      // Update with player 2 info
      const updatedState = {
        ...currentState,
        player2: player2,
        status: 'active',
        lastUpdate: Date.now()
      };

      // Update the game state on the server
      return await TicTacToeApi.updateGameState(roomId, updatedState);
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  },

  /**
   * Get the current game state
   * @param {string} roomId - The room ID
   * @returns {Promise<Object>} - Current game state
   */
  getGameState: async (roomId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to get room: ${response.status}`);
      }

      const data = await response.json();
      return data.gameState;
    } catch (error) {
      console.error('Error getting game state:', error);
      throw error;
    }
  },

  /**
   * Update the game state
   * @param {string} roomId - The room ID
   * @param {Object} gameState - New game state
   * @returns {Promise<Object>} - Updated game state
   */
  updateGameState: async (roomId, gameState) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
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
  },

  /**
   * Make a move in the game
   * @param {string} roomId - The room ID
   * @param {number} squareIndex - Index of square (0-8)
   * @param {string} playerRole - 'X' or 'O'
   * @returns {Promise<Object>} - Updated game state
   */
  makeMove: async (roomId, squareIndex, playerRole) => {
    try {
      const gameState = await TicTacToeApi.getGameState(roomId);
      
      if (!gameState) {
        throw new Error('Room not found');
      }

      const isPlayersTurn = (gameState.isXNext && playerRole === 'X') || 
                         (!gameState.isXNext && playerRole === 'O');
      
      if (!isPlayersTurn) {
        throw new Error('Not your turn');
      }

      if (gameState.squares[squareIndex] || calculateWinner(gameState.squares)) {
        throw new Error('Invalid move');
      }

      // Make the move
      const newSquares = [...gameState.squares];
      newSquares[squareIndex] = gameState.isXNext ? 'X' : 'O';
      
      // Check if the game is over
      const winner = calculateWinner(newSquares);
      const isDraw = !winner && newSquares.every(square => square !== null);
      
      // Update game state
      const updatedState = {
        ...gameState,
        squares: newSquares,
        isXNext: !gameState.isXNext,
        lastUpdate: Date.now(),
        status: winner || isDraw ? 'finished' : 'active'
      };

      // Send updated state to server
      return await TicTacToeApi.updateGameState(roomId, updatedState);
    } catch (error) {
      console.error('Error making move:', error);
      throw error;
    }
  },

  /**
   * Reset the game
   * @param {string} roomId - The room ID
   * @returns {Promise<Object>} - Updated game state
   */
  resetGame: async (roomId) => {
    try {
      const gameState = await TicTacToeApi.getGameState(roomId);
      
      if (!gameState) {
        throw new Error('Room not found');
      }

      const resetState = {
        ...gameState,
        squares: Array(9).fill(null),
        isXNext: true,
        lastUpdate: Date.now(),
        status: 'active'
      };

      return await TicTacToeApi.updateGameState(roomId, resetState);
    } catch (error) {
      console.error('Error resetting game:', error);
      throw error;
    }
  }
};

// Helper function to calculate winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}