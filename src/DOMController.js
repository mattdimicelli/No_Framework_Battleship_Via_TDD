import introMusic from './audio/intro-music.mp3';
import _ from 'lodash';
import lighterBlastSound from './audio/lighter-blast.mp3';
import missleLaunchSound from './audio/missile-launch.mp3';
import railgunSound from './audio/railgun.mp3'
import twoBlastsSound from './audio/two-blasts.mp3';
import turretBlastSound from './audio/turret-and-blast.mp3';
import sonar from './audio/submarine-sonar-ping.wav';
import explosion1 from './audio/explosion1.mp3';
import explosion2 from './audio/explosion2.mp3';
import explosion3 from './audio/explosion3.mp3';
import Player from './Player';
import Gameboard from './Gameboard';
import ComputerPlayer from './ComputerPlayer';


class DOMController {
    constructor() {
        this.status = null;
        this.firstTurn = true;
        this.introMusick = null;
        this.sonarSound = null;
        this.handleVolumeIconClick = this.handleVolumeIconClick.bind(this);
        this.ifThereIsAWinnerAnnounceIt = this.ifThereIsAWinnerAnnounceIt.bind(this);
        this.shipLocations = {
            carrier: null,
            battleship: null,
            cruiser: null,
            submarine: null,
            destroyer: null,
        };
        this.currentShip = null;
        this.axis = 'VERTICAL';
        this.whereToPlaceCurrentShip = null;
    }

    restartGame(player) {
        domController.status = null;
        domController.firstTurn = true;
        domController.shipLocations = {
            carrier: null,
            battleship: null,
            cruiser: null,
            submarine: null,
            destroyer: null,
        };
        domController.currentShip = null;
        domController.axis = 'VERTICAL';
        domController.whereToPlaceCurrentShip = null;
        domController.renderPlaceShipsScreen(player);
    }

    playGame(player) {
        console.log('play new game fired');
        const thePlayer = new Player(player.name);
        const playerGameboard = new Gameboard('player');
        const computer = new ComputerPlayer();
        const computerGameboard = new Gameboard('computer');
        for (const [shipName, arrOfCoords] of Object.entries(domController.shipLocations)) {
            const shipNameFirstLetterCapitalised = shipName.slice(0,1).toUpperCase() + shipName.slice(1);
            playerGameboard.createShipAndPlaceItOnBoard(shipNameFirstLetterCapitalised, ...arrOfCoords);
        }
        const computerCoords = domController.randomlyGenerateEnemyShipPlacements();
        for (const [shipName, arrOfCoords] of Object.entries(computerCoords)) {
            const shipNameFirstLetterCapitalised = shipName.slice(0,1).toUpperCase() + shipName.slice(1);
            computerGameboard.createShipAndPlaceItOnBoard(shipNameFirstLetterCapitalised, ...arrOfCoords);
        }
        domController.renderGameScreen(playerGameboard, computerGameboard, thePlayer, computer);
    }

