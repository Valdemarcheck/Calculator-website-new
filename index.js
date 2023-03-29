const basicOperationBtns = document.querySelectorAll(".button.basic-operation");
const numberBtns = document.querySelectorAll(".button.number");
const dotBtn = document.querySelectorAll(".button.dot");
const equalsBtn = document.querySelector(".button.equals");
const clearAllBtn = document.querySelector(".button.clear-all");
const clearOneBtn = document.querySelector(".button.clear-one");
const write = document.querySelector(".write");
const MAX_SIGNS = 40;

const MATH_OPERANDS = ["√", "^", "*", "/", "+", "-"];

const BASIC = "basic";
const IN_FUNCTION = "in_function";

let mode = BASIC;

clearOneBtn.addEventListener("click", () => {
  if (write.textContent.length > 0) {
    let secondLastIndex = write.textContent.length - 1;
    write.textContent = write.textContent.slice(0, secondLastIndex);
  }
});

clearAllBtn.addEventListener("click", () => (write.textContent = ""));

numberBtns.forEach((btn) =>
  btn.addEventListener("click", (e) => appendCharacter(e))
);
basicOperationBtns.forEach((btn) =>
  btn.addEventListener("click", (e) => appendCharacter(e))
);

equalsBtn.addEventListener("click", evaluateExpression);

function appendCharacter(e) {
  if (isStringTooLong()) return;
  if (e.target.nodeName === "DIV") {
    let buttonSpan = e.target.querySelector("span");
    let character = buttonSpan.textContent;
    write.textContent += character;
  } else {
    let character = e.target.textContent;
    write.textContent += character;
  }
}

function evaluateExpression() {
  if (isStringValid()) {
    if (mode === BASIC) {
      performOperations(write.textContent);
    }
  } else {
    console.log("invalid!");
  }
}

function performOperations(expression) {
  for (let sign of MATH_OPERANDS) {
    let pattern = new RegExp(`(?=([\\d\\.]+\\${sign}[\\d\\.]+))`, "g");
    let allMatches = [...expression.matchAll(pattern)];
    console.log(allMatches);
    let evaluatedMatches = allMatches.reduce((solvedMatches, match) => {
      let expression = match[1];
      let counterparts = expression.split(sign);
      let result = operate(counterparts[0], counterparts[1], sign);
      solvedMatches[expression] = result;
    }, {});
    console.log(evaluatedMatches);
  }
}

function isStringValid() {
  return !(
    isStringEmpty() ||
    isLastCharacterDot() ||
    isLastCharacterMathOperand()
  );
}

function isStringEmpty() {
  return write.textContent === "";
}

function isLastCharacterMathOperand() {
  let lastCharIndex = write.textContent.length - 1;
  return MATH_OPERANDS.includes(write.textContent[lastCharIndex]);
}

function isLastCharacterDot() {
  return write.textContent[write.length - 1] === ".";
}

function isStringTooLong() {
  return write.textContent.length >= MAX_SIGNS;
}

function operate(a, b, sign) {
  a = +a;
  b = +b;
  let result;
  switch (sign) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = a / b;
      break;
    case "^":
      result = a ** b;
    case "√":
      result = Math.pow(a, 1 / b);
  }
  return result.toFixed(5);
}
