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