    randomlyGenerateEnemyShipPlacements() {
        const letterNumberHash = {
            'A': 1,
            'B': 2,
            'C': 3,
            'D': 4,
            'E': 5,
            'F': 6,
            'G': 7,
            'H': 8,
            'I': 9,
            'J': 10
        };
        const numberLetterHash = {
            1: 'A',
            2: 'B',
            3: 'C',
            4: 'D',
            5: 'E',
            6: 'F',
            7: 'G',
            8: 'H',
            9: 'I',
            10: 'J',
        };
        
        let remainingGridCoordinates = [];
        
        for (let i = 1; i <= 10; i++) {
            for (let letter of Object.keys(letterNumberHash)) {
                remainingGridCoordinates.push(letter + i);
            }
        }

        const shipLocations = {
            carrier: placeHorizontallyOrVertically(5),
            battleship: placeHorizontallyOrVertically(4),
            cruiser: placeHorizontallyOrVertically(3),
            submarine: placeHorizontallyOrVertically(3),
            destroyer: placeHorizontallyOrVertically(2),
        };
        console.log(shipLocations);
        return shipLocations;
    
        function placeHorizontallyOrVertically(shipLength) {
            let coords = null;
            while (coords === null) {
                if (Math.random() >= 0.5) {
                    coords = placeShipHorizontally(shipLength);
                } else {
                    coords = placeShipVertically(shipLength);
                }
            }
            return coords;
        }

        function placeShipHorizontally(shipLength) {
            const randomLetter = _.sample(Object.keys(letterNumberHash));
            const randomNumber = _.sample(Object.values(letterNumberHash));
            const randomCoord = randomLetter + randomNumber;
            if (!remainingGridCoordinates.includes(randomCoord)) {
                return null;
            } else {
                if (randomNumber + (shipLength - 1) > 10) {
                    return null;
                } else {
                    const coordsAlreadyOccupied = [];
                    const coordsForShip = [];
                    coordsForShip.push(randomCoord);
                    for (let i = 1; i < shipLength; i++) {
                        const newNumber = randomNumber + i;
                        const newCoord = randomLetter + newNumber;
                        if (!remainingGridCoordinates.includes(newCoord)) {
                            coordsAlreadyOccupied.push(newCoord);
                        }
                        coordsForShip.push(newCoord);
                    }
                    if (coordsAlreadyOccupied.length > 0) {
                        return null;
                    } else {
                        /* this removes the coordinates for the currently 
                        selected ship from the "bank" of available coords*/
                        remainingGridCoordinates = remainingGridCoordinates.filter(coord => {
                            for (let chosenCoord of coordsForShip) {
                                if (coord === chosenCoord) return false;
                            }
                            return true;
                        });
                        return coordsForShip;
                    }
                }
            }
        }

        function placeShipVertically(shipLength) {
            const randomLetter = _.sample(Object.keys(letterNumberHash));
            const randomNumber = _.sample(Object.values(letterNumberHash));
            const randomCoord = randomLetter + randomNumber;
            if (!remainingGridCoordinates.includes(randomLetter + randomNumber)) {
                return null;
            } else {
                const randomLetterCodified = letterNumberHash[randomLetter];
                if (randomLetterCodified + (shipLength - 1) > 10) {
                    return null;
                } else {
                    const coordsAlreadyOccupied = [];
                    const coordsForShip = [];
                    coordsForShip.push(randomCoord);
                    for (let i = 1; i < shipLength; i++) {
                        const newLetterCodified = randomLetterCodified + i;
                        const newLetter = numberLetterHash[newLetterCodified];
                        const newCoord = newLetter + randomNumber;
                        if (!remainingGridCoordinates.includes(newCoord)) {
                            coordsAlreadyOccupied.push(newCoord);
                        }
                        coordsForShip.push(newCoord);
                    }
                    if (coordsAlreadyOccupied.length > 0) {
                        return null;
                    } else {
                        /* this removes the coordinates for the currently 
                        selected ship from the "bank" of available coords*/
                        remainingGridCoordinates = remainingGridCoordinates.filter(coord => {
                            for (let chosenCoord of coordsForShip) {
                                if (coord === chosenCoord) return false;
                            }
                            return true;
                        });
                        return coordsForShip;
                    }
                }
            }
        }
    }

    handleVolumeIconClick(e) {
        const volumeAEl = e.currentTarget;
        if (volumeAEl.textContent === '🔊︁') { // when this icon displayed, sound should be playing
            volumeAEl.textContent = '︁︁🔇';
            if (this.introMusick.currentTime > 0 && !this.introMusick.ended) {
                this.introMusick.pause();
            } else if (this.sonarSound.currentTime > 0 && !this.sonarSound.ended) {
                this.sonarSound.pause();
            }
        } else if (volumeAEl.textContent === '︁︁🔇') { //when displayed, sound should be muted
            volumeAEl.textContent = '🔊︁';
            if(this.introMusick.paused && !this.introMusick.ended) {
                this.introMusick.play();
            } else if(this.sonarSound.paused) {
                this.sonarSound.play();
            } else {
                this.introMusick.play();
            }
        }
    }

    selectShipToPlace() {
        const ships = this.shipLocations;
        if (ships.carrier === null) {
            this.currentShip = 'carrier';
        } else if (ships.battleship === null) {
            this.currentShip = 'battleship';
        } else if (ships.cruiser === null) {
            this.currentShip = 'cruiser';
        } else if (ships.submarine === null) {
            this.currentShip = 'submarine';
        } else if (ships.destroyer === null) {
            this.currentShip = 'destroyer';
        } 
    }

    ifThereIsAWinnerAnnounceIt(playerGameboard, computerGameboard, player) {
        console.log('function fired');
        let winner;
        if (playerGameboard.getAllOfThisPlayersShipsAreSunk() 
        && computerGameboard.getAllOfThisPlayersShipsAreSunk()) {
            winner = 'DRAW';
        }
        if (playerGameboard.getAllOfThisPlayersShipsAreSunk()) {
            winner = 'ENEMY';
        }
        if (computerGameboard.getAllOfThisPlayersShipsAreSunk()) {
            winner = 'PLAYER';
        }
        if (winner) {
            if(winner === 'ENEMY') {
                this.status = 'GAME OVER. THE ENEMY HAS SUNK YOUR FLEET!';
            } else if (winner === 'DRAW') {
                // eslint-disable-next-line quotes
                this.status = "BOTH FLEETS HAVE BEEN SUNK!  IT'S A DRAW!";
            } else if (winner === 'PLAYER') {
                console.log('player won');
                const status = document.querySelector('.status');
                // eslint-disable-next-line quotes
                status.innerHTML = `YOU HAVE SUNK THE ENEMY FLEET! GAME OVER! <a class="play-again" href="#">PLAY AGAIN?</a>`;
                const playAgainLink = document.querySelector('.play-again');
                playAgainLink.addEventListener('click', () => domController.restartGame(player));
            }
        }
    }

