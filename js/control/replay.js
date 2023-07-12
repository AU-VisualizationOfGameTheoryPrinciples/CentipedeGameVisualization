function createReplayButton() {
    var replayButton = document.createElement("button");
    var overlay = document.createElement("div");
    var mainContainer = document.getElementById("main");
    replayButton.setAttribute("class", "replay");
    replayButton.textContent = "Replay?";
    replayButton.addEventListener("click", () => location.reload());
    overlay.setAttribute("class", "overlay");
    overlay.setAttribute("height", document.documentElement.clientHeight);
    document.body.appendChild(overlay);
    mainContainer.appendChild(replayButton);
}

export {createReplayButton};

