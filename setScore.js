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

buttonContinue.addEventListener("click", () => startGameRound(CENTIPEDE_MOVE.CONTINUE));
buttonEnd.addEventListener("click", () => startGameRound(CENTIPEDE_MOVE.END));

/* TO BE MOVED IN ANOTHER MODULE */

var canvas = document.getElementById("centipede_graph");
if (canvas) {
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

    function setText(x, y, content) {
        ctx.font = "1rem Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText(content, x, y);
        // ctx.strokeText(content, x, y);
    }

    function drawPoint(x, y, color) {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();
    }

    function drawRectangle(x, y, color = "#000000") {
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeRect(x, y, 100, 30);
        // ctx.stroke();
    }

    function drawTriangleArrow(tipX, tipY, color, rightOrDown = "right") {
        let multiplicator = (rightOrDown == "down") ? -1 : 1;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX - (10 * multiplicator), tipY + (10 * multiplicator));
        ctx.lineTo(tipX - 10, tipY - 10);
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.stroke();
    }
}

/**/

function setPlayerTurn(player_num) {
    player_turn.innerText = player_num;
}

function getPlayerTurn() {
    return Number.parseInt(player_turn.innerText);
}
function endGame(ending_move) {
    buttonContinue.disabled = "true";
    buttonEnd.disabled = "true";

    let currentPlayer = getPlayerTurn();
    let otherPlayer = (getPlayerTurn() + 2) % 2 + 1;

    let finishingMessage = "P1: " + getScore(1) + " P2: " + getScore(2) + "\n";
    finishingMessage += "Player " + currentPlayer + " has ended the Game ";
    let winningMessage = "He has " + (getScore(currentPlayer) - getScore(otherPlayer)) + " more bucks than Player " + otherPlayer + "!";
    switch (ending_move) {
        case CENTIPEDE_MOVE.END: {
            if (checkRound(0)) {
                finishingMessage += "right away!\n";
            } else {
                finishingMessage += "inbetween.\n";
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
    alert(finishingMessage);
}

setPlayerTurn(1);

function startGameRound(move) {
    let round = getRoundValue();

    if (canvas)
        drawPoint(tempX, 20 + lineSteps2 + (lineSteps2 + 10) * round, "#FF0000");

    if (move == CENTIPEDE_MOVE.CONTINUE) {
        setScore(1, 1);
        setScore(2, 1);
        if (checkRound(ENDING_ROUND)) {
            if (canvas)
                drawTriangleArrow(tempX, tempY + lineSteps2, "#FF0000", "down");
            // drawRectangle(tempX - 50, 20 + lineSteps2 + (lineSteps2+10) * round, "#FF0000")
            endGame(CENTIPEDE_MOVE.HONOR);
            return;
        }
    } else if (move == CENTIPEDE_MOVE.END) {
        setScore(getPlayerTurn(), 2);
        if (canvas)
            drawTriangleArrow(tempX + lineSteps2, 20 + lineSteps2 + (lineSteps2 + 10) * round, "#FF0000");
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
            pos -= 3 * direction;
            elem.style.top = pos + "px";
        }
    }
}