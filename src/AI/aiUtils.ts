import type { SpecialCardColor, CommonCardColor, CardColor, PlayerOptions, SpecialCardParams, CommonCardParams, SpecialCardValue } from "../types"
import type { Hands, CardValues, EdgeValues, Strategy, StrategyAction } from "./aiTypes"
import { isSpecialCard } from "../utils/gameUtils"
import { MAX_VALUE, COMMON_CARD_MAX_VALUE, LAST_TURN, COMMON_HAND_SIZE } from "../config"


//ПОЛУЧИТЬ КОНКРЕТНУЮ КАРТУ ПО СВ-ВАМ


//получить карту по точному значению и цвету
export function getCardByProps(
    value: number | SpecialCardValue | undefined, 
    color: CardColor, 
    player: PlayerOptions,
    hands: Hands,
) {
    if (value === undefined) return undefined
    if (player === 'AI') {
        if (isSpecialCard(color)) return hands.aiSpecialHand.find(card => (card.value === value && card.color === color))
        else return hands.aiCommonHand.find(card => (card.value === value && card.color === color))
    } else {
        if (isSpecialCard(color)) return hands.playerSpecialHand.find(card => (card.value === value && card.color === color))
        else return hands.playerCommonHand.find(card => (card.value === value && card.color === color))
    }
}

//проверить наличие спец карты у игрока
export function checkSpecialCard(value: SpecialCardValue, player: PlayerOptions = 'AI', hands: Hands) {
    return (player === 'AI') 
        ? hands.aiSpecialHand.find(item => item.value === value) ? true : false
        : hands.playerSpecialHand.find(item => item.value === value) ? true : false
} 


//ПОЛУЧИТЬ КОНКРЕТНУЮ КАРТУ


//выбрать лучшую карту для повышения, чтобы не выйти из безопасного диапазона
export function getBestSafeCard(
    currentPoints: number,
    maxSafePoints: number,
    hands: Hands,
    values: CardValues,
) {
    //если уже в безопасной зоне или выше - не нужно повышать
    if (currentPoints >= maxSafePoints) return;

    //максимально допустимое значение, которое можно добавить
    const maxAllowedIncrease = maxSafePoints - currentPoints;
    
    //фильтруем допустимые значения
    const safeValues = values.aiGreenValues.filter(value => value > 0 && value <= maxAllowedIncrease);
    
    if (safeValues.length === 0) return;

    //из безопасных карт выбираем максимальную (чтобы максимизировать счет)
    const bestValue = safeValues.reduce((best, current) => current > best ? current : best);

    return getCardByProps(bestValue, 'green', 'AI', hands);
}

//получить оптимальную карту для занижения (без оверкилла - это эффективно для начальных ходов)
export function getOptimalLoweringOpponentCard(playerPoints: number, hands: Hands, values: CardValues, edgeValues: EdgeValues) {
    if (edgeValues.minRedValue > 0) return;
    const sortedDownUpNegativeValues = 
        values.aiRedValues
        .filter(val => (val < 0 && -val <= playerPoints))
        .sort((a, b) => a - b);
    const optimalValue = sortedDownUpNegativeValues[0];

    return getCardByProps(optimalValue, 'red', 'AI', hands);
}

//выбор минимальной необходимой карты, чтобы перебить пороговое значение "valueToCompensate" 
//[если значение < 0 - надо выбрать положительное, если > 0 - отрицательное]
export function getCounterweightCard(valueToCompensate: number, targetPlayer: PlayerOptions, hands: Hands, values:CardValues, edgeValues: EdgeValues) {
    let counterCardValue: number;
    let counterCardColor: CommonCardColor;

    if (targetPlayer === 'AI') {
        counterCardColor = 'green';
        if (valueToCompensate < 0) {
            if (edgeValues.maxGreenValue < 0) return;
            const sortedUpGreenPositiveValues = 
                values.aiGreenValues
                .filter(val => val >= -valueToCompensate)
                .sort((a, b) => a - b);
            counterCardValue = (sortedUpGreenPositiveValues.length > 0) ? Math.min(...sortedUpGreenPositiveValues) : edgeValues.maxGreenValue;
        } else {
            if (edgeValues.minGreenValue > 0) return;
            const sortedUpGreenNegativeValues = 
                values.aiGreenValues
                .filter(val => -val >= valueToCompensate)
                .sort((a, b) => a - b);
            counterCardValue = (sortedUpGreenNegativeValues.length > 0) ? Math.max(...sortedUpGreenNegativeValues) : edgeValues.minGreenValue;
        }
    }
    else {
        counterCardColor = 'red';
        if (valueToCompensate < 0) {
            if (edgeValues.maxRedValue < 0) return;
            const sortedUpRedPositiveValues = 
                values.aiRedValues
                .filter(val => val >= -valueToCompensate)
                .sort((a, b) => a - b);
            counterCardValue = (sortedUpRedPositiveValues.length > 0) ? Math.min(...sortedUpRedPositiveValues) : edgeValues.maxRedValue;
        } else {
            if (edgeValues.minRedValue > 0) return;
            const sortedUpRedNegativeValues = 
                values.aiRedValues
                .filter(val => -val >= valueToCompensate)
                .sort((a, b) => a - b);
            counterCardValue = (sortedUpRedNegativeValues.length > 0) ? Math.max(...sortedUpRedNegativeValues) : edgeValues.minRedValue;
        }
    }

    return getCardByProps(counterCardValue, counterCardColor, 'AI', hands);
}


