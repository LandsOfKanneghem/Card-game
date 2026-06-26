import type { PtrEvent, CommonCardParams, SpecialCardParams, SpecialCardValue } from "../../types.ts"
import { AI_avatars } from "../../aiData.ts";

import DoneActionsBar from "./DoneActionsBar.tsx"
import PlayerInfo from "./PlayerInfo.tsx";
import HandView from "./HandView.tsx";
import useCardsStore from "../../store/cards.store.ts";
import useGameStateStore from "../../store/gameState.store.ts";

import img_avatar_player from '../../assets/img/portraits/hero.png';
import { LAST_TURN } from "../../config.ts";



//основной блок: карты + сыгранные карты + портреты + счет
type CardsTableProps = {
    difficulty: number, 
    toggleRulesDescription: () => void,
    turn: number,
    getSpecialCardDescription: (value: SpecialCardValue) => void,
    resetDescription: () => void,
    handleCommonCard: (e: PtrEvent, selecredCard: CommonCardParams) => void,
    handleSpecialCard: (e: PtrEvent, selecredCard: SpecialCardParams) => void,
}

export default function CardsTable({
        difficulty, 
        toggleRulesDescription,
        turn,
        getSpecialCardDescription,
        resetDescription,
        handleCommonCard,
        handleSpecialCard
    }: CardsTableProps) {

    const { playerPoints, aiPoints, playerGlobalScore, aiGlobalScore } = useGameStateStore();
    const { playerCommonHand, playerSpecialHand, playerDoneActions, aiDoneActions, aiCommonHand, aiSpecialHand } = useCardsStore();

    return (
        <div className="cards-table">
            <div className="turn-number">Ход: {turn} / {LAST_TURN}</div>
            <button className="rules-button" style={{textAlign:"center"}} onMouseDown={toggleRulesDescription}>Правила</button>

            <div className="player-block">
                <PlayerInfo 
                    img={img_avatar_player}
                    score={playerGlobalScore}
                    points={playerPoints} 
                />
                <HandView  
                    commonCards={playerCommonHand}
                    specialCards={playerSpecialHand}
                    isPlayer={true}
                    getSpecialCardDescription={getSpecialCardDescription}
                    resetDescription={resetDescription}
                    handleCommonCard={handleCommonCard}
                    handleSpecialCard={handleSpecialCard}
                />
                <DoneActionsBar 
                    doneActions={playerDoneActions}
                    getSpecialCardDescription={getSpecialCardDescription}
                    resetDescription={resetDescription}
                    isPlayer={true}
                />
            </div>

            <div className="AI-block">
                <DoneActionsBar 
                    doneActions={aiDoneActions}      
                    getSpecialCardDescription={getSpecialCardDescription}
                    resetDescription={resetDescription}
                    isPlayer={false}
                />
                <HandView  
                    commonCards={aiCommonHand}
                    specialCards={aiSpecialHand}
                    isPlayer={false}
                    getSpecialCardDescription={getSpecialCardDescription}
                    resetDescription={resetDescription}
                />            
                <PlayerInfo 
                    img={AI_avatars[difficulty]}
                    score={aiGlobalScore}
                    points={aiPoints}
                />
            </div>
        </div>
    )
}