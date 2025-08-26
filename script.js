// assignment 1

function isValidID(id) {

  if (id.length !== 9) {
    return false;}

    for (let i = 0; i < id.length; i++) {
    let code = id.charCodeAt(i);

    if (code < 48 || code > 57) {
      return false; }
  }
  return true;
}

console.log(isValidID("123456789")); 
console.log(isValidID("12345a789")); 
console.log(isValidID("12345678"));  

// assignment 2

let i;
function checkPrime(num) {

   if(num == 1 || num == 2){ 
       return true; }

   for(i=2 ; i<num ; i++){
         if(num%i==0){
             return false;
          }
   }
   return true;
}   

console.log (checkPrime(18));
console.log (checkPrime(21));
console.log (checkPrime(11));


// assignment 3

function addSpaces(str) {
  let result = "";

  for (let i = 0; i < str.length; i++) {
    let char = str.charAt(i);

    if (char >= 'A' && char <= 'Z') {
      result += " " + char;
    } else {
      result += char;
    }
  }

  return result;
}

console.log(addSpaces("abCdEf")); 

// assignment 4

function countSubstring(big, small) {
  let count = 0;

  for (let i = 0; i <= big.length - small.length; i++) {

    let part = big.substring(i, i + small.length);

    if (part === small) {
      count++;
    }
  }

  return count;
}

console.log(countSubstring("abcabcabc", "abc")); 
console.log(countSubstring("hello world hello", "hello")); 
console.log(countSubstring("aaaaa", "aa")); 

// assignment 5

function bubbleSortString(str) {

  let arr = str.split("");

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return arr.join("");
}


console.log(bubbleSortString("fcab")); 
console.log(bubbleSortString("dcba")); 
console.log(bubbleSortString("hello")); 


// assignment 6
// ===== מצב המחשבון =====
let current = "";
let firstNum = null;
let operator = null;
let memory = 0;
let justEvaluated = false;

const display = document.getElementById("display");
const historyEl = document.getElementById("history");
const keys = document.querySelector(".keys");

const setDisplay = (v) => display.textContent = String(v);
const setHistory = (v="") => historyEl.textContent = v;

// מציג תוצאה וגם מקפיץ alert (כמו שביקשת)
function showResult(result, historyText){
  setHistory(historyText || "");
  setDisplay(result);
  alert(result);
  current = "";
  firstNum = null;
  operator = null;
  justEvaluated = true;
}

function toNumber(str){
  if (str === "" || str === "Error") return NaN;
  return Number(str);
}
function clearAll(){
  current = ""; firstNum = null; operator = null; justEvaluated = false;
  setDisplay("0"); setHistory("");
}

function compute(a, op, b){
  switch(op){
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return (b === 0) ? "Error" : a / b;
    default: return "Error";
  }
}

// ===== אירועים על הכפתורים =====
keys.addEventListener("click", (e)=>{
  const btn = e.target.closest("button");
  if(!btn) return;
  const type = btn.getAttribute("data-type");

  if(type === "number"){
    const v = btn.getAttribute("data-value");
    if(justEvaluated && operator === null){ current=""; setHistory(""); justEvaluated=false; }
    if(current === "0") current = "";
    current += v;
    setDisplay(current);
    return;
  }

  if(type === "dot"){
    if(justEvaluated && operator === null){ current="0"; setHistory(""); justEvaluated=false; }
    if(!current.includes(".")){
      current = current ? current + "." : "0.";
      setDisplay(current);
    }
    return;
  }

  if(type === "neg"){
    if(!current || current==="0") return;
    current = current.startsWith("-") ? current.slice(1) : ("-" + current);
    setDisplay(current);
    return;
  }

  if(type === "percent"){
    if(current === "") return;
    const num = toNumber(current);
    if(isNaN(num)) return;
    const res = String(num / 100);
    showResult(res, `(${num})%`);
    return;
  }

  if(type === "unary"){
    const op = btn.getAttribute("data-op");
    const num = current !== "" ? toNumber(current)
               : (firstNum !== null && operator === null ? firstNum : toNumber(display.textContent));
    if(isNaN(num)) return;

    let res;
    if(op === "square") res = num * num;
    if(op === "sqrt")   res = (num < 0) ? "Error" : Math.sqrt(num);
    if(op === "inv")    res = (num === 0) ? "Error" : 1 / num;

    const label = op === "square" ? `sqr(${num})` : op === "sqrt" ? `√(${num})` : `1/(${num})`;
    showResult(res, label);
    return;
  }

  if(type === "backspace"){
    if(current){
      current = current.slice(0, -1);
      setDisplay(current || "0");
    }
    return;
  }

  if(type === "clear"){ clearAll(); return; }

  if(type === "op"){
    const op = btn.getAttribute("data-op");
    if(current === "" && firstNum !== null){
      operator = op; setHistory(`${firstNum} ${operator}`); return;
    }
    if(current === "") return;
    firstNum = toNumber(current);
    if(isNaN(firstNum)){ showResult("Error", ""); return; }
    operator = op; current = ""; justEvaluated=false;
    setHistory(`${firstNum} ${operator}`); setDisplay("0");
    return;
  }

  if(type === "equal"){
    if(firstNum === null || operator === null || current === "") return;
    const secondNum = toNumber(current);
    if(isNaN(secondNum)) return;
    const res = compute(firstNum, operator, secondNum);
    showResult(res, `${firstNum} ${operator} ${secondNum} =`);
    return;
  }

  if(type === "mem"){
    const m = btn.getAttribute("data-mem");
    const shown = display.textContent === "Error" ? NaN : Number(display.textContent);
    if(m === "MC"){ memory = 0; setHistory("M cleared"); }
    if(m === "MR"){ current = String(memory); setDisplay(current); setHistory("MR"); }
    if(m === "MPLUS"){ if(!isNaN(shown)) memory += shown; setHistory(`M = ${memory}`); }
    if(m === "MMINUS"){ if(!isNaN(shown)) memory -= shown; setHistory(`M = ${memory}`); }
  }
});

// תמיכת מקלדת
window.addEventListener("keydown", (e)=>{
  const k = e.key;
  if(/[0-9]/.test(k)) document.querySelector(`[data-type="number"][data-value="${k}"]`)?.click();
  else if(k === ".") document.querySelector('[data-type="dot"]')?.click();
  else if(["+","-","*","/"].includes(k)) document.querySelector(`[data-type="op"][data-op="${k}"]`)?.click();
  else if(k === "Enter" || k === "=") document.querySelector('[data-type="equal"]')?.click();
  else if(k === "Backspace") document.querySelector('[data-type="backspace"]')?.click();
  else if(k === "Escape") document.querySelector('[data-type="clear"]')?.click();
});


// ===== Modal: פתיחה/סגירה =====
document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('open-instructions');
  const modal = document.getElementById('instructions-modal');

  function openModal(){
    modal.hidden = false;
    document.body.classList.add('modal-open');
    // טריגר לטרנזישן
    requestAnimationFrame(()=> modal.classList.add('show'));
    // פוקוס ראשוני
    const okBtn = modal.querySelector('.modal-action');
    okBtn && okBtn.focus();
  }
  function closeModal(){
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    setTimeout(()=> modal.hidden = true, 150);
    openBtn && openBtn.focus();
  }

  openBtn.addEventListener('click', openModal);
  modal.addEventListener('click', (e)=>{
    if(e.target.matches('[data-close]')) closeModal();
  });
  window.addEventListener('keydown', (e)=>{
    if(!modal.hidden && e.key === 'Escape') closeModal();
  });
});