    renderPlaceShipsScreen(player) {
        this.selectShipToPlace();
        /*on the first render of the gameScreen, sets the volumeIcon based on 
        whether or not the player had the music playing when the START button was
        clicked*/ 
        const volumeIcon = (
            (this.introMusick.currentTime > 0 && (!this.introMusick.paused && !this.introMusick.ended))
            || (this.sonarSound.currentTime > 0 && (!this.sonarSound.paused && !this.sonarSound.ended)) 
        ) ? '🔊︁' : '︁︁🔇';

        const playerNameUppercase = player.name.toUpperCase();
        
        const capitalizedShipName = this.currentShip.toUpperCase();
        this.status = `REAR ADMIRAL ${playerNameUppercase}, PLACE YOUR ${capitalizedShipName}`;
        

        const html = `
        <div class="main-container">
            <header class="game-header">
                <div class="game-title-container">
                    <h1 class="game-title">BATTLESHIP</h1>
                </div>
                <h2 class="status">${this.status}</h2>
                <a href="#" class="set-ships-screen-volume">${volumeIcon}</a>
                <a href="#" class="change-axis">${this.axis}</a>
            </header>
            <div class="set-ships-board">
                <div class="cell player A1"></div>
                <div class="cell player A2"></div>
                <div class="cell player A3"></div>
                <div class="cell player A4"></div>
                <div class="cell player A5"></div>
                <div class="cell player A6"></div>
                <div class="cell player A7"></div>
                <div class="cell player A8"></div>
                <div class="cell player A9"></div>
                <div class="cell player A10"></div>
                <div class="cell player B1"></div>
                <div class="cell player B2"></div>
                <div class="cell player B3"></div>
                <div class="cell player B4"></div>
                <div class="cell player B5"></div>
                <div class="cell player B6"></div>
                <div class="cell player B7"></div>
                <div class="cell player B8"></div>
                <div class="cell player B9"></div>
                <div class="cell player B10"></div>
                <div class="cell player C1"></div>
                <div class="cell player C2"></div>
                <div class="cell player C3"></div>
                <div class="cell player C4"></div>
                <div class="cell player C5"></div>
                <div class="cell player C6"></div>
                <div class="cell player C7"></div>
                <div class="cell player C8"></div>
                <div class="cell player C9"></div>
                <div class="cell player C10"></div>
                <div class="cell player D1"></div>
                <div class="cell player D2"></div>
                <div class="cell player D3"></div>
                <div class="cell player D4"></div>
                <div class="cell player D5"></div>
                <div class="cell player D6"></div>
                <div class="cell player D7"></div>
                <div class="cell player D8"></div>
                <div class="cell player D9"></div>
                <div class="cell player D10"></div>  
                <div class="cell player E1"></div>
                <div class="cell player E2"></div>
                <div class="cell player E3"></div>
                <div class="cell player E4"></div>
                <div class="cell player E5"></div>
                <div class="cell player E6"></div>
                <div class="cell player E7"></div>
                <div class="cell player E8"></div>
                <div class="cell player E9"></div>
                <div class="cell player E10"></div>
                <div class="cell player F1"></div>
                <div class="cell player F2"></div>
                <div class="cell player F3"></div>
                <div class="cell player F4"></div>
                <div class="cell player F5"></div>
                <div class="cell player F6"></div>
                <div class="cell player F7"></div>
                <div class="cell player F8"></div>
                <div class="cell player F9"></div>
                <div class="cell player F10"></div>
                <div class="cell player G1"></div>
                <div class="cell player G2"></div>
                <div class="cell player G3"></div>
                <div class="cell player G4"></div>
                <div class="cell player G5"></div>
                <div class="cell player G6"></div>
                <div class="cell player G7"></div>
                <div class="cell player G8"></div>
                <div class="cell player G9"></div>
                <div class="cell player G10"></div>
                <div class="cell player H1"></div>
                <div class="cell player H2"></div>
                <div class="cell player H3"></div>
                <div class="cell player H4"></div>
                <div class="cell player H5"></div>
                <div class="cell player H6"></div>
                <div class="cell player H7"></div>
                <div class="cell player H8"></div>
                <div class="cell player H9"></div>
                <div class="cell player H10"></div>
                <div class="cell player I1"></div>
                <div class="cell player I2"></div>
                <div class="cell player I3"></div>
                <div class="cell player I4"></div>
                <div class="cell player I5"></div>
                <div class="cell player I6"></div>
                <div class="cell player I7"></div>
                <div class="cell player I8"></div>
                <div class="cell player I9"></div>
                <div class="cell player I10"></div>
                <div class="cell player J1"></div>
                <div class="cell player J2"></div>
                <div class="cell player J3"></div>
                <div class="cell player J4"></div>
                <div class="cell player J5"></div>
                <div class="cell player J6"></div>
                <div class="cell player J7"></div>
                <div class="cell player J8"></div>
                <div class="cell player J9"></div>
                <div class="cell player J10"></div>
            </div>
        </div>
        `;

        const body = document.querySelector('body');
        body.innerHTML = '';
        body.insertAdjacentHTML('afterbegin', html);     

        const volumeATag = document.querySelector('.set-ships-screen-volume');
        volumeATag.addEventListener('click', domController.handleVolumeIconClick);
        const changeAxisBtn = document.querySelector('.change-axis');
        changeAxisBtn.addEventListener('click', handleChangeAxis);
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.addEventListener('mouseover', handleMouseOver));
        cells.forEach(cell => cell.addEventListener('click', handleClick));

