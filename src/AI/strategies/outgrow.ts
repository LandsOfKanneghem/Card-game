import type { CommonCardParams } from "../../types";
import type { Hands, CardValues, EdgeValues, Strategy, StrategyAction } from "../aiTypes"
import * as AI_UTILS from '../aiUtils'
import { saveRange_max } from "./aiGetActualStrategyAction";


//первоначальная поверхностная проверка на наличие подходящих карт для розыгрыша
//[внутри метода getAction проверка будет более детальная, т.к. вариантов действий внутри стратегии много]
function checkAiOutgrowCards(edgeValues: EdgeValues) {
    if (edgeValues.minRedValue < 0) return true;
    if (edgeValues.maxGreenValue > 0) return true;
    return false;
}


//OUTGROW: пытаемся опередить оппонента по счету путем: 
//a)увеличения своего счета, b)понижения счета оппонента
function getActionForOutgrow(
    hands: Hands, 
    values: CardValues,
    edgeValues: EdgeValues,
    aiPoints: number, 
    playerPoints: number,
    turn: number
): StrategyAction {

    //ВАРИАНТ 1: выбор карты для занижения оппонента
    let card1: CommonCardParams | undefined;
    if (playerPoints > 0) {
        if (turn <= 8) card1 = AI_UTILS.getOptimalLoweringOpponentCard(playerPoints, hands, values, edgeValues) as CommonCardParams;
        else card1 = AI_UTILS.getCounterweightCard(playerPoints, 'player', hands, values, edgeValues) as CommonCardParams;
    }
        

    //ВАРИАНТ 2: выбор карты для повышения своего счета
    //[логика: завышение своего счета не выходя из безопасного диапазона, в данном случае - saveRange.max]
    let card2: CommonCardParams | undefined;
    if (aiPoints < saveRange_max) 
        card2 = AI_UTILS.getBestSafeCard(aiPoints, saveRange_max, hands, values) as CommonCardParams;
        

    const candidates = [card1, card2].filter((c): c is CommonCardParams => c !== undefined);
    if (candidates.length === 0) return null;

    const bestCard = candidates.length === 1 
        ? candidates[0] 
        : (Math.abs(candidates[0].value) > Math.abs(candidates[1].value) ? candidates[0] : candidates[1]);
    return { card: bestCard as CommonCardParams, discarded: false, canceled: false };
}


//OUTGROW: подсчет веса
export function getOutgrowWeightAndAction(
    strategyList: Strategy[], 
    hands: Hands,
    values: CardValues, 
    edgeValues: EdgeValues, 
    playerPoints: number, 
    aiPoints: number,
    turn: number
): { w: number, action: StrategyAction } {
    if (!strategyList.includes('OUTGROW')) return { w: -1, action: null };

    let w = 0;
    let action: StrategyAction = null;
    
    //мотивация к движению
    if (aiPoints < saveRange_max) w += 1;//если мы меньше, чем нижняя граница безопасного окна
    if (aiPoints <= playerPoints) w += 1;
    
    //смотрим потенциальный пуш оппонента и наш счет
    //если у оппонента есть высокий потенциал для удачного пуша - не будем помогать ему
    if (aiPoints >= 4 && AI_UTILS.getCardValueSum('player', 'red', true, values) >= 5) 
        w -= ((aiPoints - 4) + (AI_UTILS.getCardValueSum('player', 'red', true, values) - 5));

    //делаем действие только положительном весе (иначе действие лишено смысла)
    if (w > 0 && checkAiOutgrowCards(edgeValues)) action = getActionForOutgrow(hands, values, edgeValues, aiPoints, playerPoints, turn);

    return { w, action };
}