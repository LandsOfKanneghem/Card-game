import React from "react"
import { runAllTests } from "../../AI/tests/aiTests"

//логи
type TestsProps = {
    setLogs: React.Dispatch<React.SetStateAction<string[]>>, 
    handleStartDummyGameButton: (value: 'AGGRO' | 'OUTGROW') => void, 
}

export default function Tests({setLogs, handleStartDummyGameButton}: TestsProps) {

    return (
        <div className="run-tests">
            <div className="run-tests-button" onClick={() => runAllTests(setLogs)}>Run Tests</div>
            <div className="run-tests-button" onClick={() => handleStartDummyGameButton('AGGRO')}>Aggro Dummy</div>
            <div className="run-tests-button" onClick={() => handleStartDummyGameButton('OUTGROW')}>Outgrow Dummy</div>
        </div>
    )
}