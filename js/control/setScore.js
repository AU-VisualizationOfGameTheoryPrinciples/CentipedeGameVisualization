import { playContinueSound, playEndingSound } from "../model/Audio_Setup.js";
import { setupAgent } from "../model/Centipede_Agent.js";
import { drawCentipedeWithScores, drawPoint, drawTriangleArrow, setCentipedeParams, setText} from "../view/drawCentipede.js";
import { createReplayButton } from "./replay.js";

var has_computer_agent = document.getElementById("p2_score").textContent.match("CPU") != null;
var agent;

var buttonContinue = document.querySelector("#continue");
var buttonEnd = document.querySelector("#end");
var player_turn = document.querySelector("#player_turn");
var round_value = document.querySelector("#round_value");

const round_add = 1;
const ENDING_ROUND = 15;
const score_defect_add = 2;

const CENTIPEDE_MOVE = { CONTINUE: 0, END: 1, HONOR: 2, DEFECT: 3, length: 4 };
var arrayCentipedeName = [4];
arrayCentipedeName[CENTIPEDE_MOVE.CONTINUE] = "continue";
arrayCentipedeName[CENTIPEDE_MOVE.END] = "end";
arrayCentipedeName[CENTIPEDE_MOVE.HONOR] = "honor";
arrayCentipedeName[CENTIPEDE_MOVE.DEFECT] = "defect";

buttonContinue.addEventListener("click", async () => {
    lockButtons(true);
    await startGameRound(CENTIPEDE_MOVE.CONTINUE);
}
);
buttonEnd.addEventListener("click", async() => setTimeout(await startGameRound(CENTIPEDE_MOVE.END), 1000));

if (has_computer_agent) {
    agent = setupAgent();
    console.log(agent.strategy.type);
}

var canvas = document.getElementById("centipede_graph");
if (canvas) {
    var tempX = canvas.width / 2;
    var tempY = 20;
    var lineSteps = 50;
    var lineSteps2 = 50;
    setCentipedeParams(tempX, tempY, lineSteps, lineSteps2);
    drawCentipedeWithScores(score_defect_add, ENDING_ROUND);
}

function setPlayerTurn(player_num) {
    player_turn.innerText = player_num;
    player_turn.innerText += addNameForCPUGame(player_num);
}

/**
 * add name tags for game with human player against computer
 * @param {number} player_num 
 */
function addNameForCPUGame(player_num) {
    if (has_computer_agent) {
        let agent_name = player_num == 1 ? "(You)" : "(CPU)";
        return " " + agent_name;
    } else {
        return "";
    }
}

function getPlayerTurn() {
    return Number.parseInt(player_turn.innerText);
}

function lockButtons(flag) {
    buttonContinue.disabled = flag;
    buttonEnd.disabled = flag;
}

function endGame(ending_move) {
    lockButtons(true);

    let currentPlayer = getPlayerTurn();
    let otherPlayer = (getPlayerTurn() + 2) % 2 + 1;

    let finishingMessage = "P1: " + getScore(1) + " P2: " + getScore(2) + "\n";
    finishingMessage += "Player " + currentPlayer + addNameForCPUGame(currentPlayer) + " has ended the Game ";
    let winningMessage = "That player has " + (getScore(currentPlayer) - getScore(otherPlayer)) + " more bucks than Player " + otherPlayer + "!";
    switch (ending_move) {
        case CENTIPEDE_MOVE.END: {
            if (checkRound(currentPlayer-1)) {
                finishingMessage += "right away!\n";
                finishingMessage += "Based on Backwards Induction and the priority of winning, that was the best play!\n";
            } else {
                finishingMessage += "in between.\n";
                finishingMessage += "Like in the statistical Centipede Game sample cases, they wanted to get some profit before ending.\n";
            }
            finishingMessage += winningMessage;
            break;
        }
        case CENTIPEDE_MOVE.DEFECT: {
            finishingMessage += "and defected at the last turn.\n";
            finishingMessage += "They wanted to maximize their payoff.\n";
            finishingMessage += winningMessage;
            break;
        }
        case CENTIPEDE_MOVE.HONOR: {
            finishingMessage += "and shared the money with Player " + otherPlayer + ".\n";
            finishingMessage += "They both went the social path and won " + getScore(1) + "$!";
            break;
        }
    }
    playEndingSound();
    setTimeout(() => {
        alert(finishingMessage); 
        createReplayButton();
    }, 500);
}

