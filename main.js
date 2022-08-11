//------------------------------event change theme------------------------------

const toggle = document.querySelector(".toggle");
const toggleButton = document.querySelector(".toggle .toggle-bt");
const styleLefts = ["6px", "50%", "auto"];
const styleRights = ["auto", "auto", "6px"];
const styleTransforms = ["translateY(-50%)", "translate(-50%, -50%)", "translateY(-50%)"];
let toggleStatus = 1;
let ansValue = null;


toggle.addEventListener("click", () => {
  if (toggleStatus === 3) toggleStatus = 1;
  else toggleStatus++;
  changeTheme(toggleStatus);
  toggleButton.style.left = styleLefts[toggleStatus - 1];
  toggleButton.style.right = styleRights[toggleStatus - 1];
  toggleButton.style.transform = styleTransforms[toggleStatus - 1];
})


function changeVar(Var, toggleStatus) {
  document.documentElement.style.setProperty(`${Var}`, `var(${Var}-${toggleStatus})`)
}


const Vars = ["--bg-clr-main", "--bg-clr-toggle-and-keypad", "--bg-clr-screen", "--bg-clr-primary-key", "--shadow-clr-primary-key", "--bg-clr-secondary-key", "--shadow-clr-secondary-key", "--bg-clr-tertiary-key", "--shadow-clr-tertiary-key", "--text-clr-screen", "--text-clr-primary-key", "--text-clr-secondary-key"];


function changeTheme(toggleStatus) {
  for (let i = 0; i < Vars.length; i++) {
    changeVar(Vars[i], toggleStatus);
  }
}




//------------------------------event keys primary and second------------------------------

const display = document.querySelector(".display");


const primaryKeys = document.querySelectorAll(".key_primary");
const primaryKeysValue = ["7", "8", "9", "4", "5", "6", "+", "1", "2", "3", "-", ".", "0", "/", "x"];
for (let i = 0; i < primaryKeysValue.length; i++) {
  primaryKeys[i].addEventListener("click", () => {
    display.innerHTML += primaryKeysValue[i];
  })
}


const secondaryKeys = document.querySelectorAll(".key_secondary");
secondaryKeys[0].addEventListener("click", () => {
  display.innerHTML = display.innerHTML.slice(0, -1);
})
secondaryKeys[1].addEventListener("click", () => {
  display.innerHTML = "";
})
secondaryKeys[2].addEventListener("click", () => {
  if (ansValue !== null)
    display.innerHTML = display.innerHTML.concat(`${ansValue}`);
});




// ------------------------------event result key------------------------------


const resultKey = document.querySelector(".key_tertiary");
resultKey.addEventListener("click", function () {

  if (!checkExpression()) {
    const temp = display.innerHTML;
    display.innerHTML = "ERROR";
    resetAfterError(temp);
    return;
  }

  let expression = getExpression();

  const myMath = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    'x': (x, y) => x * y,
    '/': (x, y) => x / y
  };

  // "*" and "/"  first
  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === "x" || expression[i] === "/") {
      let result = myMath[expression[i]](Number(expression[i - 1]), Number(expression[i + 1]));
      expression.splice(i - 1, 3);
      expression.splice(i - 1, 0, `${result}`);
      i--;
    }
  }

  // "+" and "-" then
  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === "+" || expression[i] === "-") {
      let result = myMath[expression[i]](Number(expression[i - 1]), Number(expression[i + 1]));
      expression.splice(i - 1, 3);
      expression.splice(i - 1, 0, `${result}`);
      i--;
    }
  }

  display.innerHTML = `${expression[0]}`;
  ansValue = Number(display.innerHTML);

})


function checkExpression() {

  //check none and alone character 
  if (display.innerHTML.length === 0) return 0;
  if (display.innerHTML.length === 1) {
    if (isNaN(Number(display.innerHTML[0]))) return 0;
  }

  //check sequence "."
  let countSequenceDot = 0;
  for (let i = 0; i < display.innerHTML.length; i++) {
    if (display.innerHTML[i] === ".") {
      countSequenceDot++;
    }
    else countSequenceDot = 0;
    if (countSequenceDot > 1) return 0;
  }

  //check sequence operator
  let countSequenceOpe = 0;
  for (let i = 0; i < display.innerHTML.length; i++) {
    if (display.innerHTML[i] === "+" || display.innerHTML[i] === "-" || display.innerHTML[i] === "x" || display.innerHTML[i] === "/") {
      countSequenceOpe++;
    }
    else countSequenceOpe = 0;
    if (countSequenceOpe > 1) return 0;
  }


  return 1;
}


function resetAfterError(temp) {
  return new Promise((resolve) => {
    setTimeout(() => {
      display.innerHTML = `${temp}`;
    }, 1000)
  })
}


function getExpression() {
  let expression = [];
  let left = 0;
  //get expression
  for (let i = 0; i < display.innerHTML.length; i++) {
    let number = Number(display.innerHTML[i]);
    if ((!isNaN(number) || display.innerHTML[i] === ".") && i !== display.innerHTML.length - 1)
      continue;
    if (i === display.innerHTML.length - 1) {
      expression.push(display.innerHTML.substring(left));
      continue;
    }
    expression.push(display.innerHTML.substring(left, i));
    expression.push(display.innerHTML[i]);
    left = i + 1;
  }
  return expression;
}

