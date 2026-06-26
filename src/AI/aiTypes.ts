import type { CommonCardParams, SpecialCardParams } from "../types"


export type Hands = {
    aiCommonHand: CommonCardParams[], 
    aiSpecialHand: SpecialCardParams[], 
    playerCommonHand: CommonCardParams[], 
    playerSpecialHand: SpecialCardParams[]
}

export type CardValues = {
    aiGreenValues: number[], 
    aiRedValues: number[], 
    playerGreenValues: number[], 
    playerRedValues: number[]
}

//пороговые значения
export type EdgeValues = {
    maxRedValue: number, 
    maxGreenValue: number, 
    minRedValue: number, 
    minGreenValue: number
}

export type Strategy = 'AGGRESSIVE' | 'DEFENSIVE' | 'OUTGROW'

export type StrategyAction = {
    card: CommonCardParams | SpecialCardParams,
    discarded: boolean,
    canceled?: boolean
} | null