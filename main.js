const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";
const upCommand = "i";
const downCommand = "k";
const leftCommand = "j";
const rightCommand = "l";

class Field {
  constructor(fieldArray) {
    this.fieldArray = fieldArray;
  }
  print() {
    let fieldDraw = "";
    for (let fieldRow = 0; fieldRow < this.fieldArray.length; fieldRow++) {
      // Option 1
      //   for (
      //     let fieldColumn = 0;
      //     fieldColumn < this.fieldArray[fieldRow].length;
      //     fieldColumn++
      //   ) {
      //     fieldDraw += this.fieldArray[fieldRow][fieldColumn];
      //   fieldDraw += "\n";
      // Option 2
      fieldDraw += "\n\t " + this.fieldArray[fieldRow].join("");
    }
    console.log(fieldDraw);
    return fieldDraw;
  }
  validateInput(userInput) {
    let flag =
      userInput === upCommand ||
      userInput === downCommand ||
      userInput === leftCommand ||
      userInput === rightCommand;
    return flag;
  }
  generateNextPosition(userInput, currentPosition) {
    let nextPosition = currentPosition;
    if (userInput === upCommand) {
      nextPosition[0] -= 1;
    }
    if (userInput === downCommand) {
      nextPosition[0] += 1;
    }
    if (userInput === leftCommand) {
      nextPosition[1] -= 1;
    }
    if (userInput === rightCommand) {
      nextPosition[1] += 1;
    }
    return nextPosition;
  }
  validatePosition(userPosition) {
    let positionResponse = { scenario: "in-game", flag: true };
    if (
      userPosition[0] < 0 ||
      userPosition[1] < 0 ||
      userPosition[0] >= this.fieldArray.length ||
      userPosition[1] >= this.fieldArray[0].length
    ) {
      positionResponse["scenario"] = "Out of bounds.";
      positionResponse["flag"] = false;
    } else if (this.fieldArray[userPosition[0]][userPosition[1]] === hole) {
      positionResponse["scenario"] = "Sorry, you fell down in a hole.";
      positionResponse["flag"] = false;
    } else if (this.fieldArray[userPosition[0]][userPosition[1]] === hat) {
      positionResponse["scenario"] = "Congrats. You Found Your Hat!!!";
      positionResponse["flag"] = false;
    } else {
      this.moveUser(userPosition[0], userPosition[1]);
    }
    return positionResponse;
  }
  moveUser(x, y) {
    this.fieldArray[x][y] = pathCharacter;
  }

  static generateField(nRows, nColumns) {
    // Plain Field
    let newField = Array(nRows);
    for (let j = 0; j < nRows; j++) {
      newField[j] = Array(nColumns).fill(fieldCharacter);
    }

    // Start Position
    newField[0][0] = pathCharacter;

    // Hat Position
    let hatPosition = [0, 0];
    while (newField[hatPosition[0]][hatPosition[1]] === pathCharacter) {
      hatPosition = [
        Math.floor(Math.random() * nRows),
        Math.floor(Math.random() * nColumns),
      ];
    }
    newField[hatPosition[0]][hatPosition[1]] = hat;

    // Holes
    let nHoles = Math.floor((nRows + nColumns) / 2);
    for (let k = 0; k < nHoles; k++) {
      let holePosition = [0, 0];
      while (
        newField[holePosition[0]][holePosition[1]] === pathCharacter ||
        newField[holePosition[0]][holePosition[1]] === hat ||
        newField[holePosition[0]][holePosition[1]] === hole
      ) {
        holePosition = [
          Math.floor(Math.random() * nRows),
          Math.floor(Math.random() * nColumns),
        ];
      }

      newField[holePosition[0]][holePosition[1]] = hole;
    }

    return newField;
  }
}

const myField = new Field(Field.generateField(5, 5));
myField.print();

console.log("--------------\nFind Your Hat\n--------------");
// Information to User
console.log(
  ` \n***\nInstructions: \n - Up: ${upCommand}\n - Down: ${downCommand}\n - Left: ${leftCommand}\n - Right: ${rightCommand}\n***\n`
);

myField.print();
let playing = prompt("\nWanna play? (y/n): ").toLowerCase();
if (playing != "y") {
  playing = false;
}
let userPosition = [0, 0];
while (playing) {
  // Show current user position
  // console.log(userPosition);
  // Print field
  myField.print();

  // Ask user for input
  let userInput = prompt(
    "\nWhich direction would you like to move?: "
  ).toLowerCase();

  // Validate input
  if (myField.validateInput(userInput)) {
    // User next position
    let nextUserPosition = myField.generateNextPosition(
      userInput,
      userPosition
    );
    // New Position Response
    let nextPositionResponse = myField.validatePosition(nextUserPosition);
    if (!nextPositionResponse["flag"]) {
      playing = false;
      console.log(nextPositionResponse["scenario"]);
    }
  } else {
    console.log("\nNot a valid command. Follow the instructions.\n");
  }
}
