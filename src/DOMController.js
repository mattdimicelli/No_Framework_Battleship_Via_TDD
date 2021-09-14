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
import placeShipsHTML from './placeShipsScreenHTML';
import gameplayHTML from './gameplayScreenHTML';


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
        const thePlayer = new Player(player.name);
        const playerGameboard = new Gameboard('player');
        const computer = new ComputerPlayer();
        const computerGameboard = new Gameboard('computer');
        for (const [shipName, arrOfCoords] of
            Object.entries(domController.shipLocations)) {
            const shipNameFirstLetterCapitalised = 
            shipName.slice(0,1).toUpperCase() + shipName.slice(1);
            playerGameboard.createShipAndPlaceItOnBoard(shipNameFirstLetterCapitalised, ...arrOfCoords);
        }
        const computerCoords = computer.randomlyGenerateComputerShipPlacements();
        for (const [shipName, arrOfCoords] of Object.entries(computerCoords)) {
            const shipNameFirstLetterCapitalised = 
            shipName.slice(0,1).toUpperCase() + shipName.slice(1);
            computerGameboard.createShipAndPlaceItOnBoard(shipNameFirstLetterCapitalised, ...arrOfCoords);
        }
        domController.renderGameplay(playerGameboard, computerGameboard, thePlayer, computer);
    }

    handleVolumeIconClick(e) {
        const volumeAEl = e.currentTarget;
        // when this icon displayed, sound should be playing
        if (volumeAEl.textContent === '🔊︁') { 
            volumeAEl.textContent = '︁︁🔇';
            if (this.introMusick.currentTime > 0 && !this.introMusick.ended) {
                this.introMusick.pause();
            } else if (this.sonarSound.currentTime > 0 && !this.sonarSound.ended) {
                this.sonarSound.pause();
            }
            //when displayed, sound should be muted
        } else if (volumeAEl.textContent === '︁︁🔇') { 
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

    selectNextShipToPlace() {
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
                const status = document.querySelector('.status');
                // eslint-disable-next-line quotes
                status.innerHTML = `YOU HAVE SUNK THE ENEMY FLEET! GAME OVER! 
                <a class="play-again" href="#">PLAY AGAIN?</a>`;
                const playAgainLink = document.querySelector('.play-again');
                playAgainLink.addEventListener('click', () => {
                    domController.restartGame(player);
                });
            }
        }
    }

    renderPlaceShipsScreen(player) {
        this.selectNextShipToPlace();
        /*on the first render of the gameplay screen, sets the volumeIcon based on 
        whether or not the player had the music playing when the START button was
        clicked*/ 
        const volumeIcon = (
            (this.introMusick.currentTime > 0 && 
                (!this.introMusick.paused && !this.introMusick.ended))
            || (this.sonarSound.currentTime > 0 &&
                 (!this.sonarSound.paused && !this.sonarSound.ended)) 
        ) ? '🔊︁' : '︁︁🔇';

        const playerNameUppercase = player.name.toUpperCase();
        
        const capitalizedShipName = this.currentShip.toUpperCase();
        this.status = `REAR ADMIRAL ${playerNameUppercase}, PLACE YOUR 
        ${capitalizedShipName}`;
        
        const body = document.querySelector('body');
        body.innerHTML = '';
        body.insertAdjacentHTML('afterbegin', placeShipsHTML);
        const status = document.querySelector('.status');
        status.textContent = this.status;
        const volumeIconAnchor = document.querySelector('.set-ships-screen-volume');
        volumeIconAnchor.textContent = volumeIcon;
        const changeAxisBtn = document.querySelector('.change-axis');
        changeAxisBtn.textContent = this.axis;      

        volumeIconAnchor.addEventListener('click', domController.handleVolumeIconClick);
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
                return;
            }

            /* If a cell is already occupied by another ship, clicking should do
            nothing */
            for (const coord of domController.whereToPlaceCurrentShip) {
                for (const arrOfCoordsOfAlreadyPlacedShip of 
                    Object.values(domController.shipLocations)) {
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
            domController.shipLocations[lowercaseShipName] =
            domController.whereToPlaceCurrentShip;

            /* Load the actual gameplay after the last ship (the destroyer) is
             placed */
            if (domController.currentShip === 'destroyer') {
                domController.playGame(player);
            }

            domController.selectNextShipToPlace();
            const uppercaseShipName = domController.currentShip.toUpperCase();
            status.textContent = `REAR ADMIRAL ${playerNameUppercase}, PLACE 
            YOUR ${uppercaseShipName}`;
        }

        function handleMouseOver(e) {

            // clear the "ship shadow" on the grid from the previous mouseOver
            cells.forEach(cell => cell.classList.remove('ship'));

            /* must clear the following property with every mouseOver event
            on a cell because if an illegible cell (eg. due to ship size) is 
            mousedOver, this property will not be updated */
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
                const digitsOfCoordsWhereShipMightBePlaced = [];
                for (let i=0; i < length; i++) {
                    const nextCellNum = coordNumber + i;
                    /* if placing a ship where the mouse currently is
                    would lead to the ship going off the board, do nothing,
                    because this will obviously not work */
                    if (nextCellNum > 10) return;
                    digitsOfCoordsWhereShipMightBePlaced.push(nextCellNum);
                }
                domController.whereToPlaceCurrentShip =
                 digitsOfCoordsWhereShipMightBePlaced.map(number => {
                     return coordLetter + number;
                 });  
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
                const lettersofCoordsWhereShipMightBePlaced = [];
                for (let i=0; i < length; i++) {
                    let nextCellLetterCodified = letterCodified + i;
                    /* if placing a ship where the mouse currently is
                    would lead to the ship going off the board, do nothing,
                    because this will obviously not work */
                    if (nextCellLetterCodified > 10) return;
                    nextCellLetterCodified = String(nextCellLetterCodified);
                    const nextCellLetter = numberLetterHash[nextCellLetterCodified];
                    lettersofCoordsWhereShipMightBePlaced.push(nextCellLetter);
                }
                domController.whereToPlaceCurrentShip = lettersofCoordsWhereShipMightBePlaced.map(letter => letter + coordNumber);
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

    renderGameplay(playerGameboard, computerGameboard, player, computer) {
        /*on the first render of the gameScreen, sets the volumeIcon based on 
        whether or not the player had the music playing when the START button was
        clicked*/ 
        const volumeIcon = (
            (this.introMusick.currentTime > 0 && (!this.introMusick.paused &&
                 !this.introMusick.ended))
            || (this.sonarSound.currentTime > 0 && (!this.sonarSound.paused &&
                 !this.sonarSound.ended)) 
        ) ? '🔊︁' : '︁︁🔇';

        const playerNameUppercase = player.name.toUpperCase();

        // programs the initial status to include the player's name
        if (this.status === 'AWAITING ORDERS, REAR ADMIRAL') {
            this.status = `AWAITING ORDERS, REAR ADMIRAL ${playerNameUppercase}`;
        }
        
        const body = document.querySelector('body');
        body.innerHTML = '';
        body.insertAdjacentHTML('afterbegin', gameplayHTML);     

        const volumeIconAnchor = document.querySelector('.volume');
        volumeIconAnchor.textContent = volumeIcon;
        const status = document.querySelector('.status');
        status.textContent = this.status;
        volumeIconAnchor.addEventListener('click', domController.handleVolumeIconClick);

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

            domController.renderGameplay(playerGameboard, computerGameboard, player, computer);
        }

        function playSounds(typeOfSounds) {
            if (volumeIconAnchor.textContent === '︁︁🔇') return;
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

