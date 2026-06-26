import type { SpecialCardValue, CommonCardParams, SpecialCardParams, CardColor, DoneAction, CommonCardColor, PlayerOptions } from "../../types"
import type { Hands, EdgeValues } from "../aiTypes"
import * as AI_UTILS from '../aiUtils'
import useCardsStore from "../../store/cards.store";
import useGameStateStore from "../../store/gameState.store";





export function dummyAiChooseAction(
    dummyAiStrategy: null | 'AGGRO' | 'OUTGROW',                           
): DoneAction | undefined {
    if (dummyAiStrategy === null) return undefined;
    if (dummyAiStrategy !== 'AGGRO' && dummyAiStrategy !== 'OUTGROW') return undefined;

    const { aiCommonHand, aiSpecialHand, playerCommonHand, playerSpecialHand } = useCardsStore.getState();
    const aiPoints = useGameStateStore.getState().aiPoints;

    const hands: Hands = {aiCommonHand, aiSpecialHand, playerCommonHand, playerSpecialHand};
    const playerRedValues: number[] = playerCommonHand.filter(item => item.color === 'red').map(item => item.value)
    const playerGreenValues: number[] = playerCommonHand.filter(item => item.color === 'green').map(item => item.value)
    
    const maxRedValue = Math.max(...playerRedValues);
    const maxGreenValue = Math.max(...playerGreenValues);
    const minRedValue = Math.min(...playerRedValues);
    const minGreenValue = Math.min(...playerGreenValues);
    const edgeValues = {maxRedValue, maxGreenValue, minRedValue, minGreenValue};
    
    if (dummyAiStrategy === 'AGGRO') return getAggroAction(hands, edgeValues);
    if (dummyAiStrategy === 'OUTGROW') return getOutgrowAction(hands, edgeValues, aiPoints);
}

function getAggroAction(
    hands: Hands,
    edgeValues: EdgeValues,  
): DoneAction {
    if (edgeValues.maxRedValue < 0) return {card: {...hands.playerCommonHand[0]}, discarded: true, canceled: false};
    else {
        const bestCard: CommonCardParams = AI_UTILS.getCardByProps(edgeValues.maxRedValue, 'red', 'player', hands) as CommonCardParams;
        return {card: {...bestCard}, discarded: false, canceled: false};
    }
}

function getOutgrowAction(
    hands: Hands,
    edgeValues: EdgeValues, 
    aiPoints: number, 
): DoneAction {
    if (edgeValues.maxGreenValue < 0 && edgeValues.minRedValue > 0) return {card: {...hands.playerCommonHand[0]}, discarded: true, canceled: false};
    else {
        let bestCard;
        let discarded = false;
        if (edgeValues.maxGreenValue > 0) bestCard = AI_UTILS.getCardByProps(edgeValues.maxGreenValue, 'green', 'player', hands) as CommonCardParams;
        else if (edgeValues.minRedValue < 0 && aiPoints > 0) bestCard = AI_UTILS.getCardByProps(edgeValues.minRedValue, 'red', 'player', hands) as CommonCardParams;
        else if (edgeValues.minGreenValue < 0) {
            bestCard = AI_UTILS.getCardByProps(edgeValues.minGreenValue, 'green', 'player', hands) as CommonCardParams;
            discarded = true;
        } else {
            bestCard = AI_UTILS.getCardByProps(edgeValues.maxRedValue, 'red', 'player', hands) as CommonCardParams;
            discarded = true;
        }
        return {card: {...bestCard}, discarded, canceled: false};
    }
}


