const basicOperationBtns = document.querySelectorAll(".button.basic-operation");
const numberBtns = document.querySelectorAll(".button.number");
const dotBtn = document.querySelectorAll(".button.dot");
const equalsBtn = document.querySelector(".button.equals");
const clearAllBtn = document.querySelector(".button.clear-all");
const clearOneBtn = document.querySelector(".button.clear-one");
const write = document.querySelector(".write");
const MAX_SIGNS = 40;

const MATH_OPERANDS = ["^", "√", "*", "/", "-", "+"];
let proximity = 5;

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

function appendCharacter(e) {
  let character;

  if (isStringTooLong()) return;
  character = getButtonCharacter(e);

  let shouldReplaceLastCharacter =
    MATH_OPERANDS.includes(character) &&
    isLastCharacterMathOperand() &&
    !containsMathOperands();

  if (shouldReplaceLastCharacter) {
    let writeText = write.textContent;
    write.textContent = writeText.slice(0, writeText.length - 1) + character;
    return;
  } else {
    write.textContent += character;
  }
}

function getButtonCharacter(e) {
  if (e.target.nodeName === "DIV") {
    let buttonSpan = e.target.querySelector("span");
    return buttonSpan.textContent;
  } else {
    return e.target.textContent;
  }
}

function isStringEmpty() {
  return write.textContent === "";
}

function isLastCharacterMathOperand() {
  let lastCharIndex = write.textContent.length - 1;
  return MATH_OPERANDS.includes(write.textContent[lastCharIndex]);
}

function containsMathOperands() {
  return write.textContent.includes(MATH_OPERANDS);
}

function isLastCharacterDot() {
  return write.textContent[write.length - 1] === ".";
}

function isStringTooLong() {
  return write.textContent.length >= MAX_SIGNS;
}

function operate(a, b, sign) {
  let result;
  a = +a;
  b = +b;
  switch (sign) {
    case "^":
      result = a ** b;
      break;
    case "√":
      result = b ** (1 / a);
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = a / b;
      break;
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
  }
  return Math.round(result);
}
