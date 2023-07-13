const continueSound = new Audio("../sound/coin_throw.mp4");
const endingSound = new Audio("../sound/multi_coin_throw.mp4");

async function playContinueSound() {
    await playSound(continueSound);
}

async function playEndingSound() {
    await playSound(endingSound);
}

async function playSound(soundAudio) {
    soundAudio.load();
    await soundAudio.play();
}

export { continueSound, playContinueSound, playEndingSound };