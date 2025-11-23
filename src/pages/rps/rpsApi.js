const API_BASE = "https://game-room-api.fly.dev/api";

function computeWinner(choiceA, choiceB) {
    if (choiceA === choiceB) return { winner: null, detail: "Tie!" };

    const beats = {
        rock: "scissors",
        paper: "rock",
        scissors: "paper"
    };

    if (beats[choiceA] === choiceB)
        return { winner: "A", detail: `${choiceA} beats ${choiceB}` };

    return { winner: "B", detail: `${choiceB} beats ${choiceA}` };
}

const RPSApi = {
    async createRoom(playerName) {
        const roomId = Math.floor(100000 + Math.random() * 900000).toString();

        const initialState = {
            players: [playerName],
            choices: {},
            status: "waiting",
            results: {}
        };

        await fetch(`${API_BASE}/rooms/${roomId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                roomId,
                gameState: initialState
            })
        });

        return { roomId, gameState: initialState };
    },

    async joinRoom(roomId, playerName) {
        const res = await fetch(`${API_BASE}/rooms/${roomId}`);
        if (!res.ok) throw new Error("Room not found");

        const data = await res.json();
        const gameState = data.gameState;

        if (gameState.players.length >= 2)
            throw new Error("Room full");

        if (!gameState.players.includes(playerName)) {
            gameState.players.push(playerName);
        }

        // Track choices
        gameState.choices[playerName] = null;

        if (gameState.players.length === 2) {
            gameState.status = "ready";
        }

        await fetch(`${API_BASE}/rooms/${roomId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameState })
        });

        return gameState;
    },

    async getState(roomId) {
        const res = await fetch(`${API_BASE}/rooms/${roomId}`);
        if (!res.ok) throw new Error("Room not found");
        return (await res.json()).gameState;
    },

    async submitChoice(roomId, playerName, choice) {
        const data = await fetch(`${API_BASE}/rooms/${roomId}`).then(r => r.json());
        const state = data.gameState;

        state.choices[playerName] = choice;

        const players = state.players;
        const A = players[0];
        const B = players[1];

        if (state.choices[A] && state.choices[B]) {
            // Both players chose → compute winner
            const result = computeWinner(state.choices[A], state.choices[B]);
            state.status = "revealed";
            state.results = result;
        }

        await fetch(`${API_BASE}/rooms/${roomId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameState: state })
        });

        return state;
    },

    async reset(roomId) {
        const data = await fetch(`${API_BASE}/rooms/${roomId}`).then(r => r.json());
        const state = data.gameState;

        state.choices = {};
        state.results = {};
        state.status = "ready";

        await fetch(`${API_BASE}/rooms/${roomId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameState: state })
        });

        return state;
    }
};

export default RPSApi;
