import type { PtrEvent, SpecialCardValue, CommonCardParams, SpecialCardParams, GameStatus } from "../types"
import CardsTable from "./CardsTable/CardsTable"
import BottomBlock from "./BottomBlock"
import React from "react"


//основной контент: основной блок + нижний блок
type ContentProps = {
    difficulty: number, 
    toggleRulesDescription: () => void,
    gameStatus: GameStatus,
    turn: number,
    handleCommonCard: (e: PtrEvent, selectedCard: CommonCardParams) => void,
    handleSpecialCard: (e: PtrEvent, selectedCard: SpecialCardParams) => void,
    handleStartGameButton: () => void,
    specialCardDescription: SpecialCardValue | null,
    resetDescription: () => void,
    getSpecialCardDescription: (value: SpecialCardValue) => void,
}

export default function Content({
    difficulty, 
    toggleRulesDescription,
    gameStatus,
    turn,
    handleCommonCard,
    handleSpecialCard,
    handleStartGameButton,
    specialCardDescription,
    resetDescription,
    getSpecialCardDescription
}: ContentProps) {

    const BottomBlockIsDisplayed = 
        gameStatus === 'discard before start' || 
        gameStatus === 'round finished' ||
        gameStatus === 'game finished' ||
        specialCardDescription !== null;

    return (
        <div className="content">
            <CardsTable  
                difficulty={difficulty}
                toggleRulesDescription={toggleRulesDescription}
                turn={turn}
                getSpecialCardDescription={getSpecialCardDescription}
                resetDescription={resetDescription}
                handleCommonCard={handleCommonCard}
                handleSpecialCard={handleSpecialCard}
            />
            {BottomBlockIsDisplayed && 
            <BottomBlock 
                gameStatus={gameStatus}
                handleStartGameButton={handleStartGameButton}
                specialCardDescription={specialCardDescription}
            />}
        </div>
    )
}