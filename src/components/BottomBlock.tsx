import type { GameStatus } from "../types"
import useGameStateStore from "../store/gameState.store";

//описание + кнопка начала игры
type BottomBlockProps = {
    gameStatus: GameStatus, 
    handleStartGameButton: () => void,
}

export default function BottomBlock({gameStatus, handleStartGameButton}: BottomBlockProps) {
    const roundWinner = useGameStateStore(state => state.roundWinner);
    const gameWinner = useGameStateStore(state => state.gameWinner);
    let message = null;

    if (gameStatus === 'discard before start') message = "Перед началом раунда можете сбросить до 3-ех карт.";
    if (gameStatus === 'round finished') {
        message = (roundWinner === 'player') ? "Победа. " : "Поражение. "
        message += "Начать следующий раунд?";
    }
    if (gameStatus === 'game finished') {
        message = (gameWinner === 'player') ? "Победа." : "Поражение."
    }

    return (
        <div className="jest--bottom-block">
            {message !== null && <div className="info">{message}</div>}
            {(gameStatus === 'discard before start' || gameStatus === 'round finished') && 
            <button className="jest--bottom-block--start--button"
                    onMouseDown={() => handleStartGameButton()}>
                    Начать
            </button>}
        </div>
    )
}