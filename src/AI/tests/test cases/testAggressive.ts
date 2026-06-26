import React from "react";
import { MAX_VALUE } from "../../../config";
import { runTest, ConsoleColor } from "../testUtils";



export default function runAggressiveTests(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    console.log(`${ConsoleColor.blue}RUN AGGRESSIVE TESTS:${ConsoleColor.reset}`);
    test1(setLogs);
}



//можно запушить за 3 хода, у оппонента почти нет обороны
function test1(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 1: ', 
        [['g', -3], ['g', 4], ['r', -1], ['r', 2], ['r', 4], ['r', 4]], [],//AI hand
        [['r', 4], ['r', 4], ['g', -1]], [],//player hand
        0, 4,//aiLevel + turn 
        MAX_VALUE - 8, MAX_VALUE - 8,//aiPoints + playerPoints
        {color: 'red', value: 4, discarded: false},//desired card to play
        setLogs
    )
}