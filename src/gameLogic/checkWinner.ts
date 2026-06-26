import { MAX_VALUE, LAST_TURN } from "../config";
import type { WinnerOptions, PlayerOptions } from "../types";
import useCardsStore from "../store/cards.store";
import useGameStateStore from "../store/gameState.store";

//проверка победы по перебору
const checkBustWinner = (
    playerPoints: number, 
    aiPoints: number
): WinnerOptions | null => {
    if (playerPoints > MAX_VALUE) return 'AI';
    if (aiPoints > MAX_VALUE) return 'player';
    return null;
};

//проверка победы по отсутствию карт для розыгрыша
const checkNoCardsToPlayWinner = (
    deckIsEmpty: boolean, 
    playerHandIsEmpty: boolean, 
    aiHandIsEmpty: boolean
): WinnerOptions | null => {
    if (!deckIsEmpty) return null;
    if (playerHandIsEmpty) return 'AI';
    if (aiHandIsEmpty) return 'player';
    return null;
};

//проверка победы по очкам на последний ход
const checkOutgrowWinner = (
    turn: number, 
    playerPoints: number, 
    aiPoints: number, 
    currentPlayer: PlayerOptions
): WinnerOptions | null => {
    if (turn >= LAST_TURN && currentPlayer === 'AI') {
        if (playerPoints > aiPoints) return 'player';
        if (aiPoints > playerPoints) return 'AI';
    }
    return null;
};


//проверка на наличие победителя
export const checkWinner = (): WinnerOptions | null => {
    const { turn, playerPoints, aiPoints, currentPlayer } = useGameStateStore.getState();
    const { playerCommonHand, aiCommonHand, generalDeck } = useCardsStore.getState();
    
    const bustWinner = checkBustWinner(playerPoints, aiPoints);
    if (bustWinner) return bustWinner;
    
    const noCardsWinner = checkNoCardsToPlayWinner(
        generalDeck.length === 0,
        playerCommonHand.length === 0,
        aiCommonHand.length === 0
    );
    if (noCardsWinner) return noCardsWinner;
    
    const outgrowWinner = checkOutgrowWinner(
        turn,
        playerPoints,
        aiPoints,
        currentPlayer as PlayerOptions
    );
    if (outgrowWinner) return outgrowWinner;
    
    return null;
};