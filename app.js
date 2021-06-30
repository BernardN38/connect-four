const gameContainer = document.querySelector('#game-container');

//this array will store all current properties for each slot in game
const tokenArray = [];

//keeps track of which players turn it is
let turn = 'yellow';

//blocks multiple click while one click is bing processed
let freeze = false;

//creates a class for each slot in game and define its properties and methods
class tokenSlot {
	constructor(position, id, x, y, color = 'none', filled = false) {
		this.position = position;
		this.id = parseInt(id);
		this.color = color;
		this.filled = filled;
		this.x = position % 7;
		this.y = parseInt(y);
	}
	makeYellow() {
		document.getElementById(this.id + 7).classList.add('yellow');
		animateDown(this.id, 'yellow');
		turn = 'red';
	}
	makeRed() {
		document.getElementById(this.id + 7).classList.add('red');
		animateDown(this.id, 'red');
		turn = 'yellow';
	}
}

assignIds();
gameContainer.addEventListener('click', handleClick);


//validates click and calls class method depending on which players turn
function handleClick(event) {
	if (event.target.classList[0] != 'col') return;
	const id = event.target.id;
	if (id > 6) return;
	if (freeze) return;
	freeze = true;

	if (turn === 'yellow') return tokenArray[id].makeYellow();
	if (turn === 'red') return tokenArray[id].makeRed();
}




// asign each div a unique id and pushes to tokenArray with its prperties 
function assignIds() {
	let counter = 0;
	for (let x of gameContainer.children) {
		Array.from(x.children).map((element) => {
			element.id = counter;
			tokenArray.push(new tokenSlot(element.id, element.id, counter % 7, x.classList[1]));
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
	let currentId = id + 7;
	let nextId = id + 14;
	let interval = setInterval(() => {
		if (nextId > 48) {
			updateArray(currentId, color);
			freeze = false;
			return clearInterval(interval);
		}
		if (
			document.getElementById(nextId).classList[1] === 'red' ||
			document.getElementById(nextId).classList[1] === 'yellow'
		) {
			updateArray(currentId, color);
			if (checkForWinRed()) {
				clearInterval(interval);
				return alert('red win');
			} else if (checkForWinYellow()) {
				clearInterval(interval);
				return alert('yellow win!');
			}
			freeze = false;
			return clearInterval(interval);
		}
		document.getElementById(currentId).classList.remove(color);
		document.getElementById(nextId).classList.add(color);
		nextId += 7;
		currentId += 7;
	}, 250);
}






//checks if winning conditions are met by looping over every possible winning scenerio depending on grid size
const WIDTH = 6;
const HEIGHT = 6;

function checkForWinRed() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer
		return cells.every(
			([ y, x ]) => y >= 0 && y <= HEIGHT && x >= 0 && x <= WIDTH && tokenArray[y * 7 + x].color === 'red'
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
function checkForWinYellow() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer
		return cells.every(
			([ y, x ]) => y >= 0 && y <= HEIGHT && x >= 0 && x <= WIDTH && tokenArray[y * 7 + x].color === 'yellow'
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
