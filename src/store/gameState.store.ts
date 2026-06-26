import { create } from 'zustand';
import type { GameStatus, PlayerOptions, WinnerOptions } from '../types';

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
    }),
}));

export default useGameStateStore;