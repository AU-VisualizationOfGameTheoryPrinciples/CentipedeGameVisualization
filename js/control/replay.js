/**
 * restart game via replay button by refreshing the page
 * An overlay blocks all other buttons, but you can still see the results
 */
function createReplayButton() {
    var replayButton = document.createElement("button");
    var overlay = document.createElement("div");
    var mainContainer = document.getElementById("main");
    replayButton.setAttribute("class", "replay");
    replayButton.textContent = "Replay?";
    replayButton.addEventListener("click", () => location.reload());
    overlay.setAttribute("class", "overlay");
    document.body.appendChild(overlay);
    mainContainer.appendChild(replayButton);
}

export {createReplayButton};

