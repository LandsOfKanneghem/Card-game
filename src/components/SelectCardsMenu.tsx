import React from "react"
import type { PtrEvent, CommonCardParams, SpecialCardParams, SpecialCardValue, CardColor } from "../types"
import Card from "./CardsTable/Card"
import SpCardDescription from "./SpCardDescription"
import useGameStateStore from "../store/gameState.store"





//выбор карт из колоды
type SelectCardsMenuProps = {
    offsetFromTop: string,
    deck: CommonCardParams[] | SpecialCardParams[],
    counter: number,
    maxCounter: number,
    setCounter: React.Dispatch<React.SetStateAction<number>>,
    setSelectedCards: React.Dispatch<React.SetStateAction<CommonCardParams[] | SpecialCardParams[]>>,
    setChoiceAccepted: React.Dispatch<React.SetStateAction<boolean>>,
    getSpecialCardDescription: (value: SpecialCardValue) => void,
}

export default function SelectCardsMenu({offsetFromTop, deck, counter, maxCounter, setCounter, setSelectedCards, setChoiceAccepted, getSpecialCardDescription, resetDescription}: SelectCardsMenuProps) {
    const gameStatus = useGameStateStore(state => state.gameStatus)
    
    //вывод колоды, из которой происходит выбор карт
    function initAllCards(): (CommonCardParams | SpecialCardParams)[] {
        const deck_redCards: CommonCardParams[] = []
        const deck_greenCards: CommonCardParams[] = []
        const deck_specialCards: SpecialCardParams[] = []

        deck.forEach(item => {
            if (item.color === 'green') deck_greenCards.push(item)
            else if (item.color === 'red') deck_redCards.push(item)
            else if (item.color === 'blue' || item.color === 'purple') deck_specialCards.push(item)
        })

        deck_greenCards.sort((a, b) => a.value - b.value)
        deck_redCards.sort((a, b) => a.value - b.value)
        const deck_allCards = [...deck_specialCards, ...deck_greenCards, ...deck_redCards]
        return deck_allCards.map(item => {return {...item, isSelected: false}})
    }

    function acceptChoice() {
        setSelectedCards(local_selectedCards)
        setChoiceAccepted(true)
    }

    function checkIfCardWasChosen(id: string) {
        const thisCard = deck_allCards.find(item => item.id === id)
        return (thisCard?.isSelected) ? true : false
    }

    function chooseCard(e: PtrEvent, id: string, value: number | SpecialCardValue, color: CardColor) {
        e.preventDefault()
        if (checkIfCardWasChosen(id)) {
            setCounter(prevState => prevState - 1)
            setDeck_allCards(prevState => prevState.map(item => (item.id === id) ? {...item, isSelected: false} : item))
            setLocal_selectedCards(prevState => prevState.filter(item => item.id !== id))
        }
        else {
            if (local_selectedCards.length === maxCounter) return
            setCounter(prevState => prevState + 1)
            setDeck_allCards(prevState => prevState.map(item => (item.id === id) ? {...item, isSelected: true} : item))
            setLocal_selectedCards(prevState => [...prevState, {id, value, color}])
        }
        setChoiceAccepted(false)
    }

    const [deck_allCards, setDeck_allCards] = React.useState<(CommonCardParams | SpecialCardParams)[]>(initAllCards())
    const [local_selectedCards, setLocal_selectedCards] = React.useState<CommonCardParams[] | SpecialCardParams[]>([])
    const [description, setDescription] = React.useState<[string, string] | null>(null)

    const generalDeckItems = deck_allCards.map((item, i) => 
        <Card   
            key={i} 
            id={item.id}
            color={item.color}
            value={item.value}
            isSmall={true}
            isSelected={item.isSelected}
            handleClick={chooseCard}
            handlePointerOver={() => getSpecialCardDescription(item.value)}
            handlePointerOut={() => () => resetDescription()}
        />)

    const bottomBlockMsg = (gameStatus === 'before start') ? 
        "Можно выбрать 0-3 особых карт для следующего раунда" :
        "Необходимо выбрать " + maxCounter + " карты из общей колоды"
    
    const bottomBlockStyle = "info choose-cards--top-block"

    return (
        <div className="select-cards--menu">
            {description && <SpCardDescription description={description} offsetFromTop={offsetFromTop}/>}
            <button className="select-cards--button"
                    onMouseDown={() => acceptChoice()}>
                <div id="tick-mark"></div>
            </button>
            {generalDeckItems}
            <div className={bottomBlockStyle}>
                {bottomBlockMsg}.<br/>
                Выбрано {counter}/{maxCounter} карт.
            </div>
        </div>
    )
}