//ПРОВЕРКА ПЕРЕБОРА


//возможность игрока сделать перебор ИИ
export function checkAiBustThisTurn(aiPoints: number, playerRedValues: number[]): boolean {
    const playerMaxRedValue = Math.max(...playerRedValues);
    if (playerMaxRedValue < 0) return false;
    return (MAX_VALUE - aiPoints < playerMaxRedValue);
}

//возможность перебора у оппонента (немедленная победа)
export function checkPlayerBustThisTurn(
    maxRedValue: number, 
    playerPoints: number,
    hands: Hands,
): CommonCardParams | SpecialCardParams | undefined {
    if (playerPoints + maxRedValue > MAX_VALUE) return getCardByProps(maxRedValue, 'red', 'AI', hands)
    return undefined
}


//ПРОВЕРКА ПОТЕНЦИАЛА ПУША / ЗАЩИТЫ


//получить сумму очков карт данного типа
export function getCardValueSum(
    player: PlayerOptions, 
    color: CommonCardColor, 
    isPositive: boolean,
    values: CardValues,
): number {
    let res = 0;
    if (player === 'AI') {
        if (color === 'green') values.aiGreenValues.forEach(item => isPositive ? res += item : res -= item)
        if (color === 'red') values.aiRedValues.forEach(item => isPositive ? res += item : res -= item)
    }
    if (player === 'player') {
        if (color === 'green') values.playerGreenValues.forEach(item => isPositive ? res += item : res -= item)
        if (color === 'red') values.playerRedValues.forEach(item => isPositive ? res += item : res -= item)
    }
    return Math.abs(res);
}

//возможность запушить в 3 хода
export function checkPlayerBustThreeTurns(
    turn: number,
    playerPoints: number,
    values: CardValues,
) {
    const turnsLeft = LAST_TURN - turn;
    const bestAgressiveCommonAiValues: number[] = 
        values.aiRedValues
        .filter(val => val > 0)
        .sort((a, b) => b - a)
        .slice(0, Math.min(turnsLeft, values.aiRedValues.length));
    const pushPotential = bestAgressiveCommonAiValues.reduce((accumulator, current) => accumulator + current, 0);

    const bestDefensiveCommonPlayerValues: number[] = 
        values.playerGreenValues
        .filter(val => val < 0)
        .sort((a, b) => a - b)
        .slice(0, Math.min(turnsLeft, values.playerGreenValues.length));
    //значение отрицательное!
    const defPotential = bestDefensiveCommonPlayerValues.reduce((accumulator, current) => accumulator + current, 0);

    return (playerPoints + pushPotential + defPotential > MAX_VALUE);
}



//проверить, есть ли подходящая карта в данном диапазоне
//НЕКОРРЕКТНОЕ НАЗВАНИЕ. 
// export function checkCardInRange(minPointsLimit: number, maxPointsLimit: number, color: CommonCardColor) {
//     if (color === 'green') {
//         const sortedDownGreenValues = aiGreenValues.sort((a, b) => b - a)
//         if (maxPointsLimit - minPointsLimit > COMMON_CARD_MAX_VALUE) return sortedDownGreenValues[0]
//         else return sortedDownGreenValues.find(greenValue => minPointsLimit <= greenValue && greenValue <= maxPointsLimit)
//     }
// }



/*
СПИСОК НУЖНЫХ МЕТОДОВ:
countAmountOfCards - посчитать кол-во карт с заданным св-вом
getUselessCards - найти бесполезные карты для сброса

СТРАТЕГИЧЕСКИЕ МЕТОДЫ:
checkPotentialPush - насколько игрок подвержен пушу
checkPotentialDefense - насколько игрок может защититься
*/