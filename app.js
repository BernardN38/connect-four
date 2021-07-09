const gameContainer = document.querySelector('#game-container');
const startButton = document.getElementById('start');
const gridHeight = 7;
const gridLength = 7;

let turn = 'yellow';
let gameStarted = 'false';
let noClick = false;
let table;

gameContainer.addEventListener('click', handleClick);
startButton.addEventListener('click', initGame);
class GameGrid {
	constructor(height, length, parentContainer) {
		this.height = height;
		this.length = length;
		this.container = parentContainer;
		this.cells = [];
	}
	createElement(className) {
		const element = document.createElement('div');
		element.classList.add(className);
		return element;
	}
	createColumns(className) {
		let i = 0;
		while (i < this.length) {
			this.container.appendChild(this.createElement(className));
			i++;
		}
	}
	createRows(parentsClassName, rowClassName) {
		const topRow = document.querySelectorAll(`.${parentsClassName}`);
		let i = 0;
		while (i < this.height) {
			for (let member of topRow) {
				member.appendChild(this.createElement(rowClassName));
			}
			i++;
		}
	}
	addCordinatesCells() {
		const cells = document.querySelectorAll('.row');
		let x = 0;
		let y = 1;
		let id = 1;
		for (let cell of cells) {
			cell.setAttribute('data-x', x);
			cell.setAttribute('data-y', y);
			cell.setAttribute('id', id);
			let newCell = new Cell(x, y, id);
			newCell.add(newCell);
			y++;
			id++;
			if (y > gridHeight) {
				y = 1;
				x++;
			}
		}
	}
}

class Cell {
	constructor(x, y, id, color = 'none') {
		this.x = x;
		this.y = y;
		this.id = id;
		this.color = color;
	}
	add(cell) {
		table.cells.push(cell);
	}
	test() {
		console.log('test works');
	}
	makeYellow() {
		document.getElementById(this.id).classList.add('yellow');
	}
	makeRed() {
		document.getElementById(this.id).classList.add('red');
	}
	removeColor() {
		document.getElementById(this.id).classList.remove('red', 'yellow');
	}
	getCellElement() {
		let element = document.getElementById(this.id);
	}
}

function initGame() {
	if (gameStarted === true) return;
	table = new GameGrid(gridHeight, gridLength, gameContainer);
	table.createColumns('column');
	table.createRows('column', 'row');
	table.addCordinatesCells();
	gameStarted = true;
}

function animateCellDrop() {
	if (noClick === true) return;
	noClick = true;
	let clickTarget = event.target;
	let { id, dataset } = clickTarget;
	let { x, y } = dataset;
	id = parseInt(id);
	x = parseInt(x);
	y = parseInt(y);

	setInterval(function() {
		let previousCell = table.cells.find((cell) => cell.x === x && cell.y === y);
		let nextCell = table.cells.find((cell) => cell.x === x && cell.y === y + 1);
		if (nextCell === undefined || nextCell.color != 'none') {
			return clearInterval();
		}
		nextCell.color = turn;
		previousCell.color = 'none';
		previousCell.removeColor();
		if (turn == 'red') {
			nextCell.makeRed();
		} else {
			nextCell.makeYellow();
		}
		y++;
	}, 200);
}

function switchTurn() {
	if (turn === 'yellow') {
		turn = 'red';
	} else {
		turn = 'yellow';
	}
}

function handleClick() {
	if (noClick === true) return;
	animateCellDrop();
	switchTurn();
	setTimeout(() => {
		handleWin();
	}, 900);
}

function handleWin() {
	if (checkWin('red')) {
		alert('red wins');
	} else if (checkWin('yellow')) {
		alert('yellow wins');
	} else {
		noClick = false;
	}
}

function checkWin(color) {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(
			([ y, x ]) => y >= 0 && y < gridHeight && x >= 0 && x < gridLength && table.cells[x * 7 + y].color === color
		);
	}

	for (let y = 0; y <= gridHeight; y++) {
		for (let x = 0; x <= gridLength; x++) {
			// get "check list" of 4 cells (starting here) for each of the different
			// ways to win
			const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			// find winner (only checking each win-possibility as needed)
			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				console.log('winner');
				return true;
			}
		}
	}
}
