import React from "react"

//выбор сложности
type DifficultySelectorProps = {
    setDifficulty: React.Dispatch<React.SetStateAction<number | null>>,
}

export default function DifficultySelector({setDifficulty}: DifficultySelectorProps) {
    return (
        <div className="set-difficulty">
            <div className="set-difficulty--button emerald-button" onMouseDown={() => setDifficulty(0)}>Новичок</div>
            <div className="set-difficulty--button emerald-button" onMouseDown={() => setDifficulty(1)}>Джокер</div>
            <div className="set-difficulty--button ruby-button" onMouseDown={()=> setDifficulty(2)}>Отмена</div>
            <div className="set-difficulty--button ruby-button" onMouseDown={()=> setDifficulty(3)}>Спринт</div>
            <div className="set-difficulty--button saphire-button" onMouseDown={()=> setDifficulty(4)}>Клевер</div>
            <div className="set-difficulty--button saphire-button" onMouseDown={()=> setDifficulty(5)}>Перемирие</div>
            <div className="set-difficulty--button topaz-button" onMouseDown={() => setDifficulty(6)}>Песочные часы</div>
            <div className="set-difficulty--button topaz-button" onMouseDown={() => setDifficulty(7)}>Обмен</div>
            <div className="set-difficulty--button topaz-button" onMouseDown={() => setDifficulty(8)}>Чемпион</div>
            <div className="set-difficulty--button death-button" onMouseDown={() => setDifficulty(9)}>Смерть</div>
        </div>
    )
}