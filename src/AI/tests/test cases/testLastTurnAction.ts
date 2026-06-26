import React from "react";
import { LAST_TURN, MAX_VALUE } from "../../../config";
import { runTest, ConsoleColor } from "../testUtils";



export default function runLastTurnActionTests(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    console.log(`${ConsoleColor.blue}RUN LAST TURN ACTION TESTS:${ConsoleColor.reset}`);
    //используем только обычные карты
    test1(setLogs);
    test2(setLogs);
    test3(setLogs);
    test4(setLogs);
    test5(setLogs);
    test6(setLogs);
    test7(setLogs);
    test8(setLogs);
}


//перебор оппонента на последний ход
function test1(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 1: ', 
        [['r', 4], ['g', 4], ['g', 3], ['g', -3]], [],//AI hand
        [['r', 4], ['r', 4]], [],//player hand
        0, LAST_TURN,//aiLevel + turn 
        MAX_VALUE - 3, MAX_VALUE - 3,//aiPoints + playerPoints
        {color: 'red', value: 4, discarded: false},//desired card to play
        setLogs
    )
}

//завышаем себя без перебора
function test2(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 2: ', 
        [['r', 2], ['g', 4], ['g', 3], ['g', -3]], [],//AI hand
        [['r', 4], ['r', 4]], [],//player hand
        0, LAST_TURN,//aiLevel + turn 
        MAX_VALUE - 3, MAX_VALUE - 3,//aiPoints + playerPoints
        {color: 'green', value: 3, discarded: false},//desired card to play
        setLogs
    )
}

//занижаем оппонента
function test3(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 3: ', 
        [['r', 2], ['g', 4], ['r', -1], ['g', -3]], [],//AI hand
        [['r', 4], ['r', 4]], [],//player hand
        0, LAST_TURN,//aiLevel + turn 
        MAX_VALUE - 3, MAX_VALUE - 3,//aiPoints + playerPoints
        {color: 'red', value: -1, discarded: false},//desired card to play
        setLogs
    )
}

//нет вариантов для победы
function test4(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 4: ', 
        [['r', 2], ['g', 4], ['r', -1], ['g', -3]], [],//AI hand
        [['r', 4], ['r', 4]], [],//player hand
        0, LAST_TURN,//aiLevel + turn 
        MAX_VALUE - 8, MAX_VALUE - 3,//aiPoints + playerPoints
        {discarded: true},//desired card to play
        setLogs
    )
}

//возможность сравнять счет путем повышения своего счета
function test5(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 5: ', 
        [['r', 2], ['g', 4], ['r', -1], ['g', -3]], [],//AI hand
        [['r', 4], ['r', 4]], [],//player hand
        0, LAST_TURN,//aiLevel + turn 
        MAX_VALUE - 7, MAX_VALUE - 3,//aiPoints + playerPoints
        {color: 'green', value: 4, discarded: false},//desired card to play
        setLogs
    )
}

//возможность сравнять счет путем понижения счета оппонента
function test6(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 6: ', 
        [['r', 2], ['g', 3], ['r', -4], ['g', -3]], [],//AI hand
        [['r', 4], ['r', 4]], [],//player hand
        0, LAST_TURN,//aiLevel + turn 
        MAX_VALUE - 7, MAX_VALUE - 3,//aiPoints + playerPoints
        {color: 'red', value: -4, discarded: false},//desired card to play
        setLogs
    )
}

//возможность сравнять счет путем понижения счета оппонента - 2
function test7(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 7: ', 
        [['r', 2], ['g', 1], ['r', -3], ['g', -1]], [],//AI hand
        [['r', 4], ['r', 4]], [],//player hand
        0, LAST_TURN,//aiLevel + turn 
        0, 2,//aiPoints + playerPoints
        {color: 'red', value: -3, discarded: false},//desired card to play
        setLogs
    )
}

//завышаем себя - 2
function test8(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 8: ', 
        [['r', 2], ['g', 2], ['r', -4], ['g', -1]], [],//AI hand
        [['r', 4], ['r', 4]], [],//player hand
        0, LAST_TURN,//aiLevel + turn
        1, 1,//aiPoints + playerPoints
        {color: 'green', value: 2, discarded: false},//desired card to play
        setLogs
    )
}