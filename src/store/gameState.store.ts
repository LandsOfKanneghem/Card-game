import { create } from 'zustand';
import type { GameStatus, PlayerOptions, WinnerOptions, SpecialCardEffect } from '../types';

type GameStateStore = {
    aiLevel: number | null;
    gameWinner: WinnerOptions | null;
    roundWinner: WinnerOptions | null;
    turn: number;
    currentPlayer: PlayerOptions | null;
    gameStatus: GameStatus;
    playerGlobalScore: number;
    playerPoints: number;
    prevPlayerPoints: number;
    aiGlobalScore: number;
    aiPoints: number;
    prevAiPoints: number;
    discardCount: number | null;
    maxDiscardCount: number | null;
    //состояния игроков от розыгранных спец карт
    playerActiveEffects: SpecialCardEffect[];
    aiActiveEffects: SpecialCardEffect[];
    
    setAiLevel: (value: number | null) => void;
    setGameWinner: (value: WinnerOptions | null) => void;
    setRoundWinner: (value: WinnerOptions | null) => void;
    setTurn: (value: number) => void;
    setCurrentPlayer: (value: PlayerOptions | null) => void;
    setGameStatus: (value: GameStatus) => void;
    setPlayerGlobalScore: (value: number) => void;
    setPlayerPoints: (value: number) => void;
    setPrevPlayerPoints: (value: number) => void;
    setAiGlobalScore: (value: number) => void;
    setAiPoints: (value: number) => void;
    setPrevAiPoints: (value: number) => void;
    setDiscardCount: (value: number | null) => void;
    setMaxDiscardCount: (value: number | null) => void;

    incrementPlayerGlobalScore: () => void;
    incrementAiGlobalScore: () => void;
    resetRoundData: () => void;

    addActiveEffect: (player: PlayerOptions, effect: SpecialCardEffect) => void,
    removeActiveEffect: (player: PlayerOptions, effect: SpecialCardEffect) => void,
    checkActiveEffects: (player: PlayerOptions, effects: SpecialCardEffect[]) => boolean,
}

const useGameStateStore = create<GameStateStore>((set, get) => ({
    aiLevel: null,
    gameWinner: null,
    roundWinner: null,
    turn: 1,
    currentPlayer: null,
    gameStatus: null,
    playerGlobalScore: 0,
    playerPoints: 0,
    prevPlayerPoints: 0,
    aiGlobalScore: 0,
    aiPoints: 0,
    prevAiPoints: 0,
    discardCount: null,
    maxDiscardCount: null,
    playerActiveEffects: [],
    aiActiveEffects: [],
    
    setAiLevel: (value) => set({ aiLevel: value }),
    setGameWinner: (value) => set({ gameWinner: value }),
    setRoundWinner: (value) => set({ roundWinner: value }),
    setTurn: (value) => set({ turn: value }),
    setCurrentPlayer: (value) => set({ currentPlayer: value }),
    setGameStatus: (value) => set({ gameStatus: value }),
    setPlayerGlobalScore: (value) => set({ playerGlobalScore: value }),
    setPlayerPoints: (value) => set({ playerPoints: value }),
    setPrevPlayerPoints: (value) => set({ prevPlayerPoints: value }),
    setAiGlobalScore: (value) => set({ aiGlobalScore: value }),
    setAiPoints: (value) => set({ aiPoints: value }),
    setPrevAiPoints: (value) => set({ prevAiPoints: value }),
    setDiscardCount: (value) => set({ discardCount: value }),
    setMaxDiscardCount: (value) => set({ maxDiscardCount: value }),

    incrementPlayerGlobalScore: () => set({ playerGlobalScore: get().playerGlobalScore + 1 }),
    incrementAiGlobalScore: () => set({ aiGlobalScore: get().aiGlobalScore + 1 }),
    
    //сброс данных в начале раунда
    resetRoundData: () => set({
        roundWinner: null,
        turn: 1,
        currentPlayer: null,
        gameStatus: null,
        playerPoints: 0,
        prevPlayerPoints: 0,
        aiPoints: 0,
        prevAiPoints: 0,
        discardCount: null,
        maxDiscardCount: null,
        playerActiveEffects: [],
        aiActiveEffects: [],
    }),

    addActiveEffect: (player: PlayerOptions, effect: SpecialCardEffect) => {
        if (player === 'player') {
            const currentEffects = get().playerActiveEffects;
            if (!currentEffects.includes(effect)) set({ playerActiveEffects: [...currentEffects, effect] });
        }
        else if (player === 'AI') {
            const currentEffects = get().aiActiveEffects;
            if (!currentEffects.includes(effect)) set({ aiActiveEffects: [...currentEffects, effect] });
        }
        else return;
    },
    removeActiveEffect: (player: PlayerOptions, effect: SpecialCardEffect) => {
        if (player === 'player') set({ playerActiveEffects: get().playerActiveEffects.filter(item => item !== effect) });
        else if (player === 'AI') set({ aiActiveEffects: get().aiActiveEffects.filter(item => item !== effect) });
        else return;
    },
    checkActiveEffects: (player: PlayerOptions, effects: SpecialCardEffect[]): boolean => {
        if (player === 'player') {
            const activeEffects = get().playerActiveEffects;
            return effects.some(effect => activeEffects.includes(effect));
        } else if (player === 'AI') {
            const activeEffects = get().aiActiveEffects;
            return effects.some(effect => activeEffects.includes(effect));
        }
        return false;
    },
}));

export default useGameStateStore;