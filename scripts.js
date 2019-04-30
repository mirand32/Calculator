//Create variables
const displayCurrent=document.querySelector(".display__bottom");
const displayPrev=document.querySelector(".display__top");
const buttons=document.querySelectorAll(".row__button");
const history=document.querySelector(".history__section");
const operators=document.querySelectorAll(".operator");
const numbers=document.querySelectorAll(".row__number");
//variables for calulcation
let num1;
let num2;
let currentOperator;
//check prev to prevent errors
let prevNum;
let prevOperator;
//misc
let numberString="";
let equalsSwitch=false;

//create an object with the various math functions held in key value pairs
let calculate={
    "*":function(num1,num2){return Math.round((num1 * num2)*10000) /10000},
    "-":function(num1,num2){return Math.round((num1 - num2)*10000) /10000},
    "+":function(num1,num2){return Math.round((num1+num2)*10000) /10000},
    "/": function(num1,num2){return Math.round((num1 / num2) * 10000) / 10000},
}

//Used to clear current line as well as empty number string variable
function clearEntry(){
    displayCurrent.innerHTML=0;
    numberString="";
}

//used to clear everything
function clearAll(){
    displayCurrent.innerHTML="0";
    displayPrev.innerHTML="";
    num1=undefined;
    num2=undefined;
    prevNum=undefined;
    prevOperator=undefined;
    equalsSwitch=false;
    numberString="";
}
//clear history of equations
function clearHistory(){
    history.innerHTML="";
}

//delete the last digit on the numberstring
function backspace(){
    numberString=numberString.slice(0,-1);
    displayCurrent.innerHTML = `${numberString}`;
}
//have equals button work on click
function equals(){
    //prevent equals being pressed before anything else from breaking code
    if (!num1&&num1!=0)return;
    //set prev operator to use in case equals is pressed in a row
    if(!currentOperator){currentOperator=prevOperator}
    //define num2 based on if equals is pressed in a row;
    num2 = (equalsSwitch) 
        ? num2 = prevNum 
        : parseFloat(displayCurrent.innerHTML);
    //define prevNum in case equals is pressed again
    prevNum=num2;
    //calculate and add line to history as well as update html
    numberString=displayCurrent.innerHTML;
    calculateHandler();
    addHistory()
    displayPrev.innerHTML="";
    //empty variables
    numberString="";
    prevOperator=currentOperator;
    currentOperator=undefined;
    equalsSwitch=true;
}

//Add to history element
function addHistory(equation){
    const equationLine = (displayPrev.innerHTML)
                            ? `${displayPrev.innerHTML + numberString}`
                            :`${numberString + currentOperator + prevNum}`
    
    history.insertAdjacentHTML("afterbegin", `
        <div class="equation">
            <p class="equation__problem">${equationLine} =</p>
            <p class="equation__answer">${num1}</p>
        </div>
    `)
    
}

//switch integer from negative to positive or vice versa
function makeNegative(){
    numberString=parseFloat(numberString) * - 1;
    displayCurrent.innerHTML = `${numberString}`;
}
//add digits to numberstring, 
function setNumberString(num){
    //define current based on either click button press
    const currentDigit=this.value||num;
    //add a 0 prior to decimal if empty
    if(currentDigit=="."&&displayCurrent.innerHTML=="0"){
        numberString="0."
        displayCurrent.innerHTML = `${numberString}`;
    }
    //dont add a decimal if there is already a decimal
    if(numberString.includes(".")&& currentDigit==".")return
    //prevent user from entering a number with preceding zeroes
    if(numberString[0]==0 &&numberString[1]!=="."){
        numberString=numberString.slice(1);
    }
    //update numberstring
    numberString+=currentDigit;
    //empty user is entering a number after hitting equals empty num1 and replace with numberstring
    if (!currentOperator && equalsSwitch) {
        num1=parseFloat(numberString);
    }
    displayCurrent.innerHTML=`${numberString}`;
}
//set num1 and num2 to be used in functions
function setNumbers(){
    if (num1 || num1==0) {
        num2 = parseFloat(numberString) || 0;
    }
    else {
        num1 = parseFloat(numberString) || 0
    } 
}
//calculate the equation
function calculateHandler(){
    //check if user is dividing by zero
    if(currentOperator=="/" && num2 ==0){
        displayCurrent.innerHTML="0";
        displayPrev.innerHTML="";
        num1=undefined;
        num2=undefined;
        alert("cannot divide by zero");
    }
    //if num1 and num2 are defined calculate
    else if((num1||num1==0) && (num2)||num2==0) {
        num1 = calculate[currentOperator](num1, num2);
        num2 = undefined;
        displayCurrent.innerHTML = `${num1}`
    }
}
//handle the click of an operator
function equationHandler(symbol){
    const mathOperator=this.value||symbol;
    //if operators are pressed twice in a row
    if(numberString=="" && displayPrev.innerHTML!=""){
        displayPrev.innerHTML=`${displayPrev.innerHTML.slice(0,-2)} ${mathOperator} `;
        currentOperator = mathOperator;
        return;
    }
    //set num1 and num2 as long as equals wasn't pushed last
    if(!equalsSwitch){
        setNumbers();
    }
    //set display of the calculation
    displayCurrent.innerHTML = `${num1}`
    if (!displayPrev.innerHTML) { displayPrev.innerHTML = ` ${num1 + " " + mathOperator + " "}`}
    else{displayPrev.innerHTML += ` ${num2 + " " + mathOperator}`}
    //calculate the equation
    calculateHandler();
    //reset variables
    numberString = "";
    currentOperator=mathOperator;
    equalsSwitch=false;
}

//keyboard controls
function keyboardControls(e){
    //if number is pressed
    if(parseFloat(e.key)>=0||e.key=="."){
        setNumberString(e.key)
    }
    //if operator is pressed
    if ([42, 43, 45, 47].indexOf(e.charCode) !== -1) {
        equationHandler(e.key);
    }
    //if enter is pressed
    if(e.charCode=="13"){
        equals();
    }

}

//event listeners
numbers.forEach(number=>number.addEventListener("click", setNumberString));
operators.forEach(operator=>operator.addEventListener("click", equationHandler));
document.addEventListener("keypress", keyboardControls)