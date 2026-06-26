import { COMMON_HAND_SIZE, ROUNDS_TO_WIN } from "../config";
import type { WinnerOptions } from "../types";
import useCardsStore from "../store/cards.store";
import useGameStateStore from "../store/gameState.store";
import { gameLoop } from "./gameLoop";
import { startDiscardPhase, finishDiscardPhase } from "./discardPhase";



//стадия подготовки перед началом нового раунда
export const prepareForNewRound = () => {
    const dealCards = useCardsStore.getState().dealCards;
    const { resetRoundData, setGameStatus } = useGameStateStore.getState();

    gameLoop.reset();
    resetRoundData();
    dealCards();
    setGameStatus('discard before start');
    startDiscardPhase(3);
};

//завершить стадию подготовки и начать игру
export const startGame = () => {
    const { setCurrentPlayer, setGameStatus } = useGameStateStore.getState();

    finishDiscardPhase();
    setGameStatus('started');
    setCurrentPlayer('player');
}

//завершить раунд
export const finishRound = (winner: WinnerOptions) => {
    const { aiGlobalScore, playerGlobalScore } = useGameStateStore.getState();
    
    gameLoop.reset();
    
    const newPlayerScore = playerGlobalScore + (winner === 'player' ? 1 : 0);
    const newAiScore = aiGlobalScore + (winner === 'AI' ? 1 : 0);
    const gameFinished = newPlayerScore >= ROUNDS_TO_WIN || newAiScore >= ROUNDS_TO_WIN;
    const newGameStatus = gameFinished ? 'game finished' : 'round finished';
    const newGameWinner = gameFinished ? winner : null;
    
    useGameStateStore.setState({
        currentPlayer: null,
        gameWinner: newGameWinner,
        roundWinner: winner,
        playerGlobalScore: newPlayerScore,
        aiGlobalScore: newAiScore,
        gameStatus: newGameStatus
    });
};