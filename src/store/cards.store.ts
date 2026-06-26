import { create } from 'zustand';
import { COMMON_HAND_SIZE, COMMON_CARD_DUPLICATES, COMMON_CARD_MAX_VALUE } from '../config';
import type { CommonCardParams, SpecialCardParams, DoneAction, PlayerOptions } from '../types';
import { shuffleArr } from '../utils/utils';


//вспомогательная фунция - инициализация колоды
const initGeneralDeck = () => {
    const deck: CommonCardParams[] = []
    let count = 0
    for (let i = 1; i <= COMMON_CARD_MAX_VALUE; i++) {
        //сколько раз добавить
        for (let k = 1; k <= COMMON_CARD_DUPLICATES; k++) {
            deck.push({type: "common", color: "green", value: i, id: (count++).toString()})
            deck.push({type: "common", color: "red", value: -i, id: (count++).toString()})
            deck.push({type: "common", color: "green", value: -i, id: (count++).toString()})
            deck.push({type: "common", color: "red", value: i, id: (count++).toString()})
        }     
    }
    for (let i = 0; i < 3; i++) shuffleArr(deck)
    return deck
}

//вспомогательная функция - сортировка карт в руке для более удобного отображения
const sortCommonCardsInHand = (commonHand: CommonCardParams[]) => {
    const redCards: CommonCardParams[] = [];
    const greenCards: CommonCardParams[] = [];

    commonHand.forEach(item => {
        if (item.color === 'green') greenCards.push(item);
        else if (item.color === 'red') redCards.push(item);
    });
    greenCards.sort((a, b) => a.value - b.value);
    redCards.sort((a, b) => a.value - b.value);
    
    return [...greenCards, ...redCards];
}


type CardsStore = {
    generalDeck: CommonCardParams[],//общая колода 
    playerCommonHand: CommonCardParams[],//обычная рука игрока
    playerSpecialHand: SpecialCardParams[],//особая рука игрока
    playerDoneActions: DoneAction[],//выполненные действия игрока (действие = сыгранная карта или сброс)
    aiCommonHand: CommonCardParams[],//обычная рука ИИ 
    aiSpecialHand: SpecialCardParams[],//особая рука ИИ 
    aiDoneActions: DoneAction[],//выполненные действия ИИ (действие = сыгранная карта или сброс)

    dealCards: () => void,
    discardOrPlay: (selectedCard: DoneAction, player: PlayerOptions) => void,
    removePlayerCommonCard: (id: string) => void,
    takeCardsFromDeck: (count: number) => void,
    removeAiCommonCard: (id: string) => void,
}

const useCardsStore = create<CardsStore>((set, get) => ({
    generalDeck: [],
    playerCommonHand: [], 
    playerSpecialHand: [],
    playerDoneActions: [],
    aiCommonHand: [], 
    aiSpecialHand: [], 
    aiDoneActions: [],

    //инициализация колоды и раздача карт игрокам в начале раунда
    dealCards: () => {
        const newGeneralDeck = initGeneralDeck(); 
        let newPlayerHand = [], newAiHand = [];
        
        if (!newGeneralDeck?.length) return
        
        for (let i = 0; i < COMMON_HAND_SIZE; i++) {
            newPlayerHand.push(newGeneralDeck.pop()!)
            newAiHand.push(newGeneralDeck.pop()!)
        }
        newPlayerHand = sortCommonCardsInHand(newPlayerHand);
        newAiHand = sortCommonCardsInHand(newAiHand);

        set({ generalDeck: newGeneralDeck, playerCommonHand: newPlayerHand, playerDoneActions: [], aiCommonHand: newAiHand, aiDoneActions: [] })
    },

    //сбросить карту и взять из колоды [cardWasDiscarded - была ли карта разыграна или просто сброшена]
    //если карта сброшена - она не отображается в разыгранных картах (и ее нельзя отменить)
    discardOrPlay: (doneAction: DoneAction, player: PlayerOptions) => {
        const { generalDeck, playerCommonHand, playerDoneActions, aiCommonHand, aiDoneActions } = get()
        //если колода закончилась, карты не добавляем
        const topDeckCard = (generalDeck.length) ? {...generalDeck[generalDeck.length - 1]} : undefined
        const newGeneralDeck = (generalDeck.length) ? generalDeck.slice(0, -1) : []
        //const newAction: DoneAction = {...selectedCard, discarded: cardWasDiscarded, canceled: false}

        if (player === 'player') {
            const handWithoutCard = playerCommonHand.filter((card: CommonCardParams) => card.id !== doneAction.card.id)
            let newCommonHand = (topDeckCard) ? [...handWithoutCard, topDeckCard] : handWithoutCard
            newCommonHand = sortCommonCardsInHand(newCommonHand)
            set({ generalDeck: newGeneralDeck, playerCommonHand: newCommonHand, playerDoneActions: [...playerDoneActions, doneAction]})
        } else {
            const handWithoutCard = aiCommonHand.filter((card: CommonCardParams) => card.id !== doneAction.card.id)
            let newCommonHand = (topDeckCard) ? [...handWithoutCard, topDeckCard] : handWithoutCard
            newCommonHand = sortCommonCardsInHand(newCommonHand)
            set({ generalDeck: newGeneralDeck, aiCommonHand: newCommonHand, aiDoneActions: [...aiDoneActions, doneAction]})
        }
    },
    removePlayerCommonCard: (id) => set({ playerCommonHand: get().playerCommonHand.filter(card => card.id !== id)}),
    removeAiCommonCard: (id) => set({ aiCommonHand: get().aiCommonHand.filter(card => card.id !== id)}),
    takeCardsFromDeck: (count: number) => {
        if (count <= 0) return
        const { generalDeck, playerCommonHand } = get()
        const lastGlobalCards = generalDeck.slice(-count)
        const newDeck = generalDeck.slice(0, -count)
        const playerNewCommonHand = sortCommonCardsInHand([...playerCommonHand, ...lastGlobalCards]);
        set({ generalDeck: newDeck, playerCommonHand: playerNewCommonHand })
    },
}));

export default useCardsStore;