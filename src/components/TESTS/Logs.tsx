import React from "react"

//логи
type LogsProps = {
    logs: string[], 
}

export default function Logs({logs}: LogsProps) {
    const logItems = logs.map((item, i) => <LogMessage message={item} key={i}/>)

    return (
        <div className="logs">
            {logItems}
        </div>
    )
}


//сообщение лога
type LogMessageProps = {
    message: string, 
}

function LogMessage({message}: LogMessageProps) {
    return (
        <div className="log-message">
            {message}
        </div>
    )
}