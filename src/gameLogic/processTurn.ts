import { aiChooseAction } from "../AI/aiLogic";
import type { PlayerOptions, DoneAction, CommonCardParams } from "../types";
import { checkWinner } from "./checkWinner";
import { finishRound } from "./newRound";
import useGameStateStore from "../store/gameState.store";
import useCardsStore from "../store/cards.store";
import { gameLoop } from "./gameLoop";




//основная функция обработки хода
export const processTurn = (setLogs: React.Dispatch<React.SetStateAction<string[]>>, action?: DoneAction) => {
    const { gameStatus, currentPlayer } = useGameStateStore.getState();
    
    if (gameStatus !== 'started') return;

    let finalAction = action;
    if (!finalAction && currentPlayer === 'AI') finalAction = aiChooseAction(setLogs);
    if (!finalAction) return;

    executeAction(currentPlayer as PlayerOptions, finalAction);

    const winner = checkWinner();
    if (winner) {
        finishRound(winner);
        return;
    }

    //передача хода другому игроку
    passTurn(currentPlayer as PlayerOptions, setLogs);
};





//применение эффекта от розыгрыша обычной карты [игроком или ИИ]
//[здесь player - это игрок, который разыграл карту, А НЕ к которому был применен эффект]
const applyCommonCardEffect = (player: PlayerOptions, card: CommonCardParams) => {
    const { playerPoints, aiPoints, setPlayerPoints, setAiPoints } = useGameStateStore.getState();
    const { value, color } = card;

    if ((player === 'player' && color === 'green') || (player === 'AI' && color === 'red')) {
        const newValue = playerPoints + value;
        setPlayerPoints(newValue < 0 ? 0 : newValue);
    } else if ((player === 'player' && color === 'red') || (player === 'AI' && color === 'green')) {
        const newValue = aiPoints + value;
        setAiPoints(newValue < 0 ? 0 : newValue);
    }
};

//применение эффекта от розыгрыша особой карты [игроком или ИИ]
const applySpecialCardEffect = () => {

};

//выполнить действие
export const executeAction = (player: PlayerOptions, action: DoneAction) => {
    const { discardOrPlay } = useCardsStore.getState();
    const { card, discarded, canceled } = action; 

    if (discarded === false && card.type === 'common') {
        applyCommonCardEffect(player, card);
    } else if (card.type === 'special') {
        applySpecialCardEffect();
    }

    if (card.type === 'common') {
        const doneAction: DoneAction = {
            card: {...card},
            discarded,
            canceled: false,
        };
        discardOrPlay(doneAction, player);
    } else {
        if (player === 'player') {
            // TODO: Удаление спецкарты из руки
        } else {
            // TODO: Удаление спецкарты из руки AI
        }
    }
};

//передача хода другому игроку
export const passTurn = (player: PlayerOptions, setLogs: React.Dispatch<React.SetStateAction<string[]>>) => {
    const { turn, setCurrentPlayer, setTurn } = useGameStateStore.getState();

    const nextPlayer: PlayerOptions = player === 'player' ? 'AI' : 'player';        
    if (nextPlayer === 'player') setTurn(turn + 1);
    setCurrentPlayer(nextPlayer);

    if (nextPlayer === 'AI') {
        gameLoop.scheduleAITurn(500, setLogs);
    }
}