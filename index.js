const basicOperationBtns = document.querySelectorAll(".button.basic-operation");
const numberBtns = document.querySelectorAll(".button.number");
const dotBtn = document.querySelectorAll(".button.dot");
const equalsBtn = document.querySelector(".button.equals");
const clearAllBtn = document.querySelector(".button.clear-all");
const clearOneBtn = document.querySelector(".button.clear-one");
const screenWrite = document.querySelector(".write");

const BASIC = "basic";
const IN_FUNCTION = "in_function";

let mode = BASIC;

clearOneBtn.addEventListener("click", () => {
  if (screenWrite.textContent.length > 0) {
    let secondLastIndex = screenWrite.textContent.length - 1;
    screenWrite.textContent = screenWrite.textContent.slice(0, secondLastIndex);
  }
});
clearAllBtn.addEventListener("click", () => (screenWrite.textContent = ""));

numberBtns.forEach((btn) =>
  btn.addEventListener("click", (e) => appendCharacter(e))
);
basicOperationBtns.forEach((btn) =>
  btn.addEventListener("click", (e) => appendCharacter(e))
);

function appendCharacter(e) {
  if (e.target.nodeName === "DIV") {
    let buttonSpan = e.target.querySelector("span");
    let character = buttonSpan.textContent;
    screenWrite.textContent += character;
  } else {
    let character = e.target.textContent;
    screenWrite.textContent += character;
  }
}