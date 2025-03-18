"use strict";
const screen = document.querySelector(".game-screen-container");
const timeShown = document.querySelector("#time");
const livesShown = document.querySelector("#lives");
const recordShown = document.querySelector("#record");
const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");

class ItemPos {
	constructor(posX = null, posY = null) {
		this.x = posX;
		this.y = posY;
	}
}

/* Valores Iniciales */
let theGameStarted = false;

let canvasSize = null;
let gridSize = null;
let elementsSize = null;

const playerPos = new ItemPos();
const giftPos = new ItemPos();
let bombsPos = [];

let currentLevel = 0;
let currentLives = 5;
let totalGameTime = 0;
const lastLevel = maps.length - 1;
let currentRecord = Number(localStorage.getItem("record"));

timeShown.innerText = "--";
livesShown.innerText = "-- -- -- -- --";
currentRecord ? recordShown.innerText = formatSeconds(currentRecord) : recordShown.innerText = "--";

/* Event Listeners */
window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);
window.addEventListener("load", showMainMenu);
window.addEventListener("keydown", moveByKeys);
document.getElementById("up").addEventListener("click", moveByClicks);
document.getElementById("left").addEventListener("click", moveByClicks);
document.getElementById("right").addEventListener("click", moveByClicks);
document.getElementById("down").addEventListener("click", moveByClicks);

/* ===============================
   Eventos Touch para Swipe (móvil)
   =============================== */
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(event) {
	const touch = event.touches[0];
	touchStartX = touch.clientX;
	touchStartY = touch.clientY;
}

function handleTouchEnd(event) {
	const touch = event.changedTouches[0];
	touchEndX = touch.clientX;
	touchEndY = touch.clientY;
	handleGesture();
}

function handleGesture() {
	const diffX = touchEndX - touchStartX;
	const diffY = touchEndY - touchStartY;
	// Se determina la dirección comparando la magnitud de los ejes
	if (Math.abs(diffX) > Math.abs(diffY)) {
		// Swipe horizontal
		if (diffX > 0) {
			movePlayer("right");
		} else {
			movePlayer("left");
		}
	} else {
		// Swipe vertical
		if (diffY > 0) {
			movePlayer("down");
		} else {
			movePlayer("up");
		}
	}
}

// Se agregan los listeners touch al canvas
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchend", handleTouchEnd, false);

/* Lógica del Juego */
let currentTimer = null;
function startTimer() {
	timeShown.innerText = "";
	currentTimer = setInterval(() => {
		totalGameTime++;
		const currentTime = formatSeconds(totalGameTime);
		timeShown.innerText = currentTime;
	}, 1000);
}

function setCanvasSize() {
	// Se ajusta el tamaño del canvas dependiendo del ancho y alto de la ventana
	if (window.innerHeight < window.innerWidth) {
		canvasSize = window.innerHeight * 0.8;
	} else {
		canvasSize = window.innerWidth * 0.8;
	}
	canvasSize = Math.trunc(canvasSize);
	gridSize = Math.trunc(canvasSize / 10);
	canvas.setAttribute("width", canvasSize);
	canvas.setAttribute("height", canvasSize);
	
	if (theGameStarted) renderMap();
}

function renderMap() {	
	elementsSize = gridSize;
	game.textAlign = "start";
	game.font = `${elementsSize}px sans-serif`;
	
	let actualMap = maps[currentLevel];
	const mapRows = actualMap.trim().split("\n");
	const mapElements = mapRows.map(row => row.trim().split(""));
	
	game.clearRect(0, 0, canvasSize, canvasSize);
	let isFirstLoad = (playerPos.x === null && playerPos.y === null);
	let playerMoved = (playerPos.x !== null && playerPos.y !== null);
	
	mapElements.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			const emoji = emojis[col];
			const posX = colIndex * gridSize;
			const posY = (rowIndex + 1) * gridSize;
			game.fillText(emoji, posX, posY);

			if (isFirstLoad) {
				switch (emoji) {
					case "🚪":
						playerPos.x = (colIndex + 1);
						playerPos.y = (rowIndex + 1);
						game.fillText(emojis["PLAYER"], posX, posY);
						break;
					case "💾":
						giftPos.x = (colIndex + 1);
						giftPos.y = (rowIndex + 1);
						break;
					case "🌵":
						bombsPos.push(new ItemPos((colIndex + 1), (rowIndex + 1)));
						break;
				}
			}
		});
	});
	
	if (playerMoved) {
		const posX = (playerPos.x - 1) * gridSize;
		const posY = playerPos.y * gridSize;
		game.fillText(emojis["PLAYER"], posX, posY);
		
		wasAnyBombHit();
		wasTheLevelComplete();
	}
}

