import useCardsStore from "../store/cards.store";
import useGameStateStore from "../store/gameState.store";
import { startGame } from "./newRound";
import { aiChooseAction } from "../AI/aiLogic";
import { dummyAiChooseAction } from "../AI/dummy AI/dummyAi";
import { executeAction } from "./processTurn";
import { checkWinner } from "./checkWinner";
import { finishRound } from "./newRound";
import type { PlayerOptions } from "../types";

//завершить стадию подготовки и начать игру
export const startDummyGame = (value: 'AGGRO' | 'OUTGROW') => {
    startGame();
    setTimeout(() => processDummyTurn(value), 500);
}

//основная функция обработки хода
const processDummyTurn = (value: 'AGGRO' | 'OUTGROW') => {
    const { gameStatus, currentPlayer } = useGameStateStore.getState();
    
    if (gameStatus !== 'started') return;

    let finalAction;
    if (currentPlayer === 'player') finalAction = dummyAiChooseAction(value);
    if (currentPlayer === 'AI') finalAction = finalAction = aiChooseAction(()=>{});
    if (!finalAction) return;

    executeAction(currentPlayer as PlayerOptions, finalAction);

    const winner = checkWinner();
    if (winner) {
        finishRound(winner);
        return;
    }

    //передача хода другому игроку
    const nextPlayer: PlayerOptions = currentPlayer === 'player' ? 'AI' : 'player';
    const { turn, setCurrentPlayer, setTurn } = useGameStateStore.getState();
    
    if (nextPlayer === 'player') setTurn(turn + 1);
    setCurrentPlayer(nextPlayer);

    setTimeout(() => processDummyTurn(value), 500);
};