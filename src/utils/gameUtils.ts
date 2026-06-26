import { COMMON_CARD_DUPLICATES, COMMON_CARD_MAX_VALUE } from "../config"
import type { CardColor, CommonCardParams, SpecialCardValue } from "../types"
import { shuffleArr } from "./utils"

//является ли карта особой
export function isSpecialCard(color: CardColor): boolean {
    return (color === 'blue' || color === 'purple')
}

//является ли особая карта пурпурной
export function isPurpleCard(value: SpecialCardValue | number) {
    return (value === 'champion' || value === 'plague' || value === 'hourglass' || value === 'swap') ? true : false
}

//задать спец карты игрока в зависимости от уровня ИИ
export function initSpecialDeck_player(difficulty: number) {}

//обновление спец руку ИИ в начале раунда
export function setSpecialHandForNewRound_AI() {}

//выбор спец руки из всех спец карт игрока перед началом раунда
export function setSpecialHandForNewRound_player() {}