import type { SpecialCardValue, PlayerOptions } from "../../types"
import useGameStateStore from "../../store/gameState.store"
import useCardsStore from "../../store/cards.store";
import { startDiscardPhase } from "../discardPhase";

export const specialCardEffects: Record<SpecialCardValue, (player: PlayerOptions) => void> = {
    'coin': (player: PlayerOptions) => {
        const playerCommonHand = useCardsStore.getState().playerCommonHand;
        if (playerCommonHand.length < 3) return;

        const addActiveEffect = useGameStateStore.getState().addActiveEffect;
        addActiveEffect(player, 'coin');
        startDiscardPhase(3);
    },
    'inversion': () => {
        console.log('INVERSION')
    },
    'joker': () => {
        
    },
    'cancel': () => {
        
    },
    'clover': () => {
        
    },
    'truce': () => {
        
    },
    'sprint': () => {
        
    },
    'swap': () => {
        
    },
    'hourglass': () => {
        
    },
    'champion': () => {
        
    },
    'plague': () => {
        
    },
}