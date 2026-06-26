import React from "react";
import { runTest, ConsoleColor } from "../testUtils";
import { saveRange_min, saveRange_max } from "../../strategies/aiGetActualStrategyAction";



export default function runOutgrowTests(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    console.log(`${ConsoleColor.blue}RUN OUTGROW TESTS:${ConsoleColor.reset}`);
    //используем только обычные карты
    test1(setLogs);
    test2(setLogs);
    test3(setLogs);
    test4(setLogs);
    test5(setLogs);
}


//занижение оппонента даст одинаковую выгоду, но это будет оверкилл, лучше выбрать +1
function test1(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 1: ', 
        [['r', -4], ['g', 1], ['r', 3]], [],//AI hand
        [['r', 4], ['r', 4]], [],//player hand
        0, 3,//aiLevel + turn
        0, 1,//aiPoints + playerPoints
        {color: 'green', value: 1, discarded: false},//desired card to play
        setLogs
    )
}

//повышение своего счета без выхода в опасноую зону
//(здесь надо разыграть 1, т.к. если разыграть 4 - мы выйдем из безопасной зоны)
function test2(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 2: ', 
        [['g', 4], ['g', 1]], [],//AI hand
        [['r', 1], ['r', 1]], [],//player hand
        0, 3,//aiLevel + turn
        saveRange_max - 3, 0,//aiPoints + playerPoints
        {color: 'green', value: 1, discarded: false},//desired card to play
        setLogs
    )
}

//повышение своего счета без выхода в опасноую зону
//(тест аналогичен номеру 2, но есть более приоритетная карта)
function test3(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 3: ', 
        [['g', 4], ['g', 1], ['g', 2]], [],//AI hand
        [['r', 1], ['r', 1]], [],//player hand
        0, 3,//aiLevel + turn
        saveRange_max - 3, 0,//aiPoints + playerPoints
        {color: 'green', value: 2, discarded: false},//desired card to play
        setLogs
    )
}

//повышение своего счета без выхода в опасноую зону
//(тест аналогичен номеру 2, но т.к. нет карт, которые могут вывести в безопасную зону - мы не выбираем никакую карту)
function test4(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 4: ', 
        [['g', 4]], [],//AI hand
        [['r', 1], ['r', 1]], [],//player hand
        0, 3,//aiLevel + turn
        saveRange_max - 3, 0,//aiPoints + playerPoints
        {color: 'green', value: 4, discarded: true},//desired card to play
        setLogs
    )
}

//повышение своего счета без выхода в опасноую зону, когда мы уже находимся внутри безопасной зоны и оппонент не может запушить
function test5(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 5: ', 
        [['g', 3], ['g', 2], ['g', 1]], [],//AI hand
        [['r', 1], ['r', 1]], [],//player hand
        0, 3,//aiLevel + turn
        saveRange_min, 0,//aiPoints + playerPoints
        {color: 'green', value: 2, discarded: false},//desired card to play
        setLogs
    )
}