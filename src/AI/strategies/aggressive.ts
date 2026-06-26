import type { Hands, CardValues, EdgeValues, Strategy, StrategyAction } from "../aiTypes"
import * as AI_UTILS from '../aiUtils'



//первоначальная поверхностная проверка на наличие подходящих карт для розыгрыша
//[внутри метода getAction проверка будет более детальная, т.к. вариантов действий внутри стратегии много]
function checkAiAgressiveCards(edgeValues: EdgeValues) {
    if (edgeValues.maxRedValue > 0) return true;
    return false;
}


//AGGRESSIVE: пытаемся запушить
function getActionForAggressive(
    hands: Hands, 
    edgeValues: EdgeValues
): StrategyAction {
    //нет карт для розыгрыша — предлагаем сбросить бесполезную карту
    if (edgeValues.maxRedValue < 0) return null;
    
    //всегда берем карту с наибольшим пуш-потенциалом
    const card = AI_UTILS.getCardByProps(edgeValues.maxRedValue, 'red', 'AI', hands);
    
    return card ? { card, discarded: false } : null
}


//AGGRESSIVE: подсчет веса
export function getAggressiveWeightAndAction(
    strategyList: Strategy[], 
    hands: Hands,
    values: CardValues, 
    edgeValues: EdgeValues, 
    playerPoints: number, 
    aiPoints: number,
    turn: number
): { w: number, action: StrategyAction } {
    if (!strategyList.includes('AGGRESSIVE')) return { w: -1, action: null };

    let w = 0;
    let action: StrategyAction = null;

    if (AI_UTILS.checkPlayerBustThreeTurns(turn, playerPoints, values)) w += 50;

    //суммарный потенциал для пуша
    // w += AI_UTILS.getCardValueSum('AI', 'red', true, values);//потенциал для пуша оппонента
    // w -= AI_UTILS.getCardValueSum('player', 'green', false, values);//потенциал для обороны оппонента
    
    // //вес стратегии в зависимости от счета оппонента
    // if (playerPoints <= 5) w -= (5 - playerPoints) * 2;//шанс запушить низкий
    // //else if (5 < playerPoints && playerPoints <= 9) w += playerPoints - 5;//шанс запушить средний
    // else if (playerPoints > 9) w += (playerPoints - 5) * 1.5;//шанс запушить высокий
    
    // //вес стратегии в зависимости от хода
    // if (5 < turn && turn < 8) w -= turn - 5;//чем ближе последний ход - тем выше шанс недопушить оппонента и проиграть по счету
    // else if (turn >= 8) w -= (turn - 5) * 2;//на последних ходах шанс недопушить высокий

    //делаем действие только положительном весе (иначе действие лишено смысла)
    if (w > 0 && checkAiAgressiveCards(edgeValues)) action = getActionForAggressive(hands, edgeValues);

    return { w, action };
}