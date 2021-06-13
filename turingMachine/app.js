let form = document.querySelector("form");


function print(tape, cursor) {
    let output_div = document.getElementById("output");
    let output_paragraph = document.createElement("p");
    let arrayToString = [...tape];
    arrayToString.splice(cursor, 0, "_");
    output_paragraph.textContent = arrayToString.join('');
    output_div.appendChild(output_paragraph);
}


function printExtra(tape, cursor, transpozeTape) {
    let output_div = document.getElementById("output");
    let output_paragraph = document.createElement("p");
    let arrayToString = [...tape];
    arrayToString.splice(cursor, 0, "_");
    output_paragraph.textContent = transpozeTape.join('');
    output_div.appendChild(output_paragraph);
}

function roolsEasyGo() {

    let tapeInput = form.elements['input-string'].value;
    let cursor = form.elements['cursor'].value;
    let flag = true;
    let tape = [...tapeInput];
    while (flag && cursor !== tape.length) {
        switch (tape[cursor]) {

            case "1":
                tape[cursor] = 0;
                print(tape, cursor);
                break;
            case "0":
                tape[cursor] = 1;
                print(tape, cursor);
                break;
            default:
                flag = false;
                print(tape, cursor);
                break;
        }
        cursor++;
    }
}

function roolsMediumGo() {

    let tapeInput = form.elements['input-string'].value;
    let cursor = form.elements['cursor'].value;
    let flag = true;
    let tape = [...tapeInput];
    let conditionCount = 0;
    while (flag && (cursor !== tape.length)) {

        switch (tape[cursor]) {

            case "0":
                switch (conditionCount) {

                    case 0:
                        tape[cursor] = 1;
                        print(tape, cursor);
                        break;
                    case 2:
                        conditionCount++;
                        tape[cursor] = 1;
                        print(tape, cursor);
                        break;
                    case 3:
                        conditionCount = 0;
                        print(tape, cursor);
                        cursor -= 2;
                        break;
                    default:
                        print(tape, cursor);
                        conditionCount++;
                        break;
                }
                break;
            case "1":
                switch (conditionCount) {

                    case 0:
                        tape[cursor] = "h";
                        print(tape, cursor);
                        break;
                    case 2:
                        conditionCount++;
                        tape[cursor] = "h";
                        print(tape, cursor);
                        break;
                    case 1:
                        conditionCount++;
                        print(tape, cursor);
                        break;
                    case 3:
                        print(tape, cursor);
                        cursor -= 2;
                        break;
                }
                break;
            default:
                if (conditionCount == 3) {
                    flag = false;
                    print(tape, cursor);
                } else {
                    conditionCount++;
                    print(tape, cursor);
                }
                break;
        }
        cursor++;
    }
}

function roolsHardGo() {

    let tapeInput = form.elements['input-string'].value;
    let cursor = form.elements['cursor'].value;
    let tape = [...tapeInput];
    for (; cursor < tape.length; cursor++) {
        if (cursor == 0) {
            print(tape, cursor);
        } else {
            if (tape[cursor] == "b" && tape[cursor - 1] == "a") {
                tape.splice(cursor - 1, 2, "e");
            }
            print(tape, cursor);
        }
    }
    print(tape, tape.length + 1);
}


function 
roolsExtraGo() {

    let tapeInput = form.elements['input-string'].value;
    let cursor = form.elements['cursor'].value;
    let tape = [...tapeInput];
    let transpozeTape = [];

    if (cursor > 0) {
        print(tape, cursor);
        cursor = 0;
    }

    for (; cursor < tape.length; cursor++) {
        transpozeTape.splice(0, 0, tape[cursor]);
        printExtra(tape, cursor, transpozeTape);
    }
    printExtra(tape, cursor + 1, transpozeTape);
}

document.getElementById("easy-rools-start").onclick = roolsEasyGo;
document.getElementById("medium-rools-start").onclick = roolsMediumGo;
document.getElementById("hard-rools-start").onclick = roolsHardGo;
document.getElementById("extra-rools-start").onclick = roolsExtraGo;