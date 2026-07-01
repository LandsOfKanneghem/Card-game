import { COMMON_HAND_SIZE } from "../config";
import { isNonNegativeIntegerNumber } from "../utils/utils";
import useCardsStore from "../store/cards.store";
import useGameStateStore from "../store/gameState.store";
import { startGame } from "./newRound";
import type { PlayerOptions } from "../types";
import { passTurn } from "./processTurn";


//вспомогательная функция - проверяем, что мы находимся в фазе сброса из-за розыгрыша спец карты
function checkDiscardPhaseBecauseOfSpecialCardEffect(player: PlayerOptions): boolean {
    const checkActiveEffects = useGameStateStore.getState().checkActiveEffects;
    
    if (player === 'player' && checkActiveEffects('player', ['coin', 'clover'])) return true;
    return false;
}

//проверка, что игрок находится в стадии сброса карт
export const checkDiscardPhase = (player: PlayerOptions): boolean => {
    if (player === 'player') {
        const gameStatus = useGameStateStore.getState().gameStatus;
        if (gameStatus === 'discard before start' || checkDiscardPhaseBecauseOfSpecialCardEffect('player')) return true;
        else return false;
    }
    return false;
}

//начать режим сброса карт
export const startDiscardPhase = (value: number) => {
    const { setDiscardCount, setMaxDiscardCount } = useGameStateStore.getState();

    if (!isNonNegativeIntegerNumber(value)) return;
    setDiscardCount(0);
    setMaxDiscardCount(value);
};

export const discardCardInDiscardPhase = (cardId: string) => {
    const { removePlayerCommonCard } = useCardsStore.getState();
    const { discardCount, maxDiscardCount, setDiscardCount } = useGameStateStore.getState();

    if (discardCount === null || maxDiscardCount === null) return;

    if (discardCount < maxDiscardCount) {
        removePlayerCommonCard(cardId);
        const newDiscardCount = discardCount + 1;
        setDiscardCount(newDiscardCount);
        if (newDiscardCount === maxDiscardCount) finishDiscardPhase();
    }
}

//добор карт после фазы сброса
export const takeCardsAfterDiscardPhase = () => {
    const { playerCommonHand, takeCardsFromDeck } = useCardsStore.getState();
    const { setDiscardCount, setMaxDiscardCount } = useGameStateStore.getState();
    
    const cardsToTake = COMMON_HAND_SIZE - playerCommonHand.length;
    if (cardsToTake > 0) takeCardsFromDeck(cardsToTake);
    setDiscardCount(null);
    setMaxDiscardCount(null);
};

//закончить фазу сброса карт
export const finishDiscardPhase = () => {
    const { gameStatus, currentPlayer, playerActiveEffects, removeActiveEffect } = useGameStateStore.getState();
    
    takeCardsAfterDiscardPhase();

    //действие после завершения фазы сброса
    //если фаза сброса из-за начала раунда
    if (gameStatus === 'discard before start') startGame();
    //если фаза сброса из-за Монетки или Клевера
    else if (playerActiveEffects.length > 0) {
        removeActiveEffect('player', 'coin');
        removeActiveEffect('player', 'clover');
        if (currentPlayer === 'player') passTurn('player', () => {});
    }
};