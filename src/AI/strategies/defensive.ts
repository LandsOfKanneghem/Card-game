import type { Hands, CardValues, EdgeValues, Strategy, StrategyAction } from "../aiTypes"
import * as AI_UTILS from '../aiUtils'
import { saveRange_max } from "./aiGetActualStrategyAction";


//первоначальная поверхностная проверка на наличие подходящих карт для розыгрыша
//[внутри метода getAction проверка будет более детальная, т.к. вариантов действий внутри стратегии много]
function checkAiDefensiveCards(edgeValues: EdgeValues) {
    if (edgeValues.minGreenValue < 0) return true;
    return false;
}


//DEFENSIVE: пытаемся понизить свой счет
function getActionForDefensive(
    hands: Hands, 
    edgeValues: EdgeValues, 
): StrategyAction {
    //нет карт для розыгрыша — предлагаем сбросить бесполезную карту
    if (edgeValues.minGreenValue > 0) return null;
    
    //всегда берем карту с наименьшим значением
    const card = AI_UTILS.getCardByProps(edgeValues.minGreenValue, 'green', 'AI', hands);

    return card ? { card, discarded: false } : null
}


//DEFENSIVE: подсчет веса
export function getDefensiveWeightAndAction(
    strategyList: Strategy[], 
    hands: Hands,
    values: CardValues, 
    edgeValues: EdgeValues, 
    playerPoints: number, 
    aiPoints: number,
    turn: number
): { w: number, action: StrategyAction } {
    if (!strategyList.includes('DEFENSIVE')) return { w: -1, action: null };

    let w = 0;
    let action: StrategyAction = null;

    //экстренный случай: оппонент может запушить на следующем ходу - в этом случае без раздумий обороняемся
    //но если подходящих карт нет, то сбрасывать нет смысла
    if (
        AI_UTILS.checkAiBustThisTurn(aiPoints, values.playerRedValues) && 
        checkAiDefensiveCards(edgeValues)
    ) {
        action = getActionForDefensive(hands, edgeValues);
        return { w: 100, action };
    }
    
    if (aiPoints > saveRange_max) w += (aiPoints - saveRange_max) * 3;//находимся в опасной зоне
    
    //делаем действие только положительном весе (иначе действие лишено смысла)
    if (w > 0 && checkAiDefensiveCards(edgeValues)) action = getActionForDefensive(hands, edgeValues);

    return { w, action };
}