let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const indexW = 30;
const indexH = 30;
let noteArray = [];
let timer;

canvas.onclick = function(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    x = Math.floor(x / 20);
    y = Math.floor(y / 20);
    noteArray[x][y] = 1;
    console.log(noteArray);
    drawField();
}

function goToLife() {
    for (let i = 0; i < indexW; i++) {
        noteArray[i] = [];
        for (let j = 0; j < indexH; j++) {
            noteArray[i][j] = 0;
            ctx.fillStyle = "red";
            ctx.fillRect(i * 20, j * 20, 18, 18);
        }
    }
}
goToLife();


function drawField() {
    ctx.clearRect(0, 0, 600, 600);
    for (var i = 0; i < indexW; i++) {
        for (var j = 0; j < indexH; j++) {
            if (noteArray[i][j] == 1) {
                ctx.fillStyle = "green";
                ctx.fillRect(i * 20, j * 20, 20, 20);
            } else {
                ctx.fillStyle = "red";
                ctx.fillRect(i * 20, j * 20, 18, 18);
            }
        }

    }
}

function makingDotLifestyle() {

    var noteArrayCreating = [];
    for (let i = 0; i < indexW; i++) {

        noteArrayCreating[i] = [];
        for (let j = 0; j < indexH; j++) {

            let neighborsCount = neighborsCounting(i, j);
            if (neighborsCount == 3) {
                noteArrayCreating[i][j] = 1;
            }
            if (neighborsCount == 2) {
                noteArrayCreating[i][j] = noteArray[i][j];
            }
            if (neighborsCount < 2 || neighborsCount > 3) {
                noteArrayCreating[i][j] = 0;
            }
        }
    }
    noteArray = noteArrayCreating;
    drawField();

}

function lifeInfinity() {
    makingDotLifestyle();
    timer = setTimeout(lifeInfinity, 300);
}


function makingInfinityFieldPlus(coordinate) {
    if (coordinate === indexW - 1) {
        return -1;
    } else {
        return coordinate;
    }
}

function makingInfinityFieldMinus(coordinate) {
    if (coordinate === 0) {
        return indexW;
    } else {
        return coordinate;
    }
}


function neighborsCounting(lineOfNote, columnOfNote) {

    let count = 0;

    if (noteArray[lineOfNote][makingInfinityFieldMinus(columnOfNote) - 1] == 1) {
        count++;
    } //left
    if (noteArray[lineOfNote][makingInfinityFieldPlus(columnOfNote) + 1] == 1) {
        count++;
    } //right
    if (noteArray[makingInfinityFieldPlus(lineOfNote) + 1][columnOfNote] == 1) {
        count++;
    } //bottom
    if (noteArray[makingInfinityFieldMinus(lineOfNote) - 1][columnOfNote] == 1) {
        count++;
    } //top
    if (noteArray[makingInfinityFieldMinus(lineOfNote) - 1][makingInfinityFieldMinus(columnOfNote) - 1] == 1) {
        count++;
    } //top-left
    if (noteArray[makingInfinityFieldMinus(lineOfNote) - 1][makingInfinityFieldPlus(columnOfNote) + 1] == 1) {
        count++;
    } //top-right
    if (noteArray[makingInfinityFieldPlus(lineOfNote) + 1][makingInfinityFieldMinus(columnOfNote) - 1] == 1) {
        count++;
    } //bottom-left
    if (noteArray[makingInfinityFieldPlus(lineOfNote) + 1][makingInfinityFieldPlus(columnOfNote) + 1] == 1) {
        count++;
    } //bottom-right

    return count;
}

document.getElementById("start-infinity-button").onclick = lifeInfinity;