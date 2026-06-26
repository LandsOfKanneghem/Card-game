import React from "react";
import runLastTurnActionTests from "./test cases/testLastTurnAction";
import runBustTests from "./test cases/testBust";
import runDefenseTests from "./test cases/testDefense";
import runOutgrowTests from "./test cases/testOutgrow";
import runAggressiveTests from "./test cases/testAggressive";



//запустить все тесты
export function runAllTests(setLogs: React.Dispatch<React.SetStateAction<string[]>>) {
    //LAST TURN
    runLastTurnActionTests(setLogs);

    //BUST
    runBustTests(setLogs);

    //DEFENSIVE
    runDefenseTests(setLogs);

    //AGRESSIVE
    runAggressiveTests(setLogs);

    //OUTGROW
    runOutgrowTests(setLogs);
}


