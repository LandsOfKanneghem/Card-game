import type { GameStatus, SpecialCardValue } from "../types"
import useGameStateStore from "../store/gameState.store";
import { specialCardsData } from "../gameLogic/special cards/specialCardsData";

//описание + кнопка начала игры
type BottomBlockProps = {
    gameStatus: GameStatus, 
    handleStartGameButton: () => void,
    specialCardDescription: SpecialCardValue | null,
}

export default function BottomBlock({gameStatus, handleStartGameButton, specialCardDescription}: BottomBlockProps) {
    const roundWinner = useGameStateStore(state => state.roundWinner);
    const gameWinner = useGameStateStore(state => state.gameWinner);
    let message = null;
    const cardInfo = specialCardDescription !== null ? specialCardsData[specialCardDescription] : null;

    if (specialCardDescription === null) {
        if (gameStatus === 'discard before start') message = "Перед началом раунда можете сбросить до 3-ех карт.";
        if (gameStatus === 'round finished') {
            message = (roundWinner === 'player') ? "Победа. " : "Поражение. "
            message += "Начать следующий раунд?";
        }
        if (gameStatus === 'game finished') {
            message = (gameWinner === 'player') ? "Победа." : "Поражение."
        }
    }


    return (
        <div className="jest--bottom-block">
            { 
                cardInfo === null ? 
                (message !== null && <div className="info">{message}</div>) : 
                <div className="info">
                    <span className="bold">{cardInfo.name}</span>
                    <br/>{cardInfo.description}
                    {cardInfo.specialDescription && <><br/>{cardInfo.specialDescription}</>}
                </div>
            }
            {
                (gameStatus === 'discard before start' || gameStatus === 'round finished') &&
                specialCardDescription === null && 
                <button 
                    className="jest--bottom-block--start--button"
                    onMouseDown={() => handleStartGameButton()}
                >
                        Начать
                </button>
            }
        </div>
    )
}