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
        this.whereToPlaceCurrentShip = null;
        this.letterNumberHash = {
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
        this.numberLetterHash = {
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
    }

    restartGame(player) {
        player.playerMadeFirstMove = false;
        domController.shipLocations = {
            carrier: null,
            battleship: null,
            cruiser: null,
            submarine: null,
            destroyer: null,
        };
        domController.currentShip = null;
        domController.whereToPlaceCurrentShip = null;
        domController.renderPlaceShipsScreen(player);
    }

    startGamePlay(player) {
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
        const ships = domController.shipLocations;
        if (ships.carrier === null) {
            domController.currentShip = 'carrier';
        } else if (ships.battleship === null) {
            domController.currentShip = 'battleship';
        } else if (ships.cruiser === null) {
            domController.currentShip = 'cruiser';
        } else if (ships.submarine === null) {
            domController.currentShip = 'submarine';
        } else if (ships.destroyer === null) {
            domController.currentShip = 'destroyer';
        } 
    }

    ifThereIsAWinnerAnnounceIt(playerGameboard, computerGameboard, player) {
        const status = document.querySelector('.status');
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
                status.textContent = 'GAME OVER. THE ENEMY HAS SUNK YOUR FLEET!';
            } else if (winner === 'DRAW') {
                // eslint-disable-next-line quotes
                status.textContent = "BOTH FLEETS HAVE BEEN SUNK!  IT'S A DRAW!";
            } else if (winner === 'PLAYER') {
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
        domController.selectNextShipToPlace();
        
        const body = document.querySelector('body');
        body.insertAdjacentHTML('afterbegin', placeShipsHTML);
        const status = document.querySelector('.status');
        const volumeIconAnchor = document.querySelector('.set-ships-screen-volume');
        const changeAxisBtn = document.querySelector('.change-axis');
        const cells = document.querySelectorAll('.cell');

        const playerNameUppercase = player.name.toUpperCase();
        const capitalizedShipName = domController.currentShip.toUpperCase();
        let axis = 'VERTICAL';

        /*Sets the volumeIcon based on whether or not the player had the music 
        playing when the START button wasclicked*/ 
        const volumeIcon = domController.setVolumeIcon();
        volumeIconAnchor.textContent = volumeIcon;

        status.textContent = `REAR ADMIRAL ${playerNameUppercase}, PLACE YOUR 
        ${capitalizedShipName}`;

        changeAxisBtn.textContent = axis;      

        volumeIconAnchor.addEventListener('click', domController.handleVolumeIconClick);
        changeAxisBtn.addEventListener('click', handleChangeAxis);
        cells.forEach(cell => cell.addEventListener('mouseover', handleMouseOver));
        cells.forEach(cell => cell.addEventListener('click', handleClick));

        function handleChangeAxis() {
            if (axis === 'VERTICAL') {
                axis = 'HORIZONTAL';
            } else {axis = 'VERTICAL';}
            changeAxisBtn.textContent = axis;
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

            /*Although a variable lowercaseShipName is declared in the outer
            function, must make a new variable in this function the currentShip
            gets updated*/
            const lowercaseShipName = domController.currentShip;
            domController.shipLocations[lowercaseShipName] =
            domController.whereToPlaceCurrentShip;

            /* Load the actual gameplay after the last ship (the destroyer) is
             placed */
            if (domController.currentShip === 'destroyer') {
                domController.startGamePlay(player);
            }

            domController.selectNextShipToPlace();
            /*Although a variable capitalizedShipName is declared in the outer
            function, must make a new variable in this function the currentShip
            gets updated*/
            const capitalizedShipName = domController.currentShip.toUpperCase();
            status.textContent = `REAR ADMIRAL ${playerNameUppercase}, PLACE 
            YOUR ${capitalizedShipName}`;
        }

        function getLengthOfShipToPlace() {
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
            return length;
        }

        function handleMouseOver(e) {

            // clear the "ship shadow" on the grid from the previous mouseOver
            cells.forEach(cell => cell.classList.remove('ship'));

            /* must clear the following property with every mouseOver event
            on a cell because if an illegible cell (eg. due to ship size) is 
            mousedOver, this property will not be updated */
            domController.whereToPlaceCurrentShip = null;

            const length = getLengthOfShipToPlace();
            
            const mousePointerCoord = e.currentTarget.classList[2];
            const coordLetter = mousePointerCoord.slice(0,1);
            const coordNumber = Number(mousePointerCoord.slice(1));

            if (axis === 'HORIZONTAL') {
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

            if (axis === 'VERTICAL') {
                const { letterNumberHash, numberLetterHash } = domController;
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
                domController.whereToPlaceCurrentShip =
                 lettersofCoordsWhereShipMightBePlaced.map(letter => letter + coordNumber);
            }

            /* if the ship can be placed where the mouse is hovering, show it's
            "shadow" on the grid */
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

        function handleStartBtn(e) {
            e.preventDefault();
            const playerName = nameInput.value;
            if(!playerName) {
                nameInput.focus();
                return;
            } 
            const player = { name: playerName };
            domController.renderPlaceShipsScreen(player);
        }
    }

    setVolumeIcon() {
        const volumeIcon = (
            (this.introMusick.currentTime > 0 && (!this.introMusick.paused &&
                 !this.introMusick.ended))
            || (this.sonarSound.currentTime > 0 && (!this.sonarSound.paused &&
                 !this.sonarSound.ended)) 
        ) ? '🔊︁' : '︁︁🔇';
        return volumeIcon;
    }

    renderGameplay(playerGameboard, computerGameboard, player, computer) {
        const playerNameUppercase = player.name.toUpperCase();
   
        const body = document.querySelector('body');
        body.insertAdjacentHTML('afterbegin', gameplayHTML);     

        const volumeIconAnchor = document.querySelector('.volume');
        const computerBoard = document.querySelector('.game-computer-board');
        const computerCells = computerBoard.querySelectorAll('.cell');
        const status = document.querySelector('.status');
        /*on the first render of the gameplay screen, sets the volumeIcon based on 
        whether or not the player had the music playing when the START button was
        clicked*/ 
        const volumeIcon = domController.setVolumeIcon();
        volumeIconAnchor.textContent = volumeIcon;
        status.textContent = `AWAITING ORDERS, REAR ADMIRAL ${playerNameUppercase}`;

        volumeIconAnchor.addEventListener('click', domController.handleVolumeIconClick);
        computerCells.forEach(cell => cell.addEventListener('click', handleClick));

        showPlayersShips();

        function createComputersAttackBehindTheScenes() {
         
            // the computer doesn't make it's first attack until after the player
            let resultOfComputersPlay;
            let shipType;
            if (player.playerMadeFirstMove) {
                const result = computer.attack(playerGameboard);
                // If result is an arr, additional rendering needed
                if (Array.isArray(result)) {
                    resultOfComputersPlay = result[0];
                    shipType = result[1].toUpperCase();
                }
                
                /*Although the computer makes it's play immediately, this timer delays 
                update to the UI so that it appears that the computer is "taking some time"
                to make it's move */ 
                setTimeout(() => {
                    // update missed shots (does for both players) after enemy attack
                    showMissedShots();
                    // update hits (does for both players) after enemy attack
                    showHits();
                    /* If any of the player's ships are hit (and/or sunk), the following effects take
                    place, otherwise, no update to the display is needed */
                    if (resultOfComputersPlay === 'hit ship') {
                        playSounds('hitSounds');
                        status.textContent = 'THE ' + shipType + ' HAS BEEN HIT BY THE ENEMY!';
                    } else if (resultOfComputersPlay === 'sunk ship') {
                        playSounds('hitSounds');
                        status.textContent = 'REAR ADMIRAL... THE ' + shipType + ' HAS BEEN DESTROYED BY THE ENEMY!';
                    }     

                    // every time after the computer plays, check if somebody won the game
                    domController.ifThereIsAWinnerAnnounceIt(playerGameboard, computerGameboard, player); 
                }, 2000);
            }
        }

        function showHits(){
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
        }

        function showPlayersShips() {
            // shows location of ships on player's board
            for (let setOfLocations of playerGameboard.occupiedLocations.values()) {
                for (let location of setOfLocations) {
                    const cell = document.querySelector(`.cell.player.${location}`);
                    cell.classList.add('ship');
                }
            }    
        }

        function showMissedShots() {
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
        }

        function handleClick(e) {
            /* clicking any location on the enemy board signifies that the player
            has taken his first (or subsequent) turn already */
            player.playerMadeFirstMove = true;
            // only do the following if a *unique* attack is attempted by the player
            if (attackAgainstComputer(e) !== 'repeat shot') {
                showMissedShots();
                showHits();
                createComputersAttackBehindTheScenes();
            }
            
            function attackAgainstComputer(e) {
                const coords = e.currentTarget.classList[2];
                const resultOfAttackOnEnemy = player.attack(coords, computerGameboard);
                if (Array.isArray(resultOfAttackOnEnemy)) {
                    const shipName = resultOfAttackOnEnemy[1].toUpperCase();
                    if (resultOfAttackOnEnemy[0] === 'hit ship') {
                        playSounds('shootSounds');
                        const hitStatuses = ['DIRECT HIT!', 'TARGET HIT!',
                            `TARGET HIT AT COORDINATE ${coords}!`, 'ENEMY TARGET HIT!',
                            `ENEMY TARGET HIT AT COORDINATE ${coords}!`];
                        status.textContent = _.sample(hitStatuses);
                    } else if (resultOfAttackOnEnemy[0] === 'sunk ship') {
                        playSounds('shootSounds');
                        const enemySunkStatuses = [`ENEMY ${shipName} SUNK!`,
                            `REAR ADMIRAL ${playerNameUppercase}, ENEMY ${shipName} DESTROYED!`,
                            `ENEMY ${shipName} ELIMINATED!`];
                        status.textContent = _.sample(enemySunkStatuses);
                    }
                } else if (resultOfAttackOnEnemy === 'attack missed') {
                    const missStatuses = ['TARGET MISSED',
                        'TARGET MISSED, REAR ADMIRAL', 'ENEMY TARGET MISSED'];
                    const missStatus = _.sample(missStatuses);
                    status.textContent = missStatus;
                    playSounds('shootSounds');
                } else if (resultOfAttackOnEnemy === 'repeat shot') {
                    /* if the cell has already been shot at, return 'repeat shot'
                    so that the gameboard knows that it doesn't need to re-
                    render */
                    return resultOfAttackOnEnemy;
                }
            }
        }

        function playSounds(typeOfSounds) {
            if (volumeIconAnchor.textContent === '︁︁🔇') return;
            let soundUrls;
            if (typeOfSounds === 'hitSounds') {
                soundUrls = [explosion1, explosion2, explosion3];
            } else if (typeOfSounds === 'shootSounds') {
                soundUrls = [lighterBlastSound, missleLaunchSound,
                    turretBlastSound, twoBlastsSound, railgunSound];
            }
            const randomSoundUrl = _.sample(soundUrls);
            const sound = new Audio(randomSoundUrl);
            sound.play();
        }
    }
}


const domController = new DOMController();

export default domController;

