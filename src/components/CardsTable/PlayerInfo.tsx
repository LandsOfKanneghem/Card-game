import FLAG_WHITE from '../../assets/img/flag/flag128white.png'
import FLAG_WIN from '../../assets/img/flag/flag128win.png'
import { MAX_VALUE, ROUNDS_TO_WIN } from '../../config';


//аватар игрока + кол-во очков
type PlayerInfoProps = {
    img: string, 
    score: number,
    points: number, 
}

export default function PlayerInfo({ img, score, points }: PlayerInfoProps) {
    const playedRounds = [];
    for (let i = 0; i < score; i++) 
        playedRounds.push(<img key={`win-${i}`} className="flag" src={FLAG_WIN}/>);
    for (let i = score; i < ROUNDS_TO_WIN; i++) 
        playedRounds.push(<img key={`white-${i}`} className="flag" src={FLAG_WHITE}/>)


    return (
        <div className="player-info"> 
            <div className="player-avatar">
                <img className="player-avatar--img" src={img} alt=""/>
            </div>
            <div className="player-points">Очки: {points}/{MAX_VALUE}</div>
            <div className='player-score'>
                {playedRounds}
            </div>
        </div>
    )
}