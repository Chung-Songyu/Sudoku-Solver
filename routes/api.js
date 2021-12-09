'use strict';
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = (app) => {
  let solver = new SudokuSolver();

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

  // Row Grouping - [[0,1,2,3,4,5,6,7,8], ... ,[72,73,74,75,76,77,78,79,80]]
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

  // Column Grouping - [[0,9,18,27,36,45,54,63,72], ... ,[8,17,26,35,44,53,62,71,80]]
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

  // Region Grouping - [[0,1,2,9,10,11,18,19,20], ... ,[60,61,62,69,70,71,78,79,80]]
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

  app.route('/api/check')
    .post((req, res) => {
      const [body, puzzle, coordinate, value] = [req.body, req.body.puzzle, req.body.coordinate, req.body.value];

      if(value==0) {
        return res.json({error: "Invalid value"});
      }

      if(!puzzle | !coordinate | !value) {
        return res.json({error: "Required field(s) missing"});
      }

      if(solver.validate(body, null, null, null)) {
        return res.json(solver.validate(body, null, null, null));
      }

      const index = cellIndex(coordinate);
      if(puzzle[index]==value) {
        return res.json({"valid": true});
      }

      let valid = true;
      let conflict = [];
      if(!solver.checkRowPlacement(index, rowArray, puzzle, value)) {
        valid = false;
        conflict.push("row");
      }
      if(!solver.checkColPlacement(index, colArray, puzzle, value)) {
        valid = false;
        conflict.push("column");
      }
      if(!solver.checkRegionPlacement(index, regionArray, puzzle, value)) {
        valid = false;
        conflict.push("region");
      }
      if(valid) {
        return res.json({"valid": true});
      } else {
        return res.json({"valid": false, "conflict": conflict});
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const [body, puzzle] = [req.body, req.body.puzzle];

      if(!puzzle) {
        return res.json({error: "Required field missing"});
      }

      const indexToValue = (groupArr, puzzleString) => {
        let tempArr = [...groupArr];
        for(let i=0; i<tempArr.length; i++) {
          tempArr[i] = tempArr[i].map(index => puzzleString[index]);
        }
        return tempArr;
      };
      let rowArrayValue = indexToValue(rowArray, puzzle);
      let colArrayValue = indexToValue(colArray, puzzle);
      let regionArrayValue = indexToValue(regionArray, puzzle);

      if(solver.validate(body, rowArrayValue, colArrayValue, regionArrayValue)) {
        return res.json(solver.validate(body, rowArrayValue, colArrayValue, regionArrayValue));
      }

      return res.json(solver.solve(rowArray, colArray, regionArray, rowArrayValue));
    });
};
