import React from "react";
import { specialCardsData } from "./specialCards";
import Logs from "./components/TESTS/Logs";
import Tests from "./components/TESTS/Tests";
import DifficultySelector from "./components/DifficultySelector";
import GameRules from "./components/GameRules";
import Content from "./components/Content";
import SpCardParamsSetter from "./components/SpCardParamsSetter";
import SelectCardsMenu from "./components/SelectCardsMenu";
import type { CommonCardParams, PtrEvent, SpecialCardParams, SpecialCardValue } from "./types";
import useGameStateStore from "./store/gameState.store";
import useCardsStore from "./store/cards.store";

import { processTurn } from "./gameLogic/processTurn";
import { prepareForNewRound, startGame } from "./gameLogic/newRound";
import { gameLoop } from "./gameLogic/gameLoop";
import { discardCardInDiscardPhase } from "./gameLogic/discardPhase";
import { startDummyGame } from "./gameLogic/testDummyGame";

import './styles/CardGame.scss';

export default function UserInterface() {
    //логи
    const [logs, setLogs] = React.useState<string[]>([]);
    const [dummyAi, setDummyAi] = React.useState<null | 'AGGRO' | 'OUTGROW'>(null);

    //выбор режима сложности (ВРЕМЕННО)
    //КАК НАДО: сложность передается в зависимости от того, с кем играешь
    const [difficulty, setDifficulty] = React.useState<number | null>(null);

    const [rulesOn, setRulesOn] = React.useState(false);

    //НЕ УВЕРЕН, ЧТО ЭТО СЕЙЧАС НАДО
    const [offsetFromTop, setOffsetFromTop] = React.useState("0");
    
    //выбор карт (из колоды, при розыгрыше спец карты) [ЧТО-ТО БУДЕТ ВЫНЕСЕНО В ИГРОВУЮ ЛОГИКУ]
    const [selectedCards, setSelectedCards] = React.useState<CommonCardParams[] | SpecialCardParams[]>([])
    const [choiceAccepted, setChoiceAccepted] = React.useState(false)//подтвердили выбор
    const [specialCardParams, setSpecialCardParams] = React.useState<CommonCardParams | null>(null)//выбор хар-к спец карты
    const [specialCardState, setSpecialCardState] = React.useState(null)//состояние спец карты (зависит от разыгранной спец карты)

    const {
        currentPlayer,
        gameStatus,
        turn,
        setAiLevel,
        setGameStatus
    } = useGameStateStore();

    const { generalDeck } = useCardsStore();

    //ЭФФЕКТЫ

    //инициализация сложности
    React.useEffect(() => {
        if (difficulty !== null) {
            setAiLevel(difficulty);
            prepareForNewRound();
        }
    }, [difficulty, setAiLevel, setGameStatus]);

    //обновление оффсета при выборе карт
    React.useEffect(() => {
        if (gameStatus === 'choosing cards from deck') {
            const cardsListBlock = document.getElementsByClassName("select-cards--menu")[0];
            if (cardsListBlock) {
                const computedStyle = getComputedStyle(cardsListBlock).getPropertyValue("height");
                setOffsetFromTop(computedStyle);
            }
        }
    }, [gameStatus]);

    //ОБРАБОТЧИКИ

    //клик по обычной карте
    const handleCommonCard = (e: PtrEvent, selectedCard: CommonCardParams) => {
        e.preventDefault();
        
        //только ЛКМ или ПКМ
        if (e.nativeEvent.button !== 0 && e.nativeEvent.button !== 2) return;

        if (gameStatus === 'round finished' || gameStatus === 'game finished') return;

        //режим сброса карт перед началом игры
        if (gameStatus === 'discard before start') {
            discardCardInDiscardPhase(selectedCard.id);
        }
        
        //в режиме dummyAi игроком управляет AI, игнорируем клики
        if (dummyAi !== null) return;
        
        //может ли игрок ходить
        if (!gameLoop.canPlayerAct()) return;

        const discarded = e.nativeEvent.button === 2;

        if (currentPlayer === 'player' && gameStatus === 'started') {
            processTurn(setLogs, {
                card: selectedCard, 
                discarded, 
                canceled: false
            });
        }
    };

    //клик по спецкарте
    const handleSpecialCard = (e: PtrEvent, selectedCard: SpecialCardParams) => {
        e.preventDefault();
        if (!gameLoop.canPlayerAct()) return;
        if (dummyAi !== null) return;
        
        console.log('Special card clicked:', selectedCard);
    };

    //получить описание особой карты
    // const getSpecialCardDescription = React.useCallback((value: SpecialCardValue) => {
    //     const specialCardInfo = specialCardsData[value];
    //     if (specialCardInfo) {
    //         setDescription([specialCardInfo.name, specialCardInfo.description]);
    //     }
    // }, []);

    // //сброс описания
    // const resetDescription = React.useCallback(() => {
    //     setDescription(null);
    // }, []);

    //переключение правил
    const toggleRulesDescription = React.useCallback(() => {
        setRulesOn(prev => !prev);
    }, []);

    //обработчик кнопки "Начать игру"
    const handleStartGameButton = () => {
        if (gameStatus === 'discard before start') startGame();
        if (gameStatus === 'round finished') prepareForNewRound();
    };

    //обработчик для режима dummyAi (можно вызвать только в режиме сброса карт перед началом раунда)
    const handleStartDummyGameButton = (value: 'AGGRO' | 'OUTGROW') => {
        setDummyAi(value);
        if (value !== null && gameStatus === 'discard before start') startDummyGame(value);
    };


    //ВСПОМОГАТЕЛЬНЫЕ ПЕРЕМЕННЫЕ
    const viewGameStyle = rulesOn ? "hide" : "";
    const contentWrapperStyle = gameStatus === 'choosing cards from deck' ? "hide" : "";


    //ТЕСТ
    //console.log(gameStatus)

    return (
        <div className='game-app' onContextMenu={(e) => e.preventDefault()}>
            <Logs logs={logs} />
            <Tests 
                setLogs={setLogs} 
                handleStartDummyGameButton={handleStartDummyGameButton} 
            />

            {rulesOn && <GameRules toggleRulesDescription={toggleRulesDescription} />}
            
            <div className={viewGameStyle}>
                {/* Выбор сложности */}
                {difficulty === null && <DifficultySelector setDifficulty={setDifficulty} />}
                
                {difficulty !== null && (
                    <>
                        {gameStatus === 'choosing cards from deck' && (
                            <SelectCardsMenu
                                offsetFromTop={offsetFromTop}
                                deck={generalDeck}
                                setSelectedCards={setSelectedCards}
                                setChoiceAccepted={setChoiceAccepted}
                            />
                        )}

                        {(specialCardState === 'joker_state' || specialCardState === 'champion_state') && (
                            <SpCardParamsSetter
                                setSpecialCardParams={setSpecialCardParams}
                                specialCardState={specialCardState}
                            />
                        )}

                        {gameStatus !== 'choosing cards from deck' && (
                            <div className={contentWrapperStyle}>
                                <Content
                                    difficulty={difficulty}
                                    toggleRulesDescription={toggleRulesDescription}
                                    gameStatus={gameStatus}
                                    turn={turn}
                                    handleCommonCard={handleCommonCard}
                                    handleSpecialCard={handleSpecialCard}
                                    handleStartGameButton={handleStartGameButton}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}