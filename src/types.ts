export type PtrEvent = React.MouseEvent<HTMLDivElement, MouseEvent>

export type PlayerOptions = 'player' | 'AI'

export type WinnerOptions = 'player' | 'AI'

export type GameStatus = 
    null |
    'discard before start' | 
    'started' | 
    'choosing cards from deck' |
    'round finished' | 
    'game finished'

export type CardType = 'common' | 'special'

export type CommonCardColor = 'green' | 'red'

export type SpecialCardColor = 'blue' | 'purple'

export type CardColor = CommonCardColor | SpecialCardColor

export type SpecialCardValue = 
    'coin' |
    'inversion' |
    'joker' |
    'cancel' |
    'clover' |
    'sprint' |
    'truce' |                            
    'swap' |
    'hourglass' |
    'champion' |
    'plague'

export type SpecialCardInfo = {
    name: string,
    color: SpecialCardColor,
    description: string,
    specialDescription: string | null,
    image: string
}

export type CommonCardParams = {
    id: string,
    type: 'common',
    color: CommonCardColor,
    value: number,
    isSelected?: boolean,
}

export type SpecialCardParams = {
    id: string,
    type: 'special',
    color: SpecialCardColor,
    value: SpecialCardValue,
    isSelected?: boolean,
}

//export type CardParams = CommonCardParams | SpecialCardParams

// export type SelectedCard = (CommonCardParams | SpecialCardParams) & {
//   isSelected: boolean;
// };

export type DoneAction = {
    card: CommonCardParams | SpecialCardParams,
    discarded: boolean,
    canceled: boolean,
};
