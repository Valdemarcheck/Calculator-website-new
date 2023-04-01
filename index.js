const basicOperationBtns = document.querySelectorAll(".button.basic-operation");
const numberBtns = document.querySelectorAll(".button.number");
const extrasBtns = document.querySelectorAll(
  ".extras .button[data-button-attach]"
);
const exitButtons = document.querySelectorAll(".button.exit");
const dotBtn = document.querySelector(".button.dot");
const equalsBtn = document.querySelector(".button.equals");
const clearAllBtn = document.querySelector(".button.clear-all");
const clearOneBtn = document.querySelector(".button.clear-one");
const write = document.querySelector(".write");
const MAX_SIGNS = 100;

const OPERAND_MODE = 0;
const DOT_MODE = 1;

const MATH_OPERANDS = ["^", "√", "*", "/", "-", "+"];
const MAX_LENGTH = 100;
const MAX_EXPONENT = 21;
let precision = 3;

// const BASIC = "basic";
// const IN_FUNCTION = "in_function";

// let mode = BASIC;

extrasBtns.forEach((button) => {
  let panelType = button.getAttribute("data-button-attach");
  let panel = document.querySelector(generatePanelQuery(panelType));
  if (panel) {
    button.addEventListener("click", () => showPanel(panel));
  }
});

exitButtons.forEach((button) => {
  button.addEventListener("click", (e) => hidePanel(e));
});

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

dotBtn.addEventListener("click", appendDot);

equalsBtn.addEventListener("click", () => {
  if (isStringValid(OPERAND_MODE)) {
    write.textContent = evaluateExpression();
  }
  if (isStringInfinity()) {
    write.textContent = "∞";
  }
});

function generatePanelQuery(type) {
  return `.black[data-button-attach=${type}]`;
}

function hidePanel(e) {
  let panel = e.target.closest(".black");
  panel.style.display = "none";
}

function showPanel(panel) {
  panel.style.display = "flex";
}

function evaluateExpression() {
  let expression = write.textContent;
  let isNegative = false;

  if (isFirstNumberNegative()) {
    expression = trimFirstCharacter(expression);
    isNegative = true;
  }

  let sign = getSign(expression);

  if (sign) {
    let numbers = getNumbers(write.textContent, sign);
    let result = operate(numbers[0], numbers[1], sign, isNegative);
    if (isNumberTooLong(result)) result = "∞";
    return result !== null ? result : expression;
  }
}

function appendCharacter(e) {
  if (isStringTooLong()) return;
  if (isStringInfinity()) write.textContent = "";

  let character = getButtonCharacter(e);

  if (isStringValid(OPERAND_MODE) && isCharacterAnOperand(character)) {
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

function appendDot() {
  if (isStringValid(DOT_MODE)) write.textContent += ".";
}

function getSign(expression) {
  if (isFirstNumberNegative()) {
    expression = trimFirstCharacter(expression);
  }
  for (let sign of MATH_OPERANDS) {
    if (includesString(expression, sign)) {
      return sign;
    }
  }
  return null;
}

function getNumbers(string, sign) {
  return string.split(sign).map((number) => {
    return trimExtraZeros(number);
  });
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
  let dotIndex = includesString(numberString, ".")
    ? numberString.indexOf(".")
    : null;

  numberString = trimZerosOnOneSide(numberString, false);

  if (dotIndex) {
    let reversedString = reverseStr(numberString);
    reversedString = trimZerosOnOneSide(reversedString, true);
    return +reverseStr(reversedString);
  } else {
    return +numberString;
  }
}

function trimZerosOnOneSide(string, reversed) {
  for (let char of string) {
    if (char !== "0") break;
    string = trimFirstCharacter(string);
  }

  if (string[0] === ".") {
    if (reversed) {
      string = trimFirstCharacter(string);
    } else {
      string = "0" + string;
    }
  }

  return string;
}

function reverseStr(string) {
  return Array.from(string).reverse().join("");
}

function trimFirstCharacter(expression) {
  return expression.slice(1);
}

function isStringValid(mode) {
  if (mode === OPERAND_MODE) {
    let stringIsValidForOperand =
      !isStringEmpty() &&
      !isLastCharacterMathOperand() &&
      containsMathOperands() &&
      !isLastCharacterDot();

    return stringIsValidForOperand;
  } else if (mode === DOT_MODE) {
    let stringIsValidForDot =
      !isStringEmpty() &&
      !isLastCharacterMathOperand() &&
      !isLastCharacterDot();

    if (stringIsValidForDot) {
      let expression = write.textContent;
      let sign = getSign(expression);
      if (sign) {
        let secondNumber = getNumbers(expression, sign)[1].toString();
        if (!includesString(secondNumber, ".")) return true;
      } else {
        if (!includesString(expression, ".")) return true;
      }
    }
    return false;
  }
}

function isStringInfinity() {
  return (
    includesString(write.textContent, "Infinity") || write.textContent == "∞"
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

function includesString(string, stringToLookFor) {
  return string.toString().includes(stringToLookFor);
}

function isCharacterAnOperand(char) {
  return MATH_OPERANDS.includes(char);
}

function isStringTooLong() {
  return write.textContent.length >= MAX_SIGNS;
}

function isNumberTooLong(number) {
  return number.toString().length > MAX_LENGTH;
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
  return fromScientificToBasic(basicRoundNumber(result));
}

function fromScientificToBasic(number) {
  if (!number.toString().includes("e")) return number;
  let numberAndExponent = number.toString().split("e");
  let exponent = numberAndExponent[1];
  if (+exponent.slice(1) >= MAX_EXPONENT) {
    return "∞";
  } else {
    return BigInt(numberAndExponent[0]);
  }
}

function basicRoundNumber(number) {
  if (includesString(number, ".")) {
    let roundedDigit = "";

    let numberParts = number.toString().split(".");
    let wholePart = numberParts[0];
    let decimalPart = numberParts[1];
    if (decimalPart.length <= precision) return number;

    let numberAtPrecision = +decimalPart[precision];
    decimalPart = decimalPart.slice(0, precision);

    roundedDigit = +decimalPart[decimalPart.length - 1];
    if (+numberAtPrecision >= 5) roundedDigit++;

    decimalPart = decimalPart.slice(0, precision - 1) + roundedDigit;
    number = parseFloat(wholePart + "." + decimalPart);
  }
  return number;
}