/* Movimiento del Jugador */
function movePlayer(direction) {
	if (theGameStarted) {
		switch (direction) {
			case "up":
				if ((playerPos.y - 1) >= 1) {
					playerPos.y--;
					renderMap();
				}
				break;
			case "left":
				if ((playerPos.x - 1) >= 1) {
					playerPos.x--;
					renderMap();
				}
				break;
			case "right":
				if ((playerPos.x + 1) <= 10) {
					playerPos.x++;
					renderMap();
				}
				break;
			case "down":
				if ((playerPos.y + 1) <= 10) {
					playerPos.y++;
					renderMap();
				}
				break;
		}
	}
}

function moveByClicks(clickEvent) {
	switch (clickEvent.target.id) {
		case "up":
			movePlayer("up");
			break;
		case "left":
			movePlayer("left");
			break;
		case "right":
			movePlayer("right");
			break;
		case "down":
			movePlayer("down");
			break;
	}
}

function moveByKeys(keyEvent) {
	switch (keyEvent.code) {
		case "ArrowUp":
		case "KeyW":
			movePlayer("up");
			break;
		case "ArrowLeft":
		case "KeyA":
			movePlayer("left");
			break;
		case "ArrowRight":
		case "KeyD":
			movePlayer("right");
			break;
		case "ArrowDown":
		case "KeyS":
			movePlayer("down");
			break;
	}
}

/* Condiciones de Ganar y Perder */
function endGame(wonOrLost) {
	theGameStarted = false;
	switch (wonOrLost) {
		case "won":
			console.log("¡Ganaste el Juego!");
			clearInterval(currentTimer);
			game.clearRect(0, 0, canvasSize, canvasSize);
			showGameWonMenu();
			if (totalGameTime < currentRecord || currentRecord === 0) {
				currentRecord = totalGameTime;
				localStorage.setItem("record", totalGameTime);
				recordShown.innerText = formatSeconds(currentRecord);
			}
			break;
		case "lost":
			console.log("Perdiste todas tus vidas: GAME OVER.");
			game.clearRect(0, 0, canvasSize, canvasSize);
			clearInterval(currentTimer);
			showGameLostMenu();
			break;
	}
}

function wasTheLevelComplete() {
	const itWas = (playerPos.x === giftPos.x) && (playerPos.y === giftPos.y);
	if (itWas) {
		if (currentLevel !== lastLevel) {
			console.log("¡Pasaste de Nivel!");
			resetAllPositions();
			currentLevel++;
			renderMap();
		} else {
			endGame("won");
		}
	}
}

function wasAnyBombHit() {
	const itWas = bombsPos.find(bomb => (bomb.x === playerPos.x && bomb.y === playerPos.y));
	if (itWas) {
		currentLives--;
		updateLivesShown();
		if (currentLives > 0) {
			console.log("Perdiste una vida.");
			resetAllPositions();
			renderMap();
		} else {
			endGame("lost");
		}
	}
}

/* Menús */
const mainMenuContainer = document.createElement("div");
mainMenuContainer.classList.add("game-menu");

const mainMenuTitle = document.createElement("h2");
mainMenuTitle.innerText = "Laberinto";
mainMenuTitle.classList.add("game-menu__item", "game-menu__item--title");

const mainMenuBtn = document.createElement("button");
mainMenuBtn.innerText = "Jugar";
mainMenuBtn.classList.add("game-menu__item", "game-menu__item--btn");
mainMenuBtn.addEventListener("click", startGame);

