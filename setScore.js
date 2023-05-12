var buttonContinue = document.querySelector("#continue");
var buttonEnd = document.querySelector("#end");
var player_turn = document.querySelector("#player_turn");
var round_value = document.querySelector("#round_value");

const round_add = 10;

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
function endGame(){
    buttonContinue.disabled = "true";
    buttonEnd.disabled = "true";
    alert("P1: " + getScore(1) + " P2: " + getScore(2));
}

setPlayerTurn(1);

function startGameRound(move){
    let round = getRoundValue();

    if(move == CENTIPEDE_MOVE.CONTINUE){
        setScore(1,1);
        setScore(2,1);
    } else if(move == CENTIPEDE_MOVE.END){
        setScore(getPlayerTurn(), 2);
        endGame();
        return;
    }

    addRound();
    if(checkRound(100)){
        buttonContinue.textContent = arrayCentipedeName[CENTIPEDE_MOVE.HONOR];
        buttonEnd.textContent = arrayCentipedeName[CENTIPEDE_MOVE.DEFECT];
    } else if(checkRound(100+round_add)){
        endGame();
        return;
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
