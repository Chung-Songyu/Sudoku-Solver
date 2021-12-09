const assert = require('chai').assert;
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
  // #1
  test("Valid puzzle string of 81 characters", () => {
    assert.equal(solver.validate({puzzle: ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3"}, null, null, null), null);
  });

  // #2
  test("Puzzle string with invalid characters (not 1-9 or .)", () => {
    assert.deepEqual(solver.validate({puzzle: "Z4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3"}, null, null, null), {error: "Invalid characters in puzzle"});
  });

  // #3
  test("Puzzle string that is not 81 characters in length", () => {
    assert.deepEqual(solver.validate({puzzle: "4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3"}, null, null, null), {error: "Expected puzzle to be 81 characters long"});
  });

  // cellIndex
  const cellIndex = (coordinate) => {
    let splitCoordinate = coordinate.split("");
    splitCoordinate[0] = splitCoordinate[0].toUpperCase();
    splitCoordinate[1] = Number(splitCoordinate[1]);
    let index = null;
    switch(splitCoordinate[0]) {
      case "A":
        index = -1 + splitCoordinate[1];
        break;
      case "B":
        index = 8 + splitCoordinate[1];
        break;
      case "C":
        index = 17 + splitCoordinate[1];
        break;
      case "D":
        index = 26 + splitCoordinate[1];
        break;
      case "E":
        index = 35 + splitCoordinate[1];
        break;
      case "F":
        index = 44 + splitCoordinate[1];
        break;
      case "G":
        index = 53 + splitCoordinate[1];
        break;
      case "H":
        index = 62 + splitCoordinate[1];
        break;
      case "I":
        index = 71 + splitCoordinate[1];
        break;
    }
    return index;
  };

  // rowArray
  const rowArray = [];
  let rowSubArray = [];
  let rowI = 0;
  const rowRecursion = () => {
    while(rowSubArray.length<=8) {
      rowSubArray.push(rowI);
      rowI++;
    };
    rowArray.push(rowSubArray);
    rowSubArray = [];
  }
  while(rowArray.length<=8) {
    rowRecursion();
  };

  // colArray
  const colArray = [];
  let colSubArray = [];
  let colI = 0;
  const colRecursion = () => {
    while(colSubArray.length<=8) {
      colSubArray.push(colArray.length + colI*9);
      colI++;
    };
    colArray.push(colSubArray);
    colSubArray = [];
    colI = 0;
  }
  while(colArray.length<=8) {
    colRecursion();
  };

  // regionArray
  const regionArray = [[0],[3],[6],[27],[30],[33],[54],[57],[60]];
  function populateRegionArray(regionSubArray) {
    const num = regionSubArray[0];
    regionSubArray.push(num+1);
    regionSubArray.push(num+2);
    regionSubArray.push(num+9);
    regionSubArray.push(num+10);
    regionSubArray.push(num+11);
    regionSubArray.push(num+18);
    regionSubArray.push(num+19);
    regionSubArray.push(num+20);
  }
  regionArray.forEach(populateRegionArray);

  // #4
  test("Valid row placement", () => {
    assert.equal(solver.checkRowPlacement(cellIndex("A1"), rowArray, ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3", 2), true);
  });

  // #5
  test("Invalid row placement", () => {
    assert.equal(solver.checkRowPlacement(cellIndex("A1"), rowArray, ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3", 7), false);
  });

  // #6
  test("Valid column placement", () => {
    assert.equal(solver.checkColPlacement(cellIndex("A1"), colArray, ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3", 2), true);
  });

  // #7
  test("Invalid column placement", () => {
    assert.equal(solver.checkColPlacement(cellIndex("A1"), colArray, ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3", 9), false);
  });

  // #8
  test("Valid region (3x3 grid) placement", () => {
    assert.equal(solver.checkRegionPlacement(cellIndex("A1"), regionArray, ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3", 2), true);
  });

  // #9
  test("Invalid region (3x3 grid) placement", () => {
    assert.equal(solver.checkRegionPlacement(cellIndex("A1"), regionArray, ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3", 1), false);
  });

  const indexToValue = (groupArr, puzzleString) => {
    let tempArr = [...groupArr];
    for(let i=0; i<tempArr.length; i++) {
      tempArr[i] = tempArr[i].map(index => puzzleString[index]);
    }
    return tempArr;
  };

  // #10
  test("Valid puzzle strings pass the solver", () => {
    assert.deepEqual(solver.solve(rowArray, colArray, regionArray, indexToValue(rowArray, ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3")), {solution: "249835761786194235531726489658971342173542698924683517312459876865317924497268153"});
  });

  // #11
  test("Invalid puzzle strings fail the solver", () => {
    assert.deepEqual(solver.validate({puzzle: "44....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3"}, indexToValue(rowArray, "44....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3"), indexToValue(colArray, "44....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3"), indexToValue(regionArray, "44....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3")), {error: 'Puzzle cannot be solved'});
  });

  // #12
  test("Solver returns the expected solution for an incomplete puzzle", () => {
    assert.deepEqual(solver.solve(rowArray, colArray, regionArray, indexToValue(rowArray, ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3")), {solution: "249835761786194235531726489658971342173542698924683517312459876865317924497268153"});
  });
});
