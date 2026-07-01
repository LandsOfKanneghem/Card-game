import React from "react"
import type { PtrEvent, CardColor, SpecialCardValue } from "../../types"
import { specialCardsData } from "../../gameLogic/special cards/specialCardsData"
import { isSpecialCard } from "../../utils/gameUtils"

import ARROW_UP from '../../assets/img/common card/arrow-up.svg'
import ARROW_DOWN from '../../assets/img/common card/arrow-down.svg'



// function toRoman(value: number): string {
//     if (![4, 3, 2, 1, -1, -2, -3, -4].includes(value)) return '';
//     else
//     switch (value) {
//         case 1: return 'I';
//         case 2: return 'II';
//         case 3: return 'III';
//         case 4: return 'IV';
//         case -1: return '-I';
//         case -2: return '-II';
//         case -3: return '-III';
//         case -4: return '-IV';
//         default: return '';
//     }
// }

function toRoman(value: number): string {
    if (![4, 3, 2, 1, -1, -2, -3, -4].includes(value)) return '';
    else
    switch (value) {
        case 1: return 'I';
        case 2: return 'II';
        case 3: return 'III';
        case 4: return 'IV';
        case -1: return 'I';
        case -2: return 'II';
        case -3: return 'III';
        case -4: return 'IV';
        default: return '';
    }
}


type CardProps = {
    id: string,
    color: CardColor,
    value: number | SpecialCardValue,
    isSmall?: boolean,
    isSelected?: boolean,
    handleClick?: (e: PtrEvent, id: string, value: number | SpecialCardValue, color: CardColor) => void,
    handlePointerOver?: (value: number | SpecialCardValue) => void,
    handlePointerOut?: () => void,
}

export default function Card({id, color, value, isSmall, isSelected, handleClick, handlePointerOver, handlePointerOut}: CardProps) {
    //const strValue = (value !== null) ? value : ""
    const strValue = (value !== null && typeof value === 'number') ? toRoman(value) : ""
    //const sign = (typeof value === 'number' && value > 0) ? "+" : ""
    let isPositive: (boolean | null) = null;//карта прибавляет очки или убавляет
    if (typeof value === 'number') isPositive = (value > 0) ? true : false;

    let itemStyle = (value !== null) ? "card " + color : "null-card"
    let itemValueStyle = (value !== null) ? "card-value" : "card-value hide"
    let itemImgStyle = "spcard-img"
    const isSpecial = isSpecialCard(color);

    //при выборе карт из колоды они показываются чуть меньше, чем во время игры
    if (isSmall) {
        itemStyle += " mini-card"
        itemValueStyle += " mini-value"
        itemImgStyle += " mini-spcard-img"
    }
    if (isSelected) itemStyle += " is-selected"
    if (isPositive === true) itemValueStyle += " positive"
    if (isPositive === false) itemValueStyle += " negative"

    const viewValue = (isSpecial) ? 
        <img className={itemImgStyle} src={specialCardsData[value as SpecialCardValue].image} alt=""/> : 
        strValue

    return (
        <div className={itemStyle} 
             id={id} 
             onMouseDown={(e) => {if (handleClick && value !== null) handleClick(e, id, value, color)}}
             onMouseOver={()=>{if (handlePointerOver) handlePointerOver(value)}}
             onMouseOut={()=>{if (handlePointerOut) handlePointerOut()}}>
            <div className={itemValueStyle}>
                {viewValue}
                {isPositive === true && <img className='arrow' src={ARROW_UP}/>}
                {isPositive === false && <img className='arrow' src={ARROW_DOWN}/>}
            </div>    
        </div>
    )
}