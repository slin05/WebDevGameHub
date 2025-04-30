const API_BASE_URL = 'https://game-room-api.fly.dev/api';

export const TicTacToeApi = {
  createRoom: async (player1) => {
    try {
      const initialState = {
        squares: Array(9).fill(null),
        isXNext: true,
        player1: player1,
        player2: null,
        lastUpdate: Date.now(),
        status: 'waiting' 
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

  joinRoom: async (roomId, player2) => {
    try {
      const currentState = await TicTacToeApi.getGameState(roomId);
      
      if (!currentState) {
        throw new Error('Room not found');
      }

      if (currentState.player2) {
        throw new Error('Room is full');
      }
      const updatedState = {
        ...currentState,
        player2: player2,
        status: 'active',
        lastUpdate: Date.now()
      };
      return await TicTacToeApi.updateGameState(roomId, updatedState);
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  },

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

      const newSquares = [...gameState.squares];
      newSquares[squareIndex] = gameState.isXNext ? 'X' : 'O';
      
      const winner = calculateWinner(newSquares);
      const isDraw = !winner && newSquares.every(square => square !== null);
      
      const updatedState = {
        ...gameState,
        squares: newSquares,
        isXNext: !gameState.isXNext,
        lastUpdate: Date.now(),
        status: winner || isDraw ? 'finished' : 'active'
      };

      return await TicTacToeApi.updateGameState(roomId, updatedState);
    } catch (error) {
      console.error('Error making move:', error);
      throw error;
    }
  },

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