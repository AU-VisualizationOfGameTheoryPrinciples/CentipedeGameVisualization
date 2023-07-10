const whiteColor = "#FFFFFF";
const lineSteps = 50;
var canvas = document.getElementById("centipede_graph");
if (canvas){
    var ctx = canvas.getContext("2d");
}
// ctx.moveTo(0, 20);
// ctx.lineTo(100, 20);
// ctx.stroke();
// ctx.moveTo(100, 20);
// ctx.lineTo(200, 20);
// ctx.stroke();
// ctx.moveTo(100, 20);
// ctx.lineTo(100, 120);
// ctx.stroke();
// ctx.font = "1rem Arial";
// ctx.fillText(" (0,1) ", 100, 110);
// ctx.beginPath();
// ctx.arc(100, 20, 10, 0, 2 * Math.PI);
// ctx.stroke();
// ctx.fillStyle = "#FFFFFF";
// ctx.fill();
// drawCentipede();

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
    // ctx.fillText(content, x, y);
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
    let tempX = canvas.width / 2;
    let tempY = 20;
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

export {drawPoint, drawRectangle, drawLine, drawTriangleArrow, drawCentipede, setText};