import { useState, useEffect, useRef } from "react";
import RPSApi from "./rpsApi.js";
 

const ApiMultiplayerView = ({ userName, onReset }) => {
    const [roomCode, setRoomCode] = useState("");
    const [joiningRoom, setJoiningRoom] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const [players, setPlayers] = useState([]);
    const [choices, setChoices] = useState({});
    const [results, setResults] = useState(null);
    const [scores, setScores] = useState({});
    const [gameHistory, setGameHistory] = useState([]);
    const [status, setStatus] = useState("waiting");

    const [userChoice, setUserChoice] = useState("rock");
    const [hasSelected, setHasSelected] = useState(false);

    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [isJoiningRoom, setIsJoiningRoom] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // polling interval
    const intervalRef = useRef(null);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Keep polling game state
    const startPolling = (roomId) => {
        intervalRef.current = setInterval(async () => {
            try {
                const state = await RPSApi.getState(roomId);

                updateStateFromServer(state);
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 1000);
    };

    const updateStateFromServer = (state) => {
        setPlayers(state.players || []);
        setChoices(state.choices || {});
        setResults(state.results || null);
        setStatus(state.status || "waiting");

        // scores exist only after result is computed
        let newScoreboard = { ...scores };
        if (state.results?.winner) {
            const winnerName =
                state.results.winner === "A"
                    ? state.players[0]
                    : state.players[1];

            newScoreboard[winnerName] = (newScoreboard[winnerName] || 0) + 1;

            // Build readable history message
            const historyLine = `${state.players[0]} chose ${state.choices[state.players[0]]}, ${state.players[1]} chose ${state.choices[state.players[1]]
                } → ${state.results.detail}`;

            setGameHistory((prev) => [...prev, historyLine]);
            setScores(newScoreboard);
        }

        // Did this user select already?
        setHasSelected(state.choices?.[userName] != null);
    };

    // ----------------------------
    // CREATE ROOM
    // ----------------------------
    const handleCreateRoom = async () => {
        try {
            setIsCreatingRoom(true);
            setErrorMessage("");

            const { roomId, gameState } = await RPSApi.createRoom(userName);

            setRoomCode(roomId);
            updateStateFromServer(gameState);

            startPolling(roomId);
            setGameStarted(true);
        } catch (error) {
            console.error("Error creating room:", error);
            setErrorMessage("Failed to create room. Please try again.");
        } finally {
            setIsCreatingRoom(false);
        }
    };

    // ----------------------------
    // JOIN ROOM
    // ----------------------------
    const handleJoinRoom = async () => {
        if (roomCode.length < 4) {
            setErrorMessage("Please enter a valid room code.");
            return;
        }

        try {
            setIsJoiningRoom(true);
            setErrorMessage("");

            const state = await RPSApi.joinRoom(roomCode, userName);

            updateStateFromServer(state);
            startPolling(roomCode);

            setGameStarted(true);
        } catch (error) {
            console.error("Error joining room:", error);
            setErrorMessage("Failed to join room. Please check code & try again.");
        } finally {
            setIsJoiningRoom(false);
        }
    };

    // ----------------------------
    // SUBMIT CHOICE
    // ----------------------------
    const handlePlay = async () => {
        try {
            setErrorMessage("");
            await RPSApi.submitChoice(roomCode, userName, userChoice);
            setHasSelected(true);
        } catch (error) {
            console.error("Error making selection:", error);
            setErrorMessage("Failed to submit your choice.");
        }
    };

    const handleSelectChange = (e) => {
        setUserChoice(e.target.value);
    };

    // ----------------------------
    // EXIT GAME
    // ----------------------------
    const handleReset = async () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onReset();
    };

    // ----------------------------
    // RENDERING
    // ----------------------------

    const renderLobby = () => (
        <div id="welcome-screen">
            <h2>Multiplayer</h2>
            <p>Play Rock Paper Scissors against someone else!</p>

            {errorMessage && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                    {errorMessage}
                </div>
            )}

            {!joiningRoom ? (
                <div>
                    <button
                        className="btn btn-primary"
                        onClick={handleCreateRoom}
                        disabled={isCreatingRoom}
                    >
                        {isCreatingRoom ? "Creating..." : "Create New Game"}
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => setJoiningRoom(true)}
                        style={{ marginLeft: "10px" }}
                        disabled={isCreatingRoom}
                    >
                        Join Existing Game
                    </button>
                </div>
            ) : (
                <div>
                    <div className="form-group">
                        <label htmlFor="room-code">Enter Room Code:</label>
                        <input
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            className="form-control"
                            type="text"
                            id="room-code"
                            placeholder="Enter code..."
                            maxLength="6"
                        />
                    </div>

                    <button
                        className="btn btn-success"
                        onClick={handleJoinRoom}
                        disabled={isJoiningRoom}
                    >
                        {isJoiningRoom ? "Joining..." : "Join Game"}
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setJoiningRoom(false);
                            setErrorMessage("");
                        }}
                        style={{ marginLeft: "10px" }}
                        disabled={isJoiningRoom}
                    >
                        Back
                    </button>
                </div>
            )}
        </div>
    );

    const renderGame = () => (
        <div id="game-screen">
            <div id="room-info">
                <h3>Room Code: {roomCode}</h3>
                <p>Share this code with your opponent.</p>
            </div>

            {/* Scores */}
            <div id="score-tally">
                <h3>Players:</h3>
                {players.map((p) => (
                    <p key={p}>
                        {p}: {scores[p] || 0} {p === userName ? "(You)" : ""}
                    </p>
                ))}
            </div>

            {/* Selection */}
            {!hasSelected ? (
                <form id="game-form">
                    <div className="form-group">
                        <label htmlFor="user-selection">Select your choice:</label>
                        <select
                            className="custom-select"
                            value={userChoice}
                            onChange={handleSelectChange}
                        >
                            <option value="rock">Rock</option>
                            <option value="paper">Paper</option>
                            <option value="scissors">Scissors</option>
                        </select>
                    </div>

                    <button
                        className="btn btn-success"
                        type="button"
                        onClick={handlePlay}
                        disabled={players.length < 2}
                    >
                        Go!
                    </button>

                    {players.length < 2 && (
                        <p style={{ marginTop: "10px" }}>
                            Waiting for another player...
                        </p>
                    )}
                </form>
            ) : (
                <p>You selected: {userChoice}. Waiting for opponent…</p>
            )}

            {/* Game history */}
            <ul id="game-history">
                {gameHistory.map((l, idx) => (
                    <li key={idx}>{l}</li>
                ))}
            </ul>

            <button className="btn btn-secondary" onClick={handleReset}>
                Exit Game
            </button>
        </div>
    );

    return gameStarted ? renderGame() : renderLobby();
};

export default ApiMultiplayerView;
