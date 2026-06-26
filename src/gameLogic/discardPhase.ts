import { COMMON_HAND_SIZE } from "../config";
import { isNonNegativeIntegerNumber } from "../utils/utils";
import useCardsStore from "../store/cards.store";
import useGameStateStore from "../store/gameState.store";
import { startGame } from "./newRound";

//начать режим сброса карт
export const startDiscardPhase = (value: number) => {
    const { setDiscardCount, setMaxDiscardCount } = useGameStateStore.getState();

    if (!isNonNegativeIntegerNumber(value)) return;
    setDiscardCount(0);
    setMaxDiscardCount(value);
};

export const discardCardInDiscardPhase = (cardId: string) => {
    const { removePlayerCommonCard } = useCardsStore.getState();
    const { gameStatus, discardCount, maxDiscardCount, setDiscardCount } = useGameStateStore.getState();

    if (discardCount === null || maxDiscardCount === null) return;

    if (discardCount < maxDiscardCount) {
        removePlayerCommonCard(cardId);
        const newDiscardCount = discardCount + 1;
        setDiscardCount(newDiscardCount);
        if (newDiscardCount === maxDiscardCount) {
            if (gameStatus === 'discard before start') startGame();
        }
        return;
    }
}

//закончить фазу сброса карт перед началом раунда
export const finishDiscardPhase = () => {
    const { playerCommonHand, takeCardsFromDeck } = useCardsStore.getState();
    const { setDiscardCount, setMaxDiscardCount } = useGameStateStore.getState();
    
    const cardsToTake = COMMON_HAND_SIZE - playerCommonHand.length;
    if (cardsToTake > 0) takeCardsFromDeck(cardsToTake);
    setDiscardCount(null);
    setMaxDiscardCount(null);
};