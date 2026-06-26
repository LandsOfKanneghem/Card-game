//описание особой карты
type SpCardDescriptionProps = {
    description: string,
    offsetFromTop: string
}

export default function SpCardDescription({description, offsetFromTop}: SpCardDescriptionProps) {
    const cardName = description ? description[0] : ""
    const cardDesc = description ? description[1] : ""
    const offsetValue = parseInt(offsetFromTop) + 10
    const offsetStyle = {top: `${offsetValue}px`}

    return (
        <div className="info card-description" style={offsetStyle}> 
            <p style={{fontWeight: "bold"}}>{cardName}</p>
             {cardDesc}  
        </div>
    )
}