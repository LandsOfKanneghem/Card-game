import React from "react";
import { MAX_VALUE } from "../../../config";
import { runTest, ConsoleColor } from "../testUtils";



export default function runDefenseTests(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    console.log(`${ConsoleColor.blue}RUN DEFENSE TESTS:${ConsoleColor.reset}`);
    test1(setLogs);
}



//оборона от пуша
function test1(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    runTest(
        'TEST 1: ', 
        [['r', 2], ['g', 4], ['r', -1], ['g', -3]], [],//AI hand
        [['r', 4], ['r', 4]], [],//player hand
        0, 5,//aiLevel + turn
        MAX_VALUE - 3, MAX_VALUE - 3,//aiPoints + playerPoints
        {color: 'green', value: -3, discarded: false},//desired card to play
        setLogs
    )
}