setPlayerTurn(1);

async function startGameRound(move) {
    // lockButtons(true);
    let round = getRoundValue();

    if (canvas) {
        drawPoint(tempX, 20 + lineSteps2 + (lineSteps2 + 10) * round, "#FF0000");
    }

    if (move == CENTIPEDE_MOVE.CONTINUE) {
        await playContinueSound();
        setScore(1, 1);
        setScore(2, 1);
        if (checkRound(ENDING_ROUND)) {
            if (canvas) {
                drawTriangleArrow(tempX, tempY + lineSteps2, "#FF0000", "down");
            }
            // drawRectangle(tempX - 50, 20 + lineSteps2 + (lineSteps2+10) * round, "#FF0000")
            endGame(CENTIPEDE_MOVE.HONOR);
            return;
        }
        setTimeout(() => {
            lockButtons(false);
        }, 1000);
    } else if (move == CENTIPEDE_MOVE.END) {
        setScore(getPlayerTurn(), 2);
        if (canvas) {
            drawTriangleArrow(tempX + lineSteps2, 20 + lineSteps2 + (lineSteps2 + 10) * round, "#FF0000");
        }
        if (checkRound(ENDING_ROUND)) {
            // drawRectangle(tempX + lineSteps2 - 15, lineSteps2 + 5 + (lineSteps2+10) * (round-1), "#FF0000");
            endGame(CENTIPEDE_MOVE.DEFECT);
        } else {
            // drawRectangle(tempX + lineSteps2 - 15, lineSteps2 + 5 + (lineSteps2+10) * round, "#FF0000");
            endGame(CENTIPEDE_MOVE.END);
        }
        return;
    }

    addRound();
    if (checkRound(ENDING_ROUND)) {
        buttonContinue.textContent = arrayCentipedeName[CENTIPEDE_MOVE.HONOR];
        buttonEnd.textContent = arrayCentipedeName[CENTIPEDE_MOVE.DEFECT];
    }

    setPlayerTurn((getPlayerTurn() + 2) % 2 + 1);
    // animation.addEventListener('animationend', () => {
    if (has_computer_agent && (getPlayerTurn() + 2) % 2 == 0) {
        // lockButtons(true);
        let cpu_decision = agent.get_decision(getRoundValue());
        cpu_decision = cpu_decision ? CENTIPEDE_MOVE.END : CENTIPEDE_MOVE.CONTINUE;
        // alert("");
        setTimeout(async () => {
            await startGameRound(cpu_decision);
            if (cpu_decision == CENTIPEDE_MOVE.CONTINUE) {
                await playContinueSound();
                lockButtons(false);
            }
        }, 1000);

        // lockButtons(false);
    }
    // })
}


function getRoundValue() {
    return Number.parseInt(round_value.innerText);
}

function addRound() {
    round_value.innerText = getRoundValue() + round_add;
}

function checkRound(max_round) {
    return getRoundValue() == max_round;
}

function setScore(player_num, score_addition) {
    let player_score = document.getElementById(`p${player_num}_score_value`);
    let score_addition_elem = document.getElementById(`p${player_num}_score_addition`);
    score_addition_elem.innerHTML = score_addition;
    let direction = player_num == 1 ? (-1) : 1;
    animateScoreAddition(score_addition_elem, direction);
    player_score.innerHTML = Number.parseInt(player_score.innerHTML) + score_addition;
}

function getScore(player_num) {
    let player_score = document.getElementById(`p${player_num}_score_value`);
    return Number.parseInt(player_score.innerHTML);
}

function animateScoreAddition(score_addition, direction) {
    score_addition.style.opacity = "100%";
    let id = null;
    const elem = score_addition;
    const startPos = 70 - 20 * direction;
    let pos = 70 - 20 * direction;
    clearInterval(id);
    id = setInterval(frame, 22);
    function frame() {
        if (pos == startPos - 90 * direction) {
            clearInterval(id);
            score_addition.style.opacity = "0%";
        } else {
            pos -= 5 * direction;
            elem.style.top = pos + "px";
        }
    }
}