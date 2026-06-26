import React from "react"
import { getUID } from "../utils/utils"
import type { SpecialCardParams } from "../types"

//выбор параметров карты (например, при розыгрыше Джокера или Чемпиона)
type SpCardParamsSetterProps = {
    setSpecialCardParams: React.Dispatch<React.SetStateAction<SpecialCardParams>>,
    specialCardState: string
}

export default function SpCardParamsSetter({setSpecialCardParams, specialCardState}: SpCardParamsSetterProps) {
    const [color, setColor] = React.useState('green')
    const [value, setValue] = React.useState(specialCardState === 'champion_state' ? 10 : 5)
    const sign = (value > 0) ? "+" : ""
    const itemStyle = "card " + color
    const rightButtonsStyle = (specialCardState === 'champion_state') ? "set-new-card--panel hide" : "set-new-card--panel"

    function increaseValue() {
        if (value + 1 > 5) return
        else if (value + 1 === 0) setValue(1)
        else setValue(prevState => prevState + 1)
    }

    function decreaseValue() {
        if (value - 1 < -5) return
        else if (value - 1 === 0) setValue(-1)
        else setValue(prevState => prevState - 1)
    }

    return (
        <div className="set-new-card">
            <div className="set-new-card--panel">
                <button className="modify-value-button green" onMouseDown={() => setColor('green')}></button>
                <button className="modify-value-button red" onMouseDown={() => setColor('red')}></button>
            </div>
            <div className={itemStyle} 
                 onMouseDown={() => setSpecialCardParams({id: getUID(), value, color})}>
                <div className="card-value">{sign+value}</div>    
            </div>
            <div className={rightButtonsStyle}>
                <button className="modify-value-button" onMouseDown={() => increaseValue()}>+</button>
                <button className="modify-value-button" onMouseDown={() => decreaseValue()}>-</button>
            </div>
        </div>
    )
}