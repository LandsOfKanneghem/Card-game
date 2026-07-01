import type { SpecialCardValue, DoneAction } from "../../types"
import { specialCardsData } from "../../gameLogic/special cards/specialCardsData";




type DoneActionElementProps = {
    action: DoneAction,
    handlePointerOver: (value: SpecialCardValue) => void,
    handlePointerOut: () => void,
}

function DoneActionElement({action, handlePointerOver, handlePointerOut}: DoneActionElementProps) {
    const card = action.card;
    const color = (action.discarded) ? 'black' : card.color;
    const sign = (!action.discarded && typeof card.value === 'number' && card.value > 0) ? "+" : ""
    
    const actionColor = color + "-action"
    const canceledStyle = (action.canceled) ? " canceled-action" : ""
    //const cantBeHovered = (isSpecialCard(color)) ? "" : " not-clickable"
    const actionStyle = "action " + actionColor + canceledStyle
    
    let actionViewValue
    if (action.discarded) actionViewValue = 'сброс'
    else  actionViewValue = (card.type === 'special') ? <img className="action-img" src={specialCardsData[card.value].image} alt=""/> : sign + card.value

    return (
        (
            (action.discarded || typeof card.value === 'number') ?
            <div className={actionStyle}>
                <div className="action-value">{actionViewValue}</div> 
            </div> :
            <div 
                className={actionStyle}
                onMouseOver={() => handlePointerOver(card.value)}
                onMouseOut={() => handlePointerOut()}
            >
                <div className="action-value">{actionViewValue}</div> 
            </div>
        )
    )
}




//отображение всех выполненных действий игрока
type DoneActionsBarProps = {
    doneActions: DoneAction[],
    isPlayer: boolean,
    getSpecialCardDescription: (value: SpecialCardValue) => void,
    resetDescription: () => void
}

export default function DoneActionsBar({doneActions, isPlayer, getSpecialCardDescription, resetDescription}: DoneActionsBarProps) {
    //попробую отображать последние 12 действий
    const doneActionItems = (doneActions.slice(-12)).map((action, i) => 
        <DoneActionElement 
            key={i} 
            action={action} 
            handlePointerOver={getSpecialCardDescription}
            handlePointerOut={resetDescription}
        />
    )

    const offsetStyle = (isPlayer) ? " player-actions" : " AI-actions"
    const doneActionsStyle = "done-actions-bar" + offsetStyle

    return (
        <div className={doneActionsStyle}>{doneActionItems}</div>
    )
}