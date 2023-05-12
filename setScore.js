var buttonContinue = document.querySelector("#continue");
var buttonEnd = document.querySelector("#end");
var player_turn = document.querySelector("#player_turn");
var round_value = document.querySelector("#round_value");

const round_add = 10;
const ENDING_ROUND = 100;

const CENTIPEDE_MOVE = { CONTINUE: 0, END: 1, HONOR: 2, DEFECT: 3, length: 4 };
var arrayCentipedeName = [3];
arrayCentipedeName[CENTIPEDE_MOVE.CONTINUE] = "continue";
arrayCentipedeName[CENTIPEDE_MOVE.END] = "end";
arrayCentipedeName[CENTIPEDE_MOVE.HONOR] = "honor";
arrayCentipedeName[CENTIPEDE_MOVE.DEFECT] = "defect";

buttonContinue.addEventListener("click", () => startGameRound(CENTIPEDE_MOVE.CONTINUE));
buttonEnd.addEventListener("click", () => startGameRound(CENTIPEDE_MOVE.END));

function setPlayerTurn(player_num){
    player_turn.innerText = player_num;
}

function getPlayerTurn(){
    return Number.parseInt(player_turn.innerText);
}
function endGame(ending_move){
    buttonContinue.disabled = "true";
    buttonEnd.disabled = "true";

    let currentPlayer = getPlayerTurn();
    let otherPlayer = (getPlayerTurn()+2)%2+1;

    let finishingMessage = "P1: " + getScore(1) + " P2: " + getScore(2) + "\n";
    finishingMessage+= "Player " + currentPlayer + " has ended the Game ";
    let winningMessage = "He has " + (getScore(currentPlayer) - getScore(otherPlayer)) + " more bucks than Player " + otherPlayer + "!";
    switch(ending_move){
        case CENTIPEDE_MOVE.END: {
            if(checkRound(0)){
                finishingMessage+= "right away!\n";
            } else {
                finishingMessage+= "inbetween.\n";
            }
            finishingMessage+= winningMessage;
            break;
        }
        case CENTIPEDE_MOVE.DEFECT: {
            finishingMessage+= "and defected at the last turn.\n";
            finishingMessage+= winningMessage;
            break;
        }
        case CENTIPEDE_MOVE.HONOR: {
            finishingMessage+= "and shared the money with Player " + otherPlayer + ".\n";
            finishingMessage+= "They both won " + getScore(1) + "$!";
            break;
        }
    }
    alert(finishingMessage);
}

setPlayerTurn(1);

function startGameRound(move){
    let round = getRoundValue();

    if(move == CENTIPEDE_MOVE.CONTINUE){
        setScore(1,1);
        setScore(2,1);
        if(checkRound(ENDING_ROUND)){
            endGame(CENTIPEDE_MOVE.HONOR);
            return;
        }
    } else if(move == CENTIPEDE_MOVE.END){
        setScore(getPlayerTurn(), 2);
        if(checkRound(ENDING_ROUND)){
            endGame(CENTIPEDE_MOVE.DEFECT);
        } else {
            endGame(CENTIPEDE_MOVE.END);
        }
        return;
    }

    addRound();
    if(checkRound(ENDING_ROUND)){
        buttonContinue.textContent = arrayCentipedeName[CENTIPEDE_MOVE.HONOR];
        buttonEnd.textContent = arrayCentipedeName[CENTIPEDE_MOVE.DEFECT];
    }
    setPlayerTurn((getPlayerTurn()+2)%2+1);
}


function getRoundValue(){
    return Number.parseInt(round_value.innerText);
}

function addRound(){
    round_value.innerText = getRoundValue() + round_add;
}

function checkRound(max_round){
    return getRoundValue() == max_round;
}

function setScore(player_num, score_addition){
    let player_score = document.getElementById(`p${player_num}_score_value`);
    player_score.innerHTML = Number.parseInt(player_score.innerHTML) + score_addition;
}

function getScore(player_num){
    let player_score = document.getElementById(`p${player_num}_score_value`);
    return Number.parseInt(player_score.innerHTML);
}
