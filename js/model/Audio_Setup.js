const continueSound = new Audio("../sound/coin_throw.mp4");
const endingSound = new Audio("../sound/multi_coin_throw.mp4");

function playContinueSound() {
    playSound(continueSound);
}

function playEndingSound() {
    playSound(endingSound);
}

function playSound(soundAudio) {
    soundAudio.load();
    soundAudio.play();
}

export { continueSound, playContinueSound, playEndingSound };