// Create an instance of the template content
// const instance = document.importNode(fragment.content, true);
// var elem = document.getElementById("");
// elem.appendChild(instance);

var index = 0;
var paths = new Array();
paths.push("./html/template/LO.html");
paths.push("./html/template/introduction.html");
paths.push("./html/template/concept.html");
paths.push("./html/template/furtherReadings.html");

loadContent(paths[index]);

var prevButton = document.getElementById("intro-prev-button");
var continueButton = document.getElementById("intro-continue-button");

prevButton.addEventListener('click', () => buttonAction(-1));
continueButton.addEventListener('click', () => buttonAction(+1));

function loadContent(path) {
    $(function () {
        $("#includedContent").load(path);
    });
}

function toggleIndex(add, borderWarps = null) {
    let startAddition = 0;
    if (borderWarps == "both") {
        startAddition = paths.length;
    }
    let borderCheck = (index + add + startAddition) % paths.length;
    if (borderWarps == "start") {
        index = (index + add) > paths.length ? index : borderCheck;
    } else if (borderWarps == "end" || borderWarps == "both") {
        index = ((index + add) < 0) && borderWarps == "end" ? index : borderCheck;
    }
}

function buttonAction(add) {
    toggleIndex(add, "both");
    loadContent(paths[index]);
}

