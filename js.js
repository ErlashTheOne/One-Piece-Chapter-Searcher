window.onload = function() {
    let buttons = document.querySelectorAll(".Calculator__keyboard button");
    let display = document.querySelector(".Calculator__display .display");
    let deleteOne = document.querySelector(".Calculator__keyboard #delete");
    let clearAll = document.querySelector(".Calculator__keyboard #clearAll");
    let positiveNegative = document.querySelector(".Calculator__keyboard #positiveNegative");
    let squareRoot = document.querySelector(".Calculator__keyboard #squareRoot");
    let plus = document.querySelector(".Calculator__keyboard #plus");
    let minus = document.querySelector(".Calculator__keyboard #minus");
    let multiplication = document.querySelector(".Calculator__keyboard #multiplication");
    let divide = document.querySelector(".Calculator__keyboard #division");
    let equal = document.querySelector(".Calculator__keyboard #equal");
    let domArray = [
        document.querySelector(".Calculator__keyboard #num0"), 
        document.querySelector(".Calculator__keyboard #num1"),
        document.querySelector(".Calculator__keyboard #num2"),
        document.querySelector(".Calculator__keyboard #num3"),
        document.querySelector(".Calculator__keyboard #num4"),
        document.querySelector(".Calculator__keyboard #num5"),
        document.querySelector(".Calculator__keyboard #num6"),
        document.querySelector(".Calculator__keyboard #num7"),
        document.querySelector(".Calculator__keyboard #num8"),
        document.querySelector(".Calculator__keyboard #num9"),
        document.querySelector(".Calculator__keyboard #point")
    ];
    var invisibleDisplay = "";

    toggleItem(buttons);
    numbersOnDidplay(domArray, display);
    deleteOneDisplay(deleteOne, display);
    deleteAll(clearAll, display);
    changeToNegativeOrPositive(positiveNegative, display);
    aplySquareRoot(squareRoot, display);
    add(plus, display);
    subtract(minus, display);
    multiply(multiplication, display);
    division(divide, display);
    resolveOperation(equal, display);
};

function toggleItem(elem) {
    for (let i = 0; i < elem.length; i++) {
        elem[i].addEventListener("click", function() {
            this.classList.add('clicked');
            setTimeout(() => {  this.classList.remove('clicked'); }, 200);
        });
    }
}

function numbersOnDidplay(domArray, display) {
    for (let i = 0; i < domArray.length; i++) {
        domArray[i].addEventListener("click", function() {
            if(this == document.querySelector(".Calculator__keyboard #point")) {
                if(!display.textContent.includes('.')) {
                    display.innerHTML += this.value;
                }
            } else {
                display.innerHTML += this.value;
            }
        });
    }
}

function deleteOneDisplay(deleteOne, display) {
    deleteOne.addEventListener("click", function() {
        let oneDeleted = display.textContent.slice(0, -1);
        display.innerHTML = oneDeleted;
    });
}

function deleteAll(clearAll, display) {
    clearAll.addEventListener("click", function() {
        display.innerHTML = "";
    });
}

function changeToNegativeOrPositive(positiveNegative, display) {
    positiveNegative.addEventListener("click", function() {
        if(display.textContent.includes('-')){
            let noMinus = display.textContent.slice(1);
            display.innerHTML = noMinus;
        } else {
            display.innerHTML = "-" + display.innerHTML;
        }
    });
}

function aplySquareRoot(squareRoot, display){
    squareRoot.addEventListener("click", function() {
        if(!display.textContent.includes('-')){
            let result = roundToFive(Math.sqrt(parseFloat(display.textContent)));
            if((result.toString).length < 10){// arregla esto
                display.innerHTML = result;
            }else {
                displayError("The num is too long", display);
            }
        } else {
            displayError("Can't be negative", display);
        }
    }); 
}

function add(elem, display){
    elem.addEventListener("click", function() {
        equation("+", display);
    });
}

function subtract(elem, display){
    elem.addEventListener("click", function() {
        equation("-", display);
    });
}

function multiply(elem, display){
    elem.addEventListener("click", function() {
        equation("*", display);
    });
}

function division(elem, display){
    elem.addEventListener("click", function() {
        equation("/", display);
    });
}

function equation(operationSign, display){
    let firstNum = parseFloat(display.textContent);
    display.innerHTML = "";
    invisibleDisplay = firstNum + operationSign;
}

function resolveOperation(equal, display) {
    equal.addEventListener("click", function() {
        let secondNum = parseFloat(display.textContent);
        invisibleDisplay += secondNum ;
        let result = roundToFive(eval(invisibleDisplay));
        if((result.toString).length < 10){// arregla esto
            display.innerHTML = result;
            secondNum = result;
        }else {
            displayError("The num is too long", display);
        }

    });
}

function displayError(errorMessage, display){
    display.style.fontSize = '2rem';
    display.style.color = 'red';
    display.innerHTML = errorMessage;
    setTimeout(() => {  
        display.innerHTML = ""; 
        display.style.fontSize = '3.5rem';
        display.style.color = 'black';
    }, 1000);
}

function roundToFive(num) {    
    return +(Math.round(num + "e+"+5)  + "e-"+5);
}