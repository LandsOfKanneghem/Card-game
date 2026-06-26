import type { CardColor, CommonCardParams } from "../../types";
import type { Hands, CardValues, EdgeValues, Strategy, StrategyAction } from "../aiTypes"
import { getAggressiveWeightAndAction } from "./aggressive";
import { getDefensiveWeightAndAction } from "./defensive";
import { getOutgrowWeightAndAction } from "./outgrow";


//безопасный коридор (было [6; 9])
export const saveRange_min = 5;
export const saveRange_max = 7;




export function getActualStrategyAction(
    strategyList: Strategy[],
    turn: number,
    aiPoints: number,
    playerPoints: number,
    hands: Hands,
    values: CardValues,
    edgeValues: EdgeValues,
    setLogs: React.Dispatch<React.SetStateAction<string[]>>
): StrategyAction {

    //AGGRESSIVE
    const { w: aggressiveW, action: aggressiveAction } = getAggressiveWeightAndAction(strategyList, hands, values, edgeValues, playerPoints, aiPoints, turn); 
    //DEFENSIVE
    const { w: defensiveW, action: defensiveAction } = getDefensiveWeightAndAction(strategyList, hands, values, edgeValues, playerPoints, aiPoints, turn);
    //OUTGROW
    const { w: outgrowW, action: outgrowAction } = getOutgrowWeightAndAction(strategyList, hands, values, edgeValues, playerPoints, aiPoints, turn);
    
    //логирование
    setLogs(prev => [...prev, '-------------------']);
    setLogs(prev => [...prev, 'TURN ' + turn]);
    setLogs(prev => [...prev, "AGGR:  " + aggressiveW + ' ' + ((aggressiveAction === null) ? 'NULL' : aggressiveAction?.card.value)]);
    setLogs(prev => [...prev, "DEF:   " + defensiveW + ' ' + ((defensiveAction === null) ? 'NULL' : defensiveAction?.card.value)]);
    setLogs(prev => [...prev, "OUTGR: " + outgrowW + ' ' + ((outgrowAction === null) ? 'NULL' : outgrowAction?.card.value)]);
    
    //собираем кандидатов с их весами и действиями (только в случае, если вес стратегии неотрицательный)
    const strategyCandidates: { strategy: Strategy, w: number, action: StrategyAction }[] = [];
    if (aggressiveW > 0) strategyCandidates.push({ strategy: 'AGGRESSIVE', w: aggressiveW, action: aggressiveAction });
    if (defensiveW > 0) strategyCandidates.push({ strategy: 'DEFENSIVE', w: defensiveW, action: defensiveAction });
    if (outgrowW > 0) strategyCandidates.push({ strategy: 'OUTGROW', w: outgrowW, action: outgrowAction });

    //сортируем стратегии по убыванию веса, чтобы далее выбрать среди них лучшую
    //[при равных весах — иерархия DEFENSIVE > OUTGROW > AGGRESSIVE]
    //strategyCandidates.sort((a, b) => b.w - a.w)
    strategyCandidates.sort((a, b) => {
        if (a.w !== b.w) return b.w - a.w;
        const order = { 'DEFENSIVE': 3, 'OUTGROW': 2, 'AGGRESSIVE': 1 };
        return order[b.strategy] - order[a.strategy];
    })

    //выбор лучшей стратегии
    let bestStrategy: { strategy: Strategy, w: number, action: StrategyAction } | null = null;

    //выбираем первую удачную стратегию, у которой есть карта для розыгрыша
    for (let i = 0; i < strategyCandidates.length; i++) {
        if (strategyCandidates[i].action !== null) {
            bestStrategy = strategyCandidates[i];
            break;
        }
    }

    //если нет ни одной подходящей стратегии - сбрасываем (с учетом весов, возможно сейчас какие-то карты сбросить выгоднее)
    //[либо все веса <= 0, либо у всех стратегий нет подходящих карт для розыгрыша]
    //СЕЙЧАС ЗДЕСЬ ИСПОЛЬЗУЕТСЯ ЗАГЛУШКА
    if (bestStrategy === null) {
        const cardToDiscard = getCardToDiscard(hands.aiCommonHand);
        if (cardToDiscard === undefined) return null;
        setLogs(prev => [...prev, 'CURRENT STRAT: ' + " DISCARD"]);
        return { card: cardToDiscard, discarded: true, canceled: false};
    };
    
    //возвращаем наиболее подходящее действие
    setLogs(prev => [...prev, 'CURRENT STRAT: ' + bestStrategy.strategy + " PLAY"]);
    return bestStrategy.action;
}


//получить первую попавшуюся карту по цвету и значению относительно 0 (для сброса)
function getRandomCardToDiscard(
    shouldBePositive: boolean, 
    color: CardColor, 
    aiCommonHand: CommonCardParams[]
): CommonCardParams | undefined {
    if (shouldBePositive) return aiCommonHand.find(card => (card.value > 0 && card.color === color))
    else return aiCommonHand.find(card => (card.value < 0 && card.color === color))
}


//выбираем карту для сброса на основе полученных весов
//ПОКА ЧТО ЗАГЛУШКА - ВЫБИРАЕМ ПРОСТО СЛУЧАЙНУЮ КАРТУ ПРИМИТИВНЫМ СПОСОБОМ
function getCardToDiscard(aiCommonHand: CommonCardParams[]): CommonCardParams | undefined {
    const AiChosenCard = 
        getRandomCardToDiscard(true, 'red', aiCommonHand) || 
        getRandomCardToDiscard(false, 'red', aiCommonHand) || 
        getRandomCardToDiscard(false, 'green', aiCommonHand) || 
        getRandomCardToDiscard(true, 'green', aiCommonHand)

    return AiChosenCard;
}