        function handleChangeAxis(e) {
            const btn = e.currentTarget;
            if (domController.axis === 'VERTICAL') {
                domController.axis = 'HORIZONTAL';
            } else {domController.axis = 'VERTICAL';}
            btn.textContent = domController.axis;
        }

        function handleClick() {
            /*If the player clicks on a spot where the ship can't be placed,
            don't do anything*/
            if (domController.whereToPlaceCurrentShip === null) {
                console.log('does nothing');
                return;
            }

            /* If a cell is already occupied by another ship, clicking should do
            nothing */
            for (const coord of domController.whereToPlaceCurrentShip) {
                for (const arrOfCoordsOfAlreadyPlacedShip of Object.values(domController.shipLocations)) {
                    if (arrOfCoordsOfAlreadyPlacedShip) {
                        if (arrOfCoordsOfAlreadyPlacedShip.includes(coord)) {
                            return;
                        }
                    }
                }
            }

            /*This code places("permamently") the ship on the visual board*/
            for (const coord of domController.whereToPlaceCurrentShip) {
                const cell = document.querySelector(`.cell.player.${coord}`);
                cell.classList.add('ship-permanent');
            }

            const lowercaseShipName = domController.currentShip;
            domController.shipLocations[lowercaseShipName] = domController.whereToPlaceCurrentShip;
            console.log(domController.shipLocations);

            /* The following commands load the actual game after the last ship 
            (the destroyer) is placed */
            if (domController.currentShip === 'destroyer') {
                domController.playGame(player);
                // const thePlayer = new Player(player.name);
                // const playerGameboard = new Gameboard('player');
                // const computer = new ComputerPlayer();
                // const computerGameboard = new Gameboard('computer');
                // for (const [shipName, arrOfCoords] of Object.entries(domController.shipLocations)) {
                //     const shipNameFirstLetterCapitalised = shipName.slice(0,1).toUpperCase() + shipName.slice(1);
                //     playerGameboard.createShipAndPlaceItOnBoard(shipNameFirstLetterCapitalised, ...arrOfCoords);
                // }
                // const computerCoords = domController.randomlyGenerateEnemyShipPlacements();
                // for (const [shipName, arrOfCoords] of Object.entries(computerCoords)) {
                //     const shipNameFirstLetterCapitalised = shipName.slice(0,1).toUpperCase() + shipName.slice(1);
                //     computerGameboard.createShipAndPlaceItOnBoard(shipNameFirstLetterCapitalised, ...arrOfCoords);
                // }
                // domController.renderGameScreen(playerGameboard, computerGameboard, thePlayer, computer);
            }

            domController.selectShipToPlace();
            const uppercaseShipName = domController.currentShip.toUpperCase();
            const status = document.querySelector('.status');
            status.textContent = `REAR ADMIRAL ${playerNameUppercase}, PLACE YOUR ${uppercaseShipName}`;
        }
        function handleMouseOver(e) {

            // clear the "ship shadow" on the grid from the previous mouseOver
            cells.forEach(cell => cell.classList.remove('ship'));

            /* must clear the following property with every mouseOver event
            on a cell because if an illegible cell (eg. due to ship size) is mousedOver, this property
            will not update, and then when the user clicks to place a ship
            there will be issues */
            domController.whereToPlaceCurrentShip = null;

            let length;
            const ship = domController.currentShip;
            if (ship === 'carrier') {
                length = 5;
            } else if (ship === 'battleship') {
                length = 4;
            } else if (ship === 'cruiser' || ship === 'submarine') {
                length = 3;
            } else if (ship === 'destroyer') {
                length = 2;
            }
            const mousePointerCoord = e.currentTarget.classList[2];
            const coordLetter = mousePointerCoord.slice(0,1);
            const coordNumber = Number(mousePointerCoord.slice(1));

            if (domController.axis === 'HORIZONTAL') {
                const digitOfCoordsWhereShipMightBePlaced = [];
                for (let i=0; i < length; i++) {
                    const nextCellNum = coordNumber + i;
                    /* if placing a ship where the mouse currently is
                    would lead to the ship going off the board, do nothing,
                    because this will obviously not work */
                    if (nextCellNum > 10) return;
                    digitOfCoordsWhereShipMightBePlaced.push(nextCellNum);
                }
                domController.whereToPlaceCurrentShip = digitOfCoordsWhereShipMightBePlaced.map(number => coordLetter + number);
            }

            if (domController.axis === 'VERTICAL') {
                const letterNumberHash = {
                    'A': 1,
                    'B': 2,
                    'C': 3,
                    'D': 4,
                    'E': 5,
                    'F': 6,
                    'G': 7,
                    'H': 8,
                    'I': 9,
                    'J': 10,
                };
                const numberLetterHash = {
                    1: 'A',
                    2: 'B',
                    3: 'C',
                    4: 'D',
                    5: 'E',
                    6: 'F',
                    7: 'G',
                    8: 'H',
                    9: 'I',
                    10: 'J',
                };
                const letterCodified = letterNumberHash[coordLetter];
                const letterOfCoordsWhereShipMightBePlaced = [];
                for (let i=0; i < length; i++) {
                    let nextCellLetterCodified = letterCodified + i;
                    /* if placing a ship where the mouse currently is
                    would lead to the ship going off the board, do nothing,
                    because this will obviously not work */
                    if (nextCellLetterCodified > 10) return;
                    nextCellLetterCodified = String(nextCellLetterCodified);
                    const nextCellLetter = numberLetterHash[nextCellLetterCodified];
                    letterOfCoordsWhereShipMightBePlaced.push(nextCellLetter);
                }
                domController.whereToPlaceCurrentShip = letterOfCoordsWhereShipMightBePlaced.map(letter => letter + coordNumber);
            }

            if (domController.whereToPlaceCurrentShip) {
                for (const coord of domController.whereToPlaceCurrentShip) {
                    const cell = document.querySelector(`.cell.player.${coord}`);
                    cell.classList.add('ship');
                }
            }            
        }
    }

    renderStartScreen() {
        const body = document.querySelector('body');
        const startScreen = document.createElement('div');
        startScreen.classList.add('start-screen');
        const title = document.createElement('h1');
        title.classList.add('title');
        title.textContent = 'BATTLESHIP';
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('title-container');
        titleContainer.append(title);
        const nameForm = document.createElement('form');
        nameForm.classList.add('name-form');
        const nameInput = document.createElement('input');
        const nameLabel = document.createElement('label');
        nameLabel.classList.add('name-label');
        nameLabel.textContent = 'ENTER PLAYER NAME:';
        nameLabel.append(nameInput);
        nameInput.placeholder = 'BATTLESHIP COMBATANT';
        nameInput.classList.add('name-input');
        const startButton = document.createElement('a');
        startButton.textContent = 'START GAME';
        startButton.classList.add('start-button');
        startButton.href = '#';
        const controlsContainer = document.createElement('div');
        controlsContainer.classList.add('controls-container');
        nameForm.append(nameLabel, startButton);
        const volume = document.createElement('a');
        volume.textContent = '︁︁🔇';
        volume.classList.add('volume');
        volume.href = '#';
        controlsContainer.append(nameForm, volume);
        startScreen.append(titleContainer, controlsContainer);
        setTimeout(() => {
            controlsContainer.classList.add('make-visible-and-white');
            titleContainer.classList.add('make-visible-and-white');
        }, 500);
        body.append(startScreen);
        this.sonarSound = new Audio(sonar);
        this.sonarSound.loop = true;
        this.introMusick = new Audio(introMusic);
        this.introMusick.addEventListener('ended', () => this.sonarSound.play());
  
        volume.addEventListener('click', domController.handleVolumeIconClick);
        startButton.addEventListener('click', handleStartBtn);
        function handleStartBtn() {
            const nameInput = document.querySelector('.name-input');
            const playerName = nameInput.value;
            const player = { name: playerName };
            domController.renderPlaceShipsScreen(player);
        }
    }

    renderGameScreen(playerGameboard, computerGameboard, player, computer) {
        /*on the first render of the gameScreen, sets the volumeIcon based on 
        whether or not the player had the music playing when the START button was
        clicked*/ 
        const volumeIcon = (
            (this.introMusick.currentTime > 0 && (!this.introMusick.paused && !this.introMusick.ended))
            || (this.sonarSound.currentTime > 0 && (!this.sonarSound.paused && !this.sonarSound.ended)) 
        ) ? '🔊︁' : '︁︁🔇';

        const playerNameUppercase = player.name.toUpperCase();

        // programs the initial status to include the player's name
        if (this.status === 'AWAITING ORDERS, REAR ADMIRAL') {
            this.status = `AWAITING ORDERS, REAR ADMIRAL ${playerNameUppercase}`;
        }

        const html = `
        <div class="main-container">
            <header class="game-header">
                <div class="game-title-container">
                    <h1 class="game-title">BATTLESHIP</h1>
                </div>
                <h2 class="status">${this.status}</h2>
                <a href="#" class="volume">${volumeIcon}</a>
            </header>
            <div class="game-board-container">
                <div class="board-and-label-container">
                    <h2 class="board-label">FRIENDLY FLEET</h2>
                    <div class="game-player-board">
                        <div class="cell player A1"><span class="invisible-dot">•</span></div>
                        <div class="cell player A2"><span class="invisible-dot">•</span></div>
                        <div class="cell player A3"><span class="invisible-dot">•</span></div>
                        <div class="cell player A4"><span class="invisible-dot">•</span></div>
                        <div class="cell player A5"><span class="invisible-dot">•</span></div>
                        <div class="cell player A6"><span class="invisible-dot">•</span></div>
                        <div class="cell player A7"><span class="invisible-dot">•</span></div>
                        <div class="cell player A8"><span class="invisible-dot">•</span></div>
                        <div class="cell player A9"><span class="invisible-dot">•</span></div>
                        <div class="cell player A10"><span class="invisible-dot">•</span></div>
                        <div class="cell player B1"><span class="invisible-dot">•</span></div>
                        <div class="cell player B2"><span class="invisible-dot">•</span></div>
                        <div class="cell player B3"><span class="invisible-dot">•</span></div>
                        <div class="cell player B4"><span class="invisible-dot">•</span></div>
                        <div class="cell player B5"><span class="invisible-dot">•</span></div>
                        <div class="cell player B6"><span class="invisible-dot">•</span></div>
                        <div class="cell player B7"><span class="invisible-dot">•</span></div>
                        <div class="cell player B8"><span class="invisible-dot">•</span></div>
                        <div class="cell player B9"><span class="invisible-dot">•</span></div>
                        <div class="cell player B10"><span class="invisible-dot">•</span></div>
                        <div class="cell player C1"><span class="invisible-dot">•</span></div>
                        <div class="cell player C2"><span class="invisible-dot">•</span></div>
                        <div class="cell player C3"><span class="invisible-dot">•</span></div>
                        <div class="cell player C4"><span class="invisible-dot">•</span></div>
                        <div class="cell player C5"><span class="invisible-dot">•</span></div>
                        <div class="cell player C6"><span class="invisible-dot">•</span></div>
                        <div class="cell player C7"><span class="invisible-dot">•</span></div>
                        <div class="cell player C8"><span class="invisible-dot">•</span></div>
                        <div class="cell player C9"><span class="invisible-dot">•</span></div>
                        <div class="cell player C10"><span class="invisible-dot">•</span></div>
                        <div class="cell player D1"><span class="invisible-dot">•</span></div>
                        <div class="cell player D2"><span class="invisible-dot">•</span></div>
                        <div class="cell player D3"><span class="invisible-dot">•</span></div>
                        <div class="cell player D4"><span class="invisible-dot">•</span></div>
                        <div class="cell player D5"><span class="invisible-dot">•</span></div>
                        <div class="cell player D6"><span class="invisible-dot">•</span></div>
                        <div class="cell player D7"><span class="invisible-dot">•</span></div>
                        <div class="cell player D8"><span class="invisible-dot">•</span></div>
                        <div class="cell player D9"><span class="invisible-dot">•</span></div>
                        <div class="cell player D10"><span class="invisible-dot">•</span></div>  
                        <div class="cell player E1"><span class="invisible-dot">•</span></div>
                        <div class="cell player E2"><span class="invisible-dot">•</span></div>
                        <div class="cell player E3"><span class="invisible-dot">•</span></div>
                        <div class="cell player E4"><span class="invisible-dot">•</span></div>
                        <div class="cell player E5"><span class="invisible-dot">•</span></div>
                        <div class="cell player E6"><span class="invisible-dot">•</span></div>
                        <div class="cell player E7"><span class="invisible-dot">•</span></div>
                        <div class="cell player E8"><span class="invisible-dot">•</span></div>
                        <div class="cell player E9"><span class="invisible-dot">•</span></div>
                        <div class="cell player E10"><span class="invisible-dot">•</span></div>
                        <div class="cell player F1"><span class="invisible-dot">•</span></div>
                        <div class="cell player F2"><span class="invisible-dot">•</span></div>
                        <div class="cell player F3"><span class="invisible-dot">•</span></div>
                        <div class="cell player F4"><span class="invisible-dot">•</span></div>
                        <div class="cell player F5"><span class="invisible-dot">•</span></div>
                        <div class="cell player F6"><span class="invisible-dot">•</span></div>
                        <div class="cell player F7"><span class="invisible-dot">•</span></div>
                        <div class="cell player F8"><span class="invisible-dot">•</span></div>
                        <div class="cell player F9"><span class="invisible-dot">•</span></div>
                        <div class="cell player F10"><span class="invisible-dot">•</span></div>
                        <div class="cell player G1"><span class="invisible-dot">•</span></div>
                        <div class="cell player G2"><span class="invisible-dot">•</span></div>
                        <div class="cell player G3"><span class="invisible-dot">•</span></div>
                        <div class="cell player G4"><span class="invisible-dot">•</span></div>
                        <div class="cell player G5"><span class="invisible-dot">•</span></div>
                        <div class="cell player G6"><span class="invisible-dot">•</span></div>
                        <div class="cell player G7"><span class="invisible-dot">•</span></div>
                        <div class="cell player G8"><span class="invisible-dot">•</span></div>
                        <div class="cell player G9"><span class="invisible-dot">•</span></div>
                        <div class="cell player G10"><span class="invisible-dot">•</span></div>
                        <div class="cell player H1"><span class="invisible-dot">•</span></div>
                        <div class="cell player H2"><span class="invisible-dot">•</span></div>
                        <div class="cell player H3"><span class="invisible-dot">•</span></div>
                        <div class="cell player H4"><span class="invisible-dot">•</span></div>
                        <div class="cell player H5"><span class="invisible-dot">•</span></div>
                        <div class="cell player H6"><span class="invisible-dot">•</span></div>
                        <div class="cell player H7"><span class="invisible-dot">•</span></div>
                        <div class="cell player H8"><span class="invisible-dot">•</span></div>
                        <div class="cell player H9"><span class="invisible-dot">•</span></div>
                        <div class="cell player H10"><span class="invisible-dot">•</span></div>
                        <div class="cell player I1"><span class="invisible-dot">•</span></div>
                        <div class="cell player I2"><span class="invisible-dot">•</span></div>
                        <div class="cell player I3"><span class="invisible-dot">•</span></div>
                        <div class="cell player I4"><span class="invisible-dot">•</span></div>
                        <div class="cell player I5"><span class="invisible-dot">•</span></div>
                        <div class="cell player I6"><span class="invisible-dot">•</span></div>
                        <div class="cell player I7"><span class="invisible-dot">•</span></div>
                        <div class="cell player I8"><span class="invisible-dot">•</span></div>
                        <div class="cell player I9"><span class="invisible-dot">•</span></div>
                        <div class="cell player I10"><span class="invisible-dot">•</span></div>
                        <div class="cell player J1"><span class="invisible-dot">•</span></div>
                        <div class="cell player J2"><span class="invisible-dot">•</span></div>
                        <div class="cell player J3"><span class="invisible-dot">•</span></div>
                        <div class="cell player J4"><span class="invisible-dot">•</span></div>
                        <div class="cell player J5"><span class="invisible-dot">•</span></div>
                        <div class="cell player J6"><span class="invisible-dot">•</span></div>
                        <div class="cell player J7"><span class="invisible-dot">•</span></div>
                        <div class="cell player J8"><span class="invisible-dot">•</span></div>
                        <div class="cell player J9"><span class="invisible-dot">•</span></div>
                        <div class="cell player J10"><span class="invisible-dot">•</span></div>
                    </div>
                </div>
                <div class="board-and-label-container">
                    <h2 class="board-label">ENEMY FLEET</h2>
                    <div class="game-computer-board">
                        <div class="cell computer A1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D10"><span class="invisible-dot">•</span></div>  
                        <div class="cell computer E1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J10"><span class="invisible-dot">•</span></div>
                    </div>
                </div>
            </div>
                `;
        const body = document.querySelector('body');
        body.innerHTML = '';
        body.insertAdjacentHTML('afterbegin', html);     

        const volumeATag = document.querySelector('.volume');
        volumeATag.addEventListener('click', domController.handleVolumeIconClick);

        const computerBoard = document.querySelector('.game-computer-board');
        const computerCells = computerBoard.querySelectorAll('.cell');
        computerCells.forEach(cell => cell.addEventListener('click', handleFire));


        // shows location of ships on player's board
        for (let setOfLocations of playerGameboard.occupiedLocations.values()) {
            for (let location of setOfLocations) {
                const cell = document.querySelector(`.cell.player.${location}`);
                cell.classList.add('ship');
            }
        }    
        
        // shows missed shots on computer's gameboard
        for (const missedShotLocation of computerGameboard.missedShotsFromOpponent) {
            const dot = document.querySelector(`.cell.computer.${missedShotLocation} span`);
            dot.classList.remove('invisible-dot');
            dot.classList.add('make-visible-and-white');
        }

        //shows missed shots on player's gameboard
        for (const missedShotLocation of playerGameboard.missedShotsFromOpponent) {
            const dot = document.querySelector(`.cell.player.${missedShotLocation} span`);
            dot.classList.remove('invisible-dot');
            dot.classList.add('make-visible-and-white');
        }

        //shows hits on computer's gameboard
        for (const ship of computerGameboard.occupiedLocations.keys()) {
            for (const hitLocation of ship.damageLocations) {
                const dot = document.querySelector(`.cell.computer.${hitLocation} span`);
                dot.classList.remove('invisible-dot');
                dot.classList.add('hit');
            }
        }

        //shows hits on player's gameboard
        for (const ship of playerGameboard.occupiedLocations.keys()) {
            for (const hitLocation of ship.damageLocations) {
                const dot = document.querySelector(`.cell.player.${hitLocation} span`);
                dot.classList.remove('invisible-dot');
                dot.classList.add('hit');
            }
        }

        /* on the first turn, the player should gets to take turn before
        the computer makes it's first play */
        let resultOfComputersPlay;
        let shipType;
        if (!this.firstTurn) {
            const result = computer.attack(playerGameboard);
            if(Array.isArray(result)) {
                resultOfComputersPlay = result[0];
                shipType = result[1];
            }
        }

        /*Although the computer makes it's play immediately, this timer delays 
        update to the UI so that it appears that the computer is "taking some time"
        to make it's move */ 
        const computerMoveTimer = setTimeout(() => {
            // update missed shots on player's board after enemy attack
            for (const missedShotLocation of playerGameboard.missedShotsFromOpponent) {
                const dot = document.querySelector(`.cell.player.${missedShotLocation} span`);
                dot.classList.remove('invisible-dot');
                dot.classList.add('make-visible-and-white');
            }
            // updated hits from enemy on player's board after enemy attack
            for (const ship of playerGameboard.occupiedLocations.keys()) {
                for (const hitLocation of ship.damageLocations) {
                    const dot = document.querySelector(`.cell.player.${hitLocation} span`);
                    dot.classList.remove('invisible-dot');
                    dot.classList.add('hit');
                }
            }
            /* If any of the player's ships are hit (and/or sunk), the following effects take
            place, otherwise, no update to the display is needed */
            if (resultOfComputersPlay === 'hit ship') {
                playSounds('hitSounds');
                domController.status = 'THE ' + shipType.toUpperCase() + ' HAS BEEN HIT BY THE ENEMY!';
                const status = document.querySelector('.status');
                status.textContent = domController.status;
            } else if (resultOfComputersPlay === 'sunk ship') {
                playSounds('hitSounds');
                domController.status = 'REAR ADMIRAL... THE ' + shipType.toUpperCase() + ' HAS BEEN DESTROYED BY THE ENEMY!';
                const status = document.querySelector('.status');
                status.textContent = domController.status;
            }     

            // every time the player makes a move, check if somebody won the game
            domController.ifThereIsAWinnerAnnounceIt(playerGameboard, computerGameboard, player); 
            
        }, 2000);

    
        function handleFire(e) {
            /* clicking any location on the enemy board signifies that the player
            has taken his first (or subsequent) turn already */
            domController.firstTurn = false;

            const coords = e.currentTarget.classList[2];
            const resultOfAttackOnEnemy = player.attack(coords, computerGameboard);
            if (Array.isArray(resultOfAttackOnEnemy)) {
                const shipName = resultOfAttackOnEnemy[1].toUpperCase();
                if (resultOfAttackOnEnemy[0] === 'hit ship') {
                    playSounds('shootSounds');
                    const hitStatuses = ['DIRECT HIT!', 'TARGET HIT!', `TARGET HIT AT COORDINATE ${coords}!`, 'ENEMY TARGET HIT!', `ENEMY TARGET HIT AT COORDINATE ${coords}!`];
                    domController.status = _.sample(hitStatuses);
                } else if (resultOfAttackOnEnemy[0] === 'sunk ship') {
                    playSounds('shootSounds');
                    const enemySunkStatuses = [`ENEMY ${shipName} SUNK!`, `REAR ADMIRAL ${playerNameUppercase}, ENEMY ${shipName} DESTROYED!`, `ENEMY ${shipName} ELIMINATED!`];
                    domController.status = _.sample(enemySunkStatuses);
                }
            } else if (resultOfAttackOnEnemy === 'attack missed') {
                const missStatuses = ['TARGET MISSED', 'TARGET MISSED, REAR ADMIRAL', 'ENEMY TARGET MISSED'];
                const missStatus = _.sample(missStatuses);
                domController.status = missStatus;
                playSounds('shootSounds');
            } else if (resultOfAttackOnEnemy === 'repeat shot') {
                /* if the cell has already been shot at, clicking here
                shouldn't do anything */
                return;
            }

            domController.renderGameScreen(playerGameboard, computerGameboard, player, computer);
        }

        function playSounds(typeOfSounds) {
            if (volumeATag.textContent === '︁︁🔇') return;
            let soundUrls;
            if (typeOfSounds === 'hitSounds') {
                soundUrls = [explosion1, explosion2, explosion3];
            } else if (typeOfSounds === 'shootSounds') {
                soundUrls = [lighterBlastSound, missleLaunchSound, turretBlastSound, twoBlastsSound, railgunSound];
            }
            const randomSoundUrl = _.sample(soundUrls);
            const sound = new Audio(randomSoundUrl);
            sound.play();
        }
    }
}


const domController = new DOMController();

export default domController;

