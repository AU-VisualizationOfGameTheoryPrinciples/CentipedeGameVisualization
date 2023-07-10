const continueSound = new Audio("./sound/coin_throw.mp4");
const endingSound = new Audio("./sound/coin_throw.mp4");

function playContinueSound() {
    continueSound.load();
    continueSound.play();
}

function playEndingSound() {
    endingSound.load();
    endingSound.play();
}

export { continueSound, playContinueSound, playEndingSound };