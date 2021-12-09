const textArea = document.getElementById("text-input");
const coordInput = document.getElementById("coord");
const valInput = document.getElementById("val");
const errorMsg = document.getElementById("error");

const numRegex = /^[1-9]$/;
const coorRegex = /^[A-I][1-9]$/;

function fillPuzzle(data) {
  for(let i=0; i<81; i++) {
    let rowLetter = String.fromCharCode('A'.charCodeAt(0) + Math.floor(i/9));
    let colNumber = (i%9) + 1;
    document.getElementsByClassName(rowLetter + colNumber)[0].innerText = " ";
    document.getElementsByClassName(rowLetter + colNumber)[0].classList.remove("initial", "check");
  }

  let stringLength = data.length < 81 ? data.length : 81;
  for(let j=0; j<stringLength; j++) {
    let rowLetter = String.fromCharCode('A'.charCodeAt(0) + Math.floor(j/9));
    let colNumber = (j%9) + 1;
    if(!data[j] || data[j] === ".") {
      document.getElementsByClassName(rowLetter + colNumber)[0].innerText = " ";
      continue;
    }

    if(numRegex.test(data[j])) {
      document.getElementsByClassName(rowLetter + colNumber)[0].classList.add("initial");
    }

    document.getElementsByClassName(rowLetter + colNumber)[0].innerText = data[j];
  }
  return;
}

document.addEventListener("DOMContentLoaded", () => {
  textArea.value = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  fillPuzzle(textArea.value);
});

textArea.addEventListener("input", () => {
  document.getElementById("count").innerText = textArea.value.length;
  fillPuzzle(textArea.value);
});

coordInput.addEventListener("input", () => {
  fillPuzzle(textArea.value);
  const splitCoor = coordInput.value.split("");
  splitCoor[0] = splitCoor[0].toUpperCase();
  const correctCoor = splitCoor.join("");
  if(coorRegex.test(correctCoor)) {
    document.getElementsByClassName(correctCoor)[0].classList.add("check");
    if(numRegex.test(valInput.value)) {
      document.getElementsByClassName(correctCoor)[0].innerText = valInput.value;
    }
  }
});

valInput.addEventListener("input", () => {
  fillPuzzle(textArea.value);
  const splitCoor = coordInput.value.split("");
  splitCoor[0] = splitCoor[0].toUpperCase();
  const correctCoor = splitCoor.join("");
  if(coorRegex.test(correctCoor) && numRegex.test(valInput.value)) {
    document.getElementsByClassName(correctCoor)[0].classList.add("check");
    document.getElementsByClassName(correctCoor)[0].innerText = valInput.value;
  }
});

function fillSolvedPuzzle(data) {
  for(let i=0; i<81; i++) {
    let rowLetter = String.fromCharCode('A'.charCodeAt(0) + Math.floor(i/9));
    let colNumber = (i%9) + 1;
    document.getElementsByClassName(rowLetter + colNumber)[0].innerText = data[i];
    document.getElementsByClassName(rowLetter + colNumber)[0].classList.remove("check");
  }
  return;
}

async function getSolved() {
  const stuff = {"puzzle": textArea.value}
  const data = await fetch("/api/solve", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(stuff)
  })
  const parsed = await data.json();
  if(parsed.error) {
    errorMsg.innerHTML = `${JSON.stringify(parsed, null, 1)}`;
    return
  }
  fillSolvedPuzzle(parsed.solution)
}

async function getChecked() {
  const stuff = {"puzzle": textArea.value, "coordinate": coordInput.value, "value": valInput.value}
  const data = await fetch("/api/check", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(stuff)
  })
  const parsed = await data.json();
  errorMsg.innerHTML = `${JSON.stringify(parsed, null, 1)}`;
}

document.getElementById("solve-button").addEventListener("click", getSolved)
document.getElementById("check-button").addEventListener("click", getChecked)