screen.appendChild(mainMenuContainer);
mainMenuContainer.appendChild(mainMenuTitle);
mainMenuContainer.appendChild(mainMenuBtn);

function showMainMenu() { mainMenuContainer.classList.remove("inactive"); }
function hideMainMenu() { mainMenuContainer.classList.add("inactive"); }

const wonGameMenuContainer = document.createElement("div");
wonGameMenuContainer.classList.add("game-menu", "inactive");

const wonGameMenuTitle = document.createElement("h2");
wonGameMenuTitle.innerText = "Ganaste";
wonGameMenuTitle.classList.add("game-menu__item", "game-menu__item--title");

const wonGameMenuTryAgainBtn = document.createElement("button");
wonGameMenuTryAgainBtn.innerText = "Jugar de nuevo";
wonGameMenuTryAgainBtn.classList.add("game-menu__item", "game-menu__item--btn");
wonGameMenuTryAgainBtn.addEventListener("click", startGame);

screen.appendChild(wonGameMenuContainer);
wonGameMenuContainer.appendChild(wonGameMenuTitle);
wonGameMenuContainer.appendChild(wonGameMenuTryAgainBtn);

function showGameWonMenu() { wonGameMenuContainer.classList.remove("inactive"); }
function hideGameWonMenu() { wonGameMenuContainer.classList.add("inactive"); }

const lostGameMenuContainer = document.createElement("div");
lostGameMenuContainer.classList.add("game-menu", "inactive");

const lostGameMenuTitle = document.createElement("h2");
lostGameMenuTitle.innerText = "Perdiste";
lostGameMenuTitle.classList.add("game-menu__item", "game-menu__item--title");

const lostGameMenuTryAgainBtn = document.createElement("button");
lostGameMenuTryAgainBtn.innerText = "Volver a Intentarlo";
lostGameMenuTryAgainBtn.classList.add("game-menu__item", "game-menu__item--btn");
lostGameMenuTryAgainBtn.addEventListener("click", startGame);

screen.appendChild(lostGameMenuContainer);
lostGameMenuContainer.appendChild(lostGameMenuTitle);
lostGameMenuContainer.appendChild(lostGameMenuTryAgainBtn);

function showGameLostMenu() { lostGameMenuContainer.classList.remove("inactive"); }
function hideGameLostMenu() { lostGameMenuContainer.classList.add("inactive"); }

/* Inicio del Juego */
function startGame() {
	hideMainMenu();
	hideGameWonMenu();
	hideGameLostMenu();
	theGameStarted = true;
	totalGameTime = 0;
	currentLevel = 0;
	currentLives = 5;
	resetAllPositions();
	showPlayerLives();
	startTimer();
	renderMap();
}

function showPlayerLives() { livesShown.innerText = emojis["HEART"].repeat(currentLives); }
function updateLivesShown() { livesShown.innerText = emojis["HEART"].repeat(currentLives); }

function resetAllPositions() {
	playerPos.x = null;
	playerPos.y = null;
	giftPos.x = null;
	giftPos.y = null;
	bombsPos = [];
}

function formatSeconds(timeInSeconds) {
	const totalTime = { hrs: 0, min: 0, sec: 0 };
	let counter = timeInSeconds;
	while (counter > 0) {
		if (counter >= 3600) {
			totalTime.hrs = Math.trunc(counter / 3600);
			counter -= 3600 * Math.trunc(counter / 3600);
		} else if (counter >= 60) {
			totalTime.min = Math.trunc(counter / 60);
			counter -= 60 * Math.trunc(counter / 60);
		} else if (counter >= 1) {
			totalTime.sec = counter;
			counter -= counter;
		}
	}
	let totalTimeInString = "";
	if (totalTime.hrs > 0) totalTimeInString += `${totalTime.hrs} h `;
	if (totalTime.min > 0) totalTimeInString += `${totalTime.min} min `;
	if (totalTime.sec > 0) totalTimeInString += `${totalTime.sec} s`;
	return totalTimeInString.trim();
}
