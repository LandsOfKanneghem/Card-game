import { processTurn } from './processTurn';
import useGameStateStore from '../store/gameState.store';


class GameLoop {
    private aiTimeout: number | null = null;
    private isProcessing: boolean = false;

    //PRIVATE

    //очистка таймера
    private clearAiTimer() {
        if (this.aiTimeout) {
            clearTimeout(this.aiTimeout);
            this.aiTimeout = null;
        }
    }

    //ход ИИ
    private executeAITurn(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
        if (this.isProcessing) return;
        
        const { currentPlayer, gameStatus } = useGameStateStore.getState();
        if (currentPlayer !== 'AI' || gameStatus !== 'started') return;
        
        this.isProcessing = true;
        
        try {
            //вызываем processTurn без action (AI сам выберет действие)
            processTurn(setLogs);
        } finally {
            this.isProcessing = false;
            this.aiTimeout = null;
        }
    }

    //PUBLIC

    //сброс состояния в начале нового раунда
    public reset() {
        this.clearAiTimer();
        this.isProcessing = false;
    }

    //запуск хода ИИ с задержкой
    public scheduleAITurn(delay: number = 500, setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
        const { currentPlayer, gameStatus } = useGameStateStore.getState();
        if (currentPlayer !== 'AI' || gameStatus !== 'started') return;

        this.clearAiTimer();
        this.aiTimeout = window.setTimeout(() => {
            this.executeAITurn(setLogs);
        }, delay);
    }

    //проверка, может ли игрок сделать ход
    public canPlayerAct(): boolean {
        const { currentPlayer, gameStatus } = useGameStateStore.getState();
        return currentPlayer === 'player' && 
               gameStatus === 'started' && 
               !this.aiTimeout &&
               !this.isProcessing;
    }

    //проверка, может ли игрок взаимодействовать со спец картами
    //(здесь происходит проверка на спец эффекты, которые блокируют взаимодействие со спец картами)
    public canPlayerHandleSpecialCard(): boolean {
        const checkActiveEffects = useGameStateStore.getState().checkActiveEffects;

        return !checkActiveEffects('player', ['coin', 'clover']);
    }
}


export const gameLoop = new GameLoop();