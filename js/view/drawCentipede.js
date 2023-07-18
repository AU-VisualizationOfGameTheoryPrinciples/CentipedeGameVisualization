const whiteColor = "#FFFFFF";
var tempX;
var tempYBase;
var lineSteps;
var lineSteps2;

var canvas = document.getElementById("centipede_graph");
if (canvas){
    var ctx = canvas.getContext("2d");
}

/**
 * set variables for Centipede drawing
 * @param {number} tempXVar starting x coordinate
 * @param {number} tempYVar starting y coordinate
 * @param {number} lineStepsVar distance between points/lines
 * @param {number} lineSteps2Var distance between points/lines
 */
function setCentipedeParams(tempXVar, tempYVar, lineStepsVar, lineSteps2Var) {
    tempX = tempXVar;
    tempYBase = tempYVar;
    lineSteps = lineStepsVar;
    lineSteps2 = lineSteps2Var;
}

function drawPoint(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
}

function setText(x, y, content) {
    ctx.font = "1rem Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(content, x, y);
    // ctx.strokeText(content, x, y);
}

function drawLine(startX, startY, endX, endY) {
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
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

function drawCentipede() {
    const ENDING_ROUND_VALUE = 15;
    let counter = 0;
    // let tempX = canvas.width / 2;
    let tempY = tempYBase;
    while(counter<=ENDING_ROUND_VALUE){
        drawLine(tempX, tempY, tempX, tempY+lineSteps);
        drawLine(tempX, tempY+lineSteps, tempX+lineSteps, tempY+lineSteps);
        if(counter<ENDING_ROUND_VALUE)
        drawLine(tempX, tempY+lineSteps, tempX-lineSteps, tempY+lineSteps);
        drawPoint(tempX, tempY+lineSteps, whiteColor);
        //  getUtility()
        // let utilityText = " (0,1) ";
        // setText(tempX+lineSteps, tempY+lineSteps + 5, utilityText);
        setText(tempX-5, tempY+lineSteps+5, counter%2+1)

        tempY = tempY + lineSteps + 10;
        counter++;
    }
    drawLine(tempX, tempY, tempX, tempY+lineSteps);
}

function drawScores(score_defect_add, ENDING_ROUND) {
    // var ctx = canvas.getContext("2d");
    // var lineSteps2 = 50;
    // var tempX = canvas.width / 2;
    var tempY = tempYBase;

    for (let i = 0; i <= ENDING_ROUND; i++) {
        let utility_value_p1 = i + score_defect_add * ((i + 1) % 2);
        let utility_value_p2 = i + score_defect_add * (i % 2);
        setText(tempX + lineSteps2, tempY + lineSteps2 + 5, `(${utility_value_p1},${utility_value_p2})`);
        tempY = tempY + lineSteps2 + 10;
    }
    setText(tempX - 25, tempY + lineSteps2 + 20, `(${ENDING_ROUND + score_defect_add / 2},${ENDING_ROUND + score_defect_add / 2})`);
}

// Maybe add a version with only one loop rather than 2 loops
function drawCentipedeWithScores(score_defect_add, ENDING_ROUND) {
    drawCentipede();
    drawScores(score_defect_add, ENDING_ROUND);
}

export {setCentipedeParams, drawPoint, drawRectangle, drawLine, drawTriangleArrow, drawCentipedeWithScores, setText};