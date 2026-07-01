import img_coin from '../../assets/img/special card/coin_spcard.png';
import img_inversion from '../../assets/img/special card/inversion_spcard.png';
import img_joker from '../../assets/img/special card/joker_spcard.png';
import img_cancel from '../../assets/img/special card/cancel_spcard.png';
import img_swap from '../../assets/img/special card/swap_spcard.png';
import img_clover from '../../assets/img/special card/clover_spcard.png';
import img_truce from '../../assets/img/special card/truce_spcard.png';
import img_sprint from '../../assets/img/special card/sprint_spcard.png';
import img_hourglass from '../../assets/img/special card/hourglass_spcard.png';
import img_champion from '../../assets/img/special card/champion_spcard.png';
import img_plague from '../../assets/img/special card/plague_spcard.png';

import type { SpecialCardValue, SpecialCardInfo } from "../../types";



export const specialCardsData: Record<SpecialCardValue, SpecialCardInfo> = {
    'coin': {
        name: 'Монетка',
        color: 'blue',
        description: "Игрок сбрасывает 3 выбранные карты и берет 3 верхние карты из общей колоды.",
        specialDescription: null,
        image: img_coin
    },
    'inversion': {
        name: 'Инверсия',
        color: 'blue',
        description: "Игрок в этот же ход может разыграть одну обычную карту как карту с противоположным цветом.",
        specialDescription: null,
        image: img_inversion
    },
    'joker': {
        name: 'Джокер',
        color: 'blue',
        description: "Вместо джокера игрок выбирает зеленый или красный цвет карты и любое значение от -5 до +5 и разыгрывает ее.",
        specialDescription: null,
        image: img_joker
    },
    'cancel': {
        name: 'Отмена',
        color: 'blue',
        description: "Игрок отменяет последнюю разыгранную карту оппонента, если она является обычной картой или Джокером.",
        specialDescription: null,
        image: img_cancel
    },
    'clover': {
        name: 'Клевер',
        color: 'blue',
        description: "Игрок сбрасывает 2 выбранные карты и берет из общей колоды 2 любые карты на выбор.",
        specialDescription: null,
        image: img_clover
    },
    'truce': {
        name: 'Перемирие',
        color: 'blue',
        description: "Очки обоих игроков обнуляются (если счет игрока меньше 0 - без изменений).",
        specialDescription: null,
        image: img_truce
    },
    'sprint': {
        name: 'Спринт',
        color: 'blue',
        description: "Игрок в этот ход имеет возможность разыграть две обычные карты подряд.",
        specialDescription: null,
        image: img_sprint
    },
    
    
    
    'swap': {
        name: 'Обмен',
        color: 'purple',
        description: "Количество очков у обоих игроков меняется местами (только если оно у обоих игроков неотрицательное).",
        specialDescription: null,
        image: img_swap
    },
    'hourglass': {
        name: 'Песочные часы',
        color: 'purple',
        description: "Пропускает 2 хода для обоих игроков, следующий ходит снова игрок.",
        specialDescription: null,
        image: img_hourglass
    },
    'champion': {
        name: 'Чемпион',
        color: 'purple',
        description: "Увеличивает очки любого игрока на выбор на 10 единиц.",
        specialDescription: null,
        image: img_champion
    },
    'plague': {
        name: 'Чума',
        color: 'purple',
        description: "Счет оппонента становится -12. Пока счет оппонента отрицательный - его можно понижать еще больше (можно разыграть только в первый ход).",
        specialDescription: null,
        image: img_plague
    },
}