class SudokuSolver {
  validate(puzzleObj, rowArrayValue, colArrayValue, regionArrayValue) {
    const puzzleRegex = /[^(1-9.)]/g;
    if(puzzleRegex.test(puzzleObj.puzzle)) {
      return {error: "Invalid characters in puzzle"};
    }

    if(puzzleObj.puzzle.length!==81) {
      return {error: "Expected puzzle to be 81 characters long"};
    }

    const coorRegex = /^[A-I][1-9]$/i;
    if(puzzleObj.coordinate) {
      if(coorRegex.test(puzzleObj.coordinate)==false) {
        return {error: "Invalid coordinate"};
      }
    }

    if(puzzleObj.value) {
      const valueRegex = /^[1-9]$/;
      if(valueRegex.test(puzzleObj.value)==false) {
        return {error: "Invalid value"};
      }
    }

    const checkDuplicate = (arr) => {
      let tempArr = [...arr];
      for(let i=0; i<tempArr.length; i++) {
        tempArr[i] = tempArr[i].filter(i => i!==".");
        let dupArr = [...new Set(tempArr[i])];
        if(tempArr[i].length!==dupArr.length) {
          return {error: 'Puzzle cannot be solved'};
        }
      }
    };
    if(rowArrayValue) {
      if(checkDuplicate(rowArrayValue)) {
        return checkDuplicate(rowArrayValue);
      }
      if(checkDuplicate(colArrayValue)) {
        return checkDuplicate(colArrayValue);
      }
      if(checkDuplicate(regionArrayValue)) {
        return checkDuplicate(regionArrayValue);
      }
    }
  }

  checkRowPlacement(index, rowArray, puzzle, value) {
    let indexRowArr = null;
    for(let i=0; i<rowArray.length; i++) {
      if(rowArray[i].includes(index)) {
        indexRowArr = rowArray[i];
      }
    }
    indexRowArr = indexRowArr.map(i => puzzle[i]);
    if(indexRowArr.includes(String(value))) {
      return false;
    } else {
      return true;
    }
  }

  checkColPlacement(index, colArray, puzzle, value) {
    let indexColArr = null;
    for(let i=0; i<colArray.length; i++) {
      if(colArray[i].includes(index)) {
        indexColArr = colArray[i];
      }
    }
    indexColArr = indexColArr.map(i => puzzle[i]);
    if(indexColArr.includes(String(value))) {
      return false;
    } else {
      return true;
    }
  }

  checkRegionPlacement(index, regionArray, puzzle, value) {
    let indexRegionArr = null;
    for(let i=0; i<regionArray.length; i++) {
      if(regionArray[i].includes(index)) {
        indexRegionArr = regionArray[i];
      }
    }
    indexRegionArr = indexRegionArr.map(i => puzzle[i]);
    if(indexRegionArr.includes(String(value))) {
      return false;
    } else {
      return true;
    }
  }

  solve(rowArray, colArray, regionArray, rowArrayValue) {
    let finalPuzzle = [];

    // Populate all empty cells with potential solution
    for(let i=0; i<rowArrayValue.length; i++) {
      let populateCell = [];
      for(let j=1; j<10; j++) {
        if(!rowArrayValue[i].includes(String(j))) {
          populateCell.push(j);
        }
      }

      const populate = (val) => {
        if(val!==".") {
          return val = Number(val);
        } else {
          return val = populateCell;
        }
      };

      for(let k=0; k<rowArrayValue[i].length; k++) {
        finalPuzzle.push(populate(rowArrayValue[i][k]));
      }
    }

    const newFinalPuzzle = (finalPuzzle, groupArray) => {
      let tempPuzzle = [];
      for(let i=0; i<groupArray.length; i++) {
        // populate cells in sub-group
        let tempSubGroupValue = [];
        for(let j=0; j<groupArray[i].length; j++) {
          tempSubGroupValue.push(finalPuzzle[groupArray[i][j]]);
        }

        // filter out solved cells in sub-group
        let eliminateThese = tempSubGroupValue.filter(x => Number.isInteger(x));

        // remove duplicates in sub-group
        for(let k=0; k<tempSubGroupValue.length; k++) {
          if(Array.isArray(tempSubGroupValue[k])) {
            let dupRemovedArr = [];
            for(let l=0; l<tempSubGroupValue[k].length; l++) {
              if(!eliminateThese.includes(tempSubGroupValue[k][l])) {
                dupRemovedArr.push(tempSubGroupValue[k][l]);
              }
            }

            if(dupRemovedArr.length==1) {
              tempSubGroupValue[k] = dupRemovedArr[0];
            } else {
              tempSubGroupValue[k] = dupRemovedArr;
            }
          }
        }

        // tempPuzzle in group order, flattened
        for(let m=0; m<tempSubGroupValue.length; m++) {
          tempPuzzle.push(tempSubGroupValue[m]);
        }
      }

      // groupArray flattened
      let flatArray = [];
      for(let n=0; n<groupArray.length; n++) {
        for(let o=0; o<groupArray[n].length; o++) {
          flatArray.push(groupArray[n][o]);
        }
      }

      // updatedPuzzle in row order, flattened
      let updatedPuzzle = [];
      for(let p=0; p<81; p++) {
        updatedPuzzle.push(tempPuzzle[flatArray.indexOf(p)]);
      }

      return updatedPuzzle;
    }

    let json = null;
    let puzzleSolved = 0;
    let solveCounter = 0;
    const solvePuzzle = () => {
      for(let q=0; q<finalPuzzle.length; q++) {
        if(Array.isArray(finalPuzzle[q])) {
          if(finalPuzzle[q].length==0) {
            json = {error: "This puzzle has no solution, please check your entries."};
            return;
          } else {
            puzzleSolved++;
          }
        }
      };

      if(puzzleSolved!==0 && solveCounter<7) {
        finalPuzzle = newFinalPuzzle(finalPuzzle, colArray);
        finalPuzzle = newFinalPuzzle(finalPuzzle, regionArray);
        finalPuzzle = newFinalPuzzle(finalPuzzle, rowArray);
        puzzleSolved = 0;
        solveCounter++;
        solvePuzzle();
      } else if(puzzleSolved!==0 && solveCounter>=7) {
        json = {error: "This puzzle has multiple solutions, please refine your entries."};
        return;
      } else {
        finalPuzzle = finalPuzzle.join("");
        json = {solution: finalPuzzle};
      }
    };

    solvePuzzle();
    return json;
  }
}

module.exports = SudokuSolver;
