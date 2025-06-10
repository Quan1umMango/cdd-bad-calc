var output = document.getElementById("output");

var nOutputs = 13;
const nOutputsMax = 15;
var outputData = new Array(nOutputs).fill(0);

var addMore = document.getElementById("add-more");

function addOutputTokenDOM() {
	let odiv = document.createElement("div");
	odiv.classList.add("token");
	odiv.classList.add("pixelify-sans-token");
	output.appendChild(odiv);

}

// setup
for(let i = 0; i< nOutputs;i++) {
	addOutputTokenDOM();
}


function updateOutput(newVals,len) {
	if(nOutputs-1 < len) {
		console.error("ERROR: len > nOutputs-1");
		return;
	}
	
	var cs =Array.from(output.children);
	// reset the tokens
	for(let i = 0;i<cs.length;i++) {
		var c = cs[cs.length-1-i];
		c.textContent = '';

	}
	for(let i =len;i>-1;i--) {
		var c = cs[cs.length-1-i];
		c.textContent = newVals[len-1-i];
	}
}


const Options = Object.freeze({
	0:"0",
	1:"1",
	2:"2",
	3:"3",
	4:"4",
	5:"5",
	6:"6",
	7:"7",
	8:"8",
	9:"9",
	10:"+",
	11:"-",
	12:"*",
	13:"/",
	14:"(",
	15:")",
	16:".",
	17:"<",
	18:"=",
});
const optLen = Object.keys(Options).length;
const inpDur = 1//seconds ; seconds within which the user has to press to move to the next option
var curOpt = 0;
var curIndex = 0;
var t = new Date().getSeconds();
var timeout;

var inpBtn = document.getElementById("input");
inpBtn.textContent = "c";


var buffer = null; // this be our actual numerical answer
//var operations = new Array(nOutputs).fill('');// operations to perform, such as ['1','2','+','5']
var operations = [];
var isOutput = false;
inpBtn.onclick = function() {
	if(isOutput) {
		operations = [];
		curIndex = 0;
		isOutput= false;
	}
	const curT = new Date().getSeconds();
	if(curT-t > inpDur) { 
		curOpt = 0;
	}else {
		curOpt++;
	}

	if(curOpt == optLen) { curOpt = 0; }
	t = curT;
	inpBtn.textContent = Options[curOpt];
		
	if(timeout) { clearTimeout(timeout); }
	timeout = setTimeout(function() { 
		inpBtn.textContent = "c";
		if(curOpt == optLen-1) {
			let s = operations.join('');
			try {
				 let res = eval(s);
				 isOutput = true;
				 operations = [];
				 let arr = new String(res).split('');
				 arr.forEach((c) => {
					operations.push(c);
					});	
				 curIndex = arr.length-1;

			 } catch (err) {
				 isOutput = true;
				 operations = "SYNTAX ERROR".split('');
				 curIndex = operations.length-1;
			}
			
		
		}
		
		curIndex++;
		if(Options[curOpt] == "<" && curIndex > 1) { 
			curIndex-=2;
			operations.pop();
	 	}else{
			operations.push(Options[curOpt]);
		}
		updateOutput(operations,curIndex);
	},inpDur*1000);
	
}

var popup = document.getElementById("popup");
var confirmBtn = document.getElementById("popup-confirm-btn");
var popupInp = document.getElementById("popup-inp");

const INTEGRAL_ANSWERS=Object.freeze({
	0:0,
	1:8,
	2:0,
});
// like really this lang doesnt have this?
function getRandomIntRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var expAnswer = null;

addMore.onclick = function() {
	popup.style.display = "block";
	let selected = getRandomIntRange(0,2);
	popup.querySelector("img").src = "./assets/int"+selected+".gif";
	expAnswer = INTEGRAL_ANSWERS[selected];
}


confirmBtn.onclick = function() {
	popup.style.display = "none";	
	let ans = popupInp.value;
	 ans = new Number(ans);
	if(expAnswer != ans) {  return; }
	if(nOutputs+1==nOutputsMax) { addMore.remove(); return; }
	nOutputs++;

	outputData = new Array(nOutputs).fill(0);
	addOutputTokenDOM();
	
}
