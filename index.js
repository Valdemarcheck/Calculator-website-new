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

equalsBtn.addEventListener("click", () => {
  if (isStringValid()) {
    write.textContent = evaluateExpression();
  }
});

function evaluateExpression() {
  let expression = write.textContent;
  let isNegative = false;

  if (isFirstNumberNegative()) {
    expression = trimFirstSign(expression);
    isNegative = true;
  }

  let sign = getSign(expression);

  if (sign) {
    let numbers = expression.split(sign).map((number) => {
      return trimExtraZeros(number);
    });
    console.log(numbers);

    let result = operate(numbers[0], numbers[1], sign, isNegative);
    return result !== null ? result : expression;
  }
}

function getSign(expression) {
  if (isFirstNumberNegative()) {
    expression = trimFirstSign(expression);
  }
  for (let sign of MATH_OPERANDS) {
    if (expression.includes(sign)) {
      return sign;
    }
  }
  return null;
}

function appendCharacter(e) {
  if (isStringTooLong()) return;

  let character = getButtonCharacter(e);

  if (isStringValid() && isCharacterAnOperand(character)) {
    write.textContent = evaluateExpression();
  }

  let shouldReplaceLastCharacter =
    isCharacterAnOperand(character) && isLastCharacterMathOperand();

  if (isCharacterAnOperand(character) && isStringEmpty()) return;

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

function trimExtraZeros(number) {
  let numberString = number.toString();
  let dotIndex = includesDot(numberString) ? numberString.indexOf(".") : null;

  numberString = trimZerosOnOneSide(numberString);

  if (dotIndex) {
    let reversedString = reverseStr(numberString);
    reversedString = trimZerosOnOneSide(reversedString);
    return +reverseStr(reversedString);
  } else {
    return +numberString;
  }
}

function trimZerosOnOneSide(string) {
  for (let char of string) {
    if (char !== "0") break;
    string = trimFirstSign(string);
  }

  if (string[0] === ".") {
    string = trimFirstSign(string);
  }

  return string;
}

function reverseStr(string) {
  return Array.from(string).reverse().join();
}

function trimFirstSign(expression) {
  return expression.slice(1);
}

function isStringValid() {
  return (
    !isStringEmpty() &&
    !isLastCharacterMathOperand() &&
    containsMathOperands() &&
    !isLastCharacterDot()
  );
}

function isStringEmpty() {
  return write.textContent === "";
}

function isFirstNumberNegative() {
  return write.textContent[0] === "-";
}

function isLastCharacterMathOperand() {
  let lastCharIndex = write.textContent.length - 1;
  return MATH_OPERANDS.includes(write.textContent[lastCharIndex]);
}

function containsMathOperands() {
  return getSign(write.textContent) ? true : false;
}

function isLastCharacterDot() {
  return write.textContent[write.length - 1] === ".";
}

function includesDot(string) {
  return string.includes(".");
}

function isCharacterAnOperand(char) {
  return MATH_OPERANDS.includes(char);
}

function isStringTooLong() {
  return write.textContent.length >= MAX_SIGNS;
}

function operate(a, b, sign, isNegative) {
  let result;

  a = +a;
  b = +b;
  if (isNegative) a *= -1;

  switch (sign) {
    case "^":
      result = a ** b;
      break;
    case "√":
      if (a >= 2 && parseInt(a) === a) {
        result = b ** (1 / a);
      } else {
        return null;
      }
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      if (b !== 0) {
        result = a / b;
      } else {
        return null;
      }
      break;
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
  }
  return result;
}
