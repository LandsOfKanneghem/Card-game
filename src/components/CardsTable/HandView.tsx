import type { PtrEvent, CommonCardParams, SpecialCardParams, SpecialCardValue } from "../../types"
import { COMMON_HAND_SIZE, SPECIAL_HAND_SIZE } from "../../config"
import Card from "./Card"

//отображение карт игрока и ИИ на доске
type HandViewProps = {
    isPlayer: boolean, 
    commonCards: CommonCardParams[], 
    specialCards: SpecialCardParams[], 
    getSpecialCardDescription: (value: SpecialCardValue) => void,
    resetDescription: () => void,
    handleCommonCard?: (e: PtrEvent, selectedCard: CommonCardParams) => void,
    handleSpecialCard?: (e: PtrEvent, selectedCard: SpecialCardParams) => void,
}

export default function HandView({isPlayer, commonCards, specialCards, getSpecialCardDescription, resetDescription, handleCommonCard, handleSpecialCard}: HandViewProps) {
    const offsetStyle = (isPlayer) ? "player-cards" : "AI-cards"

    const commonCardItems = commonCards.map((item, i) => 
        <Card   
            key={i} 
            id={item.id}
            color={item.color}
            value={item.value}
            handleClick={(e) => handleCommonCard?.(e, item)}
        />
    )
    //заполняем пустыми картами
    while (commonCardItems.length < COMMON_HAND_SIZE) {
        //чтобы React не ругался на пустые карты с одинаковым key
        const nullKey = `common-null-${commonCardItems.length}`
        commonCardItems.push(<NullCard key={nullKey} />)
    }

    const specialCardItems = specialCards.map((item, i) => 
        <Card   
            key={i} 
            id={item.id}
            color={item.color}
            value={item.value}
            handleClick={(e) => handleSpecialCard?.(e, item)}
            handlePointerOver={() => getSpecialCardDescription(item.value)}
            handlePointerOut={() => resetDescription()}
        />
    )
    //заполняем пустыми картами
    while (specialCardItems.length < SPECIAL_HAND_SIZE) {
        //чтобы React не ругался на пустые карты с одинаковым key
        const nullKey = `special-null-${specialCardItems.length}`
        specialCardItems.push(<NullCard key={nullKey} />)
    }


    return (
        <div className={`all-cards-view ${offsetStyle}`}>
            <div className="hand-view common-hand">{commonCardItems}</div>
            <div className="hand-view special-hand">{specialCardItems}</div>
        </div>   
    )
}




function NullCard() {
    return (
        <div className="null-card"></div>
    )
}