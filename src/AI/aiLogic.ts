import React from "react"
import type { SpecialCardValue, CommonCardParams, SpecialCardParams, CardColor, DoneAction, CommonCardColor, PlayerOptions } from "../types"
import type { Hands, CardValues, EdgeValues, Strategy, StrategyAction } from "./aiTypes"
import { isSpecialCard } from "../utils/gameUtils"
import { MAX_VALUE, LAST_TURN, COMMON_CARD_MAX_VALUE } from "../config"
import * as AI_UTILS from './aiUtils'
import { getActualStrategyAction } from "./strategies/aiGetActualStrategyAction"
import useCardsStore from "../store/cards.store"
import useGameStateStore from "../store/gameState.store"





export function aiChooseAction(
    setLogs: React.Dispatch<React.SetStateAction<string[]>>
): DoneAction | undefined {
    const { aiCommonHand, aiSpecialHand, playerCommonHand, playerSpecialHand, generalDeck, playerDoneActions } = useCardsStore.getState();
    const { aiLevel, turn, aiPoints, playerPoints } = useGameStateStore.getState();
    if (aiLevel === null) return undefined;

    let AiChosenCard: CommonCardParams | SpecialCardParams | undefined

    const hands: Hands = {aiCommonHand, aiSpecialHand, playerCommonHand, playerSpecialHand};
    const aiRedValues: number[] = aiCommonHand.filter(item => item.color === 'red').map(item => item.value)
    const aiGreenValues: number[] = aiCommonHand.filter(item => item.color === 'green').map(item => item.value)
    const playerRedValues: number[] = playerCommonHand.filter(item => item.color === 'red').map(item => item.value)
    const playerGreenValues: number[] = playerCommonHand.filter(item => item.color === 'green').map(item => item.value)
    const values: CardValues = {aiRedValues, aiGreenValues, playerRedValues, playerGreenValues}
    
    const maxRedValue = Math.max(...aiRedValues);
    const maxGreenValue = Math.max(...aiGreenValues);
    const minRedValue = Math.min(...aiRedValues);
    const minGreenValue = Math.min(...aiGreenValues);
    const edgeValues = {maxRedValue, maxGreenValue, minRedValue, minGreenValue};
    

    //действие в последний ход   
    function getLastTurnAction(maxGreenValue: number, minRedValue: number): DoneAction | undefined {
        if (turn < LAST_TURN || AiChosenCard) return;

        //если очков больше, чем у оппонента - ничего не делаем
        if (aiPoints > playerPoints) return {card: {...aiCommonHand[0]}, discarded: true, canceled: false};

        //если очков меньше, но можем сделать больше - делаем
        const canReachWithCommonCard = 
            playerPoints >= aiPoints && 
            playerPoints - aiPoints <= COMMON_CARD_MAX_VALUE && 
            (maxGreenValue > 0 || minRedValue < 0);

        //лучшая зеленая карта, которая даст масимальный счет и при этом не даст перебора
        const bestSafeGreenCardValue = aiGreenValues
            .filter(value => value > 0 && aiPoints + value <= MAX_VALUE)
            .sort((a, b) => b - a)[0];

        //если можно выиграть засчет обычных карт
        if (canReachWithCommonCard) {
            const greenCardWins = bestSafeGreenCardValue && (aiPoints + bestSafeGreenCardValue) > playerPoints;
            const redCardWins = minRedValue < 0 && Math.max(0, playerPoints + minRedValue) < aiPoints;

            if (greenCardWins) AiChosenCard = AI_UTILS.getCardByProps(bestSafeGreenCardValue, 'green', 'AI', hands);
            else if (redCardWins) AiChosenCard = AI_UTILS.getCardByProps(minRedValue, 'red', 'AI', hands);
            if (AiChosenCard) return {card: {...AiChosenCard}, discarded: false, canceled: false};
        }

        //если можем сравнять счет...
        
        //...засчет обычных карт
        const greenCardDraw = bestSafeGreenCardValue && (aiPoints + bestSafeGreenCardValue) >= playerPoints;
        const redCardDraw = minRedValue < 0 && Math.max(0, playerPoints + minRedValue) <= aiPoints;

        if (greenCardDraw) AiChosenCard = AI_UTILS.getCardByProps(bestSafeGreenCardValue, 'green', 'AI', hands);
        else if (redCardDraw) AiChosenCard = AI_UTILS.getCardByProps(minRedValue, 'red', 'AI', hands);
        if (AiChosenCard) return {card: {...AiChosenCard}, discarded: false, canceled: false};

        //если можем топдекнуть засчет спринта...
        //{ ... }

        //если не нашли ничего подходящего - просто сбрасываем случайную карту и признаем поражение
        if (AiChosenCard === undefined) return {card: {...hands.aiCommonHand[0]}, discarded: true, canceled: false};

        //return {...AiChosenCard, discarded: false, canceled: false};
    }

    //получить список доступных стратегий в зависимости от уровня ИИ
    //ВОЗМОЖНО, ВСЕГО БУДЕТ 3 ТИПА СТРАТЕГИИ И ВСЕ ОНИ БУДУТ У ВСЕХ ИИ-ИГРОКОВ
    function getStrategies(aiLevel: number): Strategy[] {
        if (aiLevel === 0) return ['AGGRESSIVE', 'OUTGROW', 'DEFENSIVE'];
        else return [];
    }

    //стратегии в зависимости от уровня ИИ
    //ВОЗМОЖНО, У ВСЕХ ИИ-ИГРОКОВ ПОВЕДЕНИЕ БУДЕТ ОДИНАКОВОЕ ВНУТРИ ЭТОЙ ФУНКЦИИ, 
    //А РАЗЛИЧИЯ БУДУТ ВНУТРИ РЕАЛИЗАЦИЙ СТРАТЕГИЙ - ТАМ УЖЕ БУДЕТ ВЫБОР КАРТ НА ОСНОВЕ ИМЕЮЩИХСЯ
    //проверка на перебор оппонента
    const bustCard = AI_UTILS.checkPlayerBustThisTurn(maxRedValue, playerPoints, hands);
    if (bustCard) return {card: {...bustCard}, discarded: false, canceled: false}
    
    //действие в последний ход (это также относится к ходам, которые после 11-ого, если у обоих счет равный)
    if (turn >= LAST_TURN) return getLastTurnAction(maxGreenValue, minRedValue);
    
    //выбор стратегии
    const strategies = getStrategies(aiLevel);
    const strategyAction = getActualStrategyAction(
        strategies, turn, aiPoints, playerPoints,
        hands, values, edgeValues,
        setLogs
    );
    
    if (strategyAction === null) return;
    return {card: {...strategyAction.card}, discarded: strategyAction.discarded, canceled: strategyAction.canceled || false}
}





//МЕТОД ДЛЯ ТЕСТИРОВАНИЯ
export function aiChooseAction_TEST(
    aiLevel: number | null,                           
    turn: number, 
    aiPoints: number, 
    playerPoints: number, 
    aiCommonHand: CommonCardParams[], 
    aiSpecialHand: SpecialCardParams[], 
    playerCommonHand: CommonCardParams[], 
    playerSpecialHand: SpecialCardParams[],
    playerDoneActions: DoneAction[],
    generalDeck: CommonCardParams[],
    setLogs: React.Dispatch<React.SetStateAction<string[]>>
): DoneAction | undefined {
    if (aiLevel === null) return undefined;

    let AiChosenCard: CommonCardParams | SpecialCardParams | undefined

    const hands: Hands = {aiCommonHand, aiSpecialHand, playerCommonHand, playerSpecialHand};
    const aiRedValues: number[] = aiCommonHand.filter(item => item.color === 'red').map(item => item.value)
    const aiGreenValues: number[] = aiCommonHand.filter(item => item.color === 'green').map(item => item.value)
    const playerRedValues: number[] = playerCommonHand.filter(item => item.color === 'red').map(item => item.value)
    const playerGreenValues: number[] = playerCommonHand.filter(item => item.color === 'green').map(item => item.value)
    const values: CardValues = {aiRedValues, aiGreenValues, playerRedValues, playerGreenValues}
    
    const maxRedValue = Math.max(...aiRedValues);
    const maxGreenValue = Math.max(...aiGreenValues);
    const minRedValue = Math.min(...aiRedValues);
    const minGreenValue = Math.min(...aiGreenValues);
    const edgeValues = {maxRedValue, maxGreenValue, minRedValue, minGreenValue};
    

    //действие в последний ход   
    function getLastTurnAction(maxGreenValue: number, minRedValue: number): DoneAction | undefined {
        if (turn < LAST_TURN || AiChosenCard) return;

        //если очков больше, чем у оппонента - ничего не делаем
        if (aiPoints > playerPoints) return {card: {...aiCommonHand[0]}, discarded: true, canceled: false};

        //если очков меньше, но можем сделать больше - делаем
        const canReachWithCommonCard = 
            playerPoints >= aiPoints && 
            playerPoints - aiPoints <= COMMON_CARD_MAX_VALUE && 
            (maxGreenValue > 0 || minRedValue < 0);

        //лучшая зеленая карта, которая даст масимальный счет и при этом не даст перебора
        const bestSafeGreenCardValue = aiGreenValues
            .filter(value => value > 0 && aiPoints + value <= MAX_VALUE)
            .sort((a, b) => b - a)[0];

        //если можно выиграть засчет обычных карт
        if (canReachWithCommonCard) {
            const greenCardWins = bestSafeGreenCardValue && (aiPoints + bestSafeGreenCardValue) > playerPoints;
            const redCardWins = minRedValue < 0 && Math.max(0, playerPoints + minRedValue) < aiPoints;

            if (greenCardWins) AiChosenCard = AI_UTILS.getCardByProps(bestSafeGreenCardValue, 'green', 'AI', hands);
            else if (redCardWins) AiChosenCard = AI_UTILS.getCardByProps(minRedValue, 'red', 'AI', hands);
            if (AiChosenCard) return {card: {...AiChosenCard}, discarded: false, canceled: false};
        }

        //если можем сравнять счет...
        
        //...засчет обычных карт
        const greenCardDraw = bestSafeGreenCardValue && (aiPoints + bestSafeGreenCardValue) >= playerPoints;
        const redCardDraw = minRedValue < 0 && Math.max(0, playerPoints + minRedValue) <= aiPoints;

        if (greenCardDraw) AiChosenCard = AI_UTILS.getCardByProps(bestSafeGreenCardValue, 'green', 'AI', hands);
        else if (redCardDraw) AiChosenCard = AI_UTILS.getCardByProps(minRedValue, 'red', 'AI', hands);
        if (AiChosenCard) return {card: {...AiChosenCard}, discarded: false, canceled: false};

        //если можем топдекнуть засчет спринта...
        //{ ... }

        //если не нашли ничего подходящего - просто сбрасываем случайную карту и признаем поражение
        if (AiChosenCard === undefined) return {card: {...hands.aiCommonHand[0]}, discarded: true, canceled: false};

        //return {...AiChosenCard, discarded: false, canceled: false};
    }

    //получить список доступных стратегий в зависимости от уровня ИИ
    //ВОЗМОЖНО, ВСЕГО БУДЕТ 3 ТИПА СТРАТЕГИИ И ВСЕ ОНИ БУДУТ У ВСЕХ ИИ-ИГРОКОВ
    function getStrategies(aiLevel: number): Strategy[] {
        if (aiLevel === 0) return ['AGGRESSIVE', 'OUTGROW', 'DEFENSIVE'];
        else return [];
    }

    //стратегии в зависимости от уровня ИИ
    //ВОЗМОЖНО, У ВСЕХ ИИ-ИГРОКОВ ПОВЕДЕНИЕ БУДЕТ ОДИНАКОВОЕ ВНУТРИ ЭТОЙ ФУНКЦИИ, 
    //А РАЗЛИЧИЯ БУДУТ ВНУТРИ РЕАЛИЗАЦИЙ СТРАТЕГИЙ - ТАМ УЖЕ БУДЕТ ВЫБОР КАРТ НА ОСНОВЕ ИМЕЮЩИХСЯ
    //проверка на перебор оппонента
    const bustCard = AI_UTILS.checkPlayerBustThisTurn(maxRedValue, playerPoints, hands);
    if (bustCard) return {card: {...bustCard}, discarded: false, canceled: false}
    
    //действие в последний ход (это также относится к ходам, которые после 11-ого, если у обоих счет равный)
    if (turn >= LAST_TURN) return getLastTurnAction(maxGreenValue, minRedValue);
    
    //выбор стратегии
    const strategies = getStrategies(aiLevel);
    const strategyAction = getActualStrategyAction(
        strategies, turn, aiPoints, playerPoints,
        hands, values, edgeValues,
        setLogs
    );
    
    if (strategyAction === null) return;
    return {card: {...strategyAction.card}, discarded: strategyAction.discarded, canceled: strategyAction.canceled || false}
}