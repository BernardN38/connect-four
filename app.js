const gameContainer = document.querySelector('#game-container');

//this array will store all current properties for each slot in game
const tokenArray = [];

//keeps track of which players turn it is
let turn = 'yellow';

//blocks multiple clicks while one click is bing processed
let blockClicks = false;

//creates a class for each slot in game and define its properties and methods
class TokenSlot {
	constructor(position, id, x, y, color = 'none', filled = false) {
		this.position = position;
		this.id = parseInt(id);
		this.color = color;
		this.filled = filled;
		this.x = position + HEIGHT + 1;
		this.y = parseInt(y);
	}
	// makes current token slot yellow and calls animation function, then switches turn
	makeYellow() {
		document.getElementById(this.id + HEIGHT + 1).classList.add('yellow');
		animateDown(this.id, 'yellow');
		turn = 'red';
	}
	// makes current token slot yellow and calls animation function, then switches turn
	makeRed() {
		document.getElementById(this.id + HEIGHT +1).classList.add('red');
		animateDown(this.id, 'red');
		turn = 'yellow';
	}
}

//validates click and calls class method depending on which players turn
function handleClick(event) {
	if (event.target.classList[0] != 'col') return;
	const id = event.target.id;
	if (id > 6) return;
	if (blockClicks) return;
	blockClicks = true;
	if (turn === 'yellow') return tokenArray[id].makeYellow();
	if (turn === 'red') return tokenArray[id].makeRed();
}

// asign each div a unique id and pushes to tokenArray with its prperties
function assignIds() {
	let counter = 0;
	for (let x of gameContainer.children) {
		Array.from(x.children).map((element) => {
			element.id = counter;
			tokenArray.push(new TokenSlot(element.id, element.id, counter % 7, x.classList[1]));
			counter++;
		});
	}
}

//tracks changes in slots when a token is places. Updates propeties in tokenArray
function updateArray(id, color) {
	tokenArray[id].color = color;
	tokenArray[id].filled = true;
}

//animates a token when it is placed in a slot and checks for winner after turn(ends game)
function animateDown(id, color) {
	//sets ids for drop down animation starts at 7 to account for top row
	let currentId = id + HEIGHT +1;
	let nextId = id + (HEIGHT *2) +2;

	let animationInterval = setInterval(() => {
		//validates input, stops interval when reaches end of range, waits for previous animation to stop then allows next input
		if (nextId > 48) {
			updateArray(currentId, color);
			blockClicks = false;
			return clearInterval(animationInterval);
		}

		//stops animation if next element is filled, checks for win
		if (
			document.getElementById(nextId).classList[1] === 'red' ||
			document.getElementById(nextId).classList[1] === 'yellow'
		) {
			updateArray(currentId, color);
			if (checkWin('red')) {
				clearInterval(animationInterval);
				return alert('Red wins!');
			} else if (checkWin('yellow')) {
				clearInterval(animationInterval);
				return alert('Yellow wins!');
			}
			blockClicks = false;
			return clearInterval(animationInterval);
		}

		// removes color from current element and adds color to next element with css class
		document.getElementById(currentId).classList.remove(color);
		document.getElementById(nextId).classList.add(color);
		//prepares ids for next iteration
		nextId += HEIGHT + 1;
		currentId += HEIGHT + 1;
	}, 200);
}

//checks if winning conditions are met by looping over every possible winning scenerio depending on grid size
//modified from provided code
const WIDTH = 6;
const HEIGHT = 6;

function checkWin(color) {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer
		return cells.every(
			([ y, x ]) => y >= 0 && y <= HEIGHT && x >= 0 && x <= WIDTH && tokenArray[y * 7 + x].color === color
		);
	}

	for (let y = 0; y <= HEIGHT; y++) {
		for (let x = 0; x <= WIDTH; x++) {
			// get "check list" of 4 cells (starting here) for each of the different
			// ways to win
			const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			// find winner (only checking each win-possibility as needed)
			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}


function init(){
	assignIds();
	gameContainer.addEventListener('click', handleClick);
}

init()