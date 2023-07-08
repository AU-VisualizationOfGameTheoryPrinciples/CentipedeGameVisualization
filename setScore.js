import { continueSound, playContinueSound } from "./Audio_Setup.js";
import { setupAgent } from "./Centipede_Agent.js";
import { drawCentipede, drawPoint, drawTriangleArrow, setText } from "./drawCentipede.js";

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
var arrayCentipedeName = [3];
arrayCentipedeName[CENTIPEDE_MOVE.CONTINUE] = "continue";
arrayCentipedeName[CENTIPEDE_MOVE.END] = "end";
arrayCentipedeName[CENTIPEDE_MOVE.HONOR] = "honor";
arrayCentipedeName[CENTIPEDE_MOVE.DEFECT] = "defect";

buttonContinue.addEventListener("click", () => {
    lockButtons(true);
    startGameRound(CENTIPEDE_MOVE.CONTINUE);
}
);
buttonEnd.addEventListener("click", () => setTimeout(startGameRound(CENTIPEDE_MOVE.END), 1000));

if (has_computer_agent) {
    agent = setupAgent();
    console.log(agent.strategy.type);
}

/* TO BE MOVED IN ANOTHER MODULE */

var canvas = document.getElementById("centipede_graph");
if (canvas) {
    drawCentipede();
    var ctx = canvas.getContext("2d");
    var lineSteps2 = 50;
    var tempX = canvas.width / 2;
    var tempY = 20;

    for (let i = 0; i <= ENDING_ROUND; i++) {
        let utility_value_p1 = i + score_defect_add * ((i + 1) % 2);
        let utility_value_p2 = i + score_defect_add * (i % 2);
        setText(tempX + lineSteps2, tempY + lineSteps2 + 5, `(${utility_value_p1},${utility_value_p2})`);
        tempY = tempY + lineSteps2 + 10;
    }
    setText(tempX - 25, tempY + lineSteps2 + 20, `(${ENDING_ROUND + score_defect_add / 2},${ENDING_ROUND + score_defect_add / 2})`);
}

/**/

function setPlayerTurn(player_num) {
    player_turn.innerText = player_num;
    player_turn.innerText += addNameForCPUGame(player_num);
}

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
            if (checkRound(0)) {
                finishingMessage += "right away!\n";
            } else {
                finishingMessage += "in between.\n";
            }
            finishingMessage += winningMessage;
            break;
        }
        case CENTIPEDE_MOVE.DEFECT: {
            finishingMessage += "and defected at the last turn.\n";
            finishingMessage += winningMessage;
            break;
        }
        case CENTIPEDE_MOVE.HONOR: {
            finishingMessage += "and shared the money with Player " + otherPlayer + ".\n";
            finishingMessage += "They both won " + getScore(1) + "$!";
            break;
        }
    }
    setTimeout(() => alert(finishingMessage), 500);
}

setPlayerTurn(1);

function startGameRound(move) {
    // lockButtons(true);
    let round = getRoundValue();

    if (canvas) {
        drawPoint(tempX, 20 + lineSteps2 + (lineSteps2 + 10) * round, "#FF0000");
    }

    if (move == CENTIPEDE_MOVE.CONTINUE) {
        playContinueSound();
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
        let cpu_decision = agent.get_decision(round);
        console.log(cpu_decision);
        cpu_decision = cpu_decision ? CENTIPEDE_MOVE.END : CENTIPEDE_MOVE.CONTINUE;
        // alert("");
        setTimeout(() => {
            startGameRound(cpu_decision);
            if (cpu_decision == CENTIPEDE_MOVE.CONTINUE) {
                playContinueSound();
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