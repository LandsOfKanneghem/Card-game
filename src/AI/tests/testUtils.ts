import React from "react";
import type { CardColor, CommonCardParams, DoneAction, SpecialCardParams } from "../../types";
import { aiChooseAction_TEST } from "../aiLogic";



//цвета для консоли
export const ConsoleColor = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

//ВСПОМОГАТЕЛЬНЫЕ Ф-ИИ

//type TestResult = boolean | {actualAction: DoneAction | undefined, desiredAction: DesiredDoneAction};
type ShortCommonColorName = 'r' | 'g';
type GeneratedCommonCardTuple = [ShortCommonColorName, number];
type ShortSpecialColorName = 'b' | 'p';
type GeneratedSpecialCardTuple = [ShortSpecialColorName, string];
type DesiredDoneAction = {
    color?: CardColor,
    value?: number,
    discarded: boolean
};

function fillCommonHand(hand: GeneratedCommonCardTuple[], handID: string) {
    return hand.map((item, index) => ({
        id: handID + index,
        type: 'common',
        color: (item[0] === 'r') ? 'red' : 'green',
        value: item[1]
    }) as CommonCardParams)
}

function fillSpecialHand(hand: GeneratedSpecialCardTuple[], handID: string) {
    return hand.map((item, index) => ({
        id: handID + index,
        type: 'special',
        color: (item[0] === 'b') ? 'blue' : 'purple',
        value: item[1]
    }) as SpecialCardParams)
}

function generateHands(
    aiComHand: GeneratedCommonCardTuple[], 
    aiSpHand: GeneratedSpecialCardTuple[], 
    playerComHand: GeneratedCommonCardTuple[], 
    playerSpHand: GeneratedSpecialCardTuple[]
) {
    const aiCommonHand: CommonCardParams[] = fillCommonHand(aiComHand, 'aiCom');
    const aiSpecialHand: SpecialCardParams[] = fillSpecialHand(aiSpHand, 'aiSp');
    const playerCommonHand: CommonCardParams[] = fillCommonHand(playerComHand, 'playerCom');
    const playerSpecialHand: SpecialCardParams[] = fillSpecialHand(playerSpHand, 'playerSp');
    const playerDoneActions: DoneAction[] = [];
    const generalDeck: CommonCardParams[] = [];

    return {aiCommonHand, aiSpecialHand, playerCommonHand, playerSpecialHand, playerDoneActions, generalDeck};
}

function assertActions(actualAction: DoneAction | undefined, desiredAction: DesiredDoneAction): boolean {
    if (!actualAction) return false;
    return (
        (desiredAction.color === undefined       || actualAction.card.color === desiredAction.color)            &&
        (desiredAction.value === undefined       || actualAction.card.value === desiredAction.value)            &&
        (desiredAction.discarded === undefined   || actualAction.discarded === desiredAction.discarded)
    )
}

export function runTest(
    testTitle: string, 
    aiComHand: GeneratedCommonCardTuple[], 
    aiSpHand: GeneratedSpecialCardTuple[], 
    playerComHand: GeneratedCommonCardTuple[],
    playerSpHand: GeneratedSpecialCardTuple[],
    aiLevel: number,
    turn: number,
    aiPoints: number,
    playerPoints: number,
    desiredAction: DesiredDoneAction,
    setLogs: React.Dispatch<React.SetStateAction<string[]>>,
) {
    const genHanhds = generateHands(aiComHand, aiSpHand, playerComHand, playerSpHand);
    const actualAction = aiChooseAction_TEST(
        aiLevel, turn, aiPoints, playerPoints, 
        genHanhds.aiCommonHand, genHanhds.aiSpecialHand, genHanhds.playerCommonHand, genHanhds.playerSpecialHand, genHanhds.playerDoneActions, genHanhds.generalDeck,
        setLogs
    );
    const testResult = assertActions(actualAction, desiredAction);
    console.log(testTitle + (testResult ? `${ConsoleColor.green}PASSED${ConsoleColor.reset}` : `${ConsoleColor.red}FAILED${ConsoleColor.reset}`));
    if (!testResult) {
        if (actualAction)
            console.log(`${actualAction.card.color} ${actualAction.card.value} ${actualAction.discarded ? 'DISCARDED' : 'PLAYED'} ${actualAction.canceled ? 'CANCELED' : ''}`);
        if (!actualAction) console.log('ACTION IS UNDEFINED')
    }
}