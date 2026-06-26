import React from "react";
import { MAX_VALUE } from "../../../config";
import { runTest, ConsoleColor } from "../testUtils";



export default function runBustTests(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    console.log(`${ConsoleColor.blue}RUN BUST TESTS:${ConsoleColor.reset}`);
    test1(setLogs);
    test2(setLogs);
}



//перебор у оппонента засчет обычной карты
function test1(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 1: ', 
        [['r', 3], ['g', 4], ['r', 4], ['g', -3]], [],//AI hand
        [['r', 4], ['r', 4]], [],//player hand
        0, 5,//aiLevel + turn
        MAX_VALUE, MAX_VALUE - 3,//aiPoints + playerPoints
        {color: 'red', value: 4, discarded: false},//desired card to play
        setLogs
    )
}

//перебор у оппонента засчет обычной карты - 2
function test2(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 2: ', 
        [['r', 1], ['g', 1], ['r', -4]], [],//AI hand
        [['r', 4], ['r', 4]], [],//player hand
        0, 5,//aiLevel + turn
        MAX_VALUE, MAX_VALUE,//aiPoints + playerPoints
        {color: 'red', value: 1, discarded: false},//desired card to play
        setLogs
    )
}