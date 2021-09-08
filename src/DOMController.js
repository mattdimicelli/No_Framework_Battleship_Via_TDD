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


class DOMController {
    constructor() {
        this.status = 'Awaiting orders, Rear Admiral';
        this.firstTurn = true;
        this.introMusick = null;
        this.sonarSound = null;
        this.handleVolumeIconClick = this.handleVolumeIconClick.bind(this);
        this.ifThereIsAWinnerAnnounceIt = this.ifThereIsAWinnerAnnounceIt.bind(this);
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

    ifThereIsAWinnerAnnounceIt(playerGameboard, computerGameboard, playerNameFirstLetterCapitalized) {
        let winner;
        if (playerGameboard.getAllOfThisPlayersShipsAreSunk()) {
            winner = 'ENEMY';
        }
        if (computerGameboard.getAllOfThisPlayersShipsAreSunk()) {
            winner = playerNameFirstLetterCapitalized.toUpperCase();
        }
        if (winner) {
            if(winner === 'ENEMY') {
                this.status = 'GAME OVER. THE ENEMY HAS SUNK YOUR FLEET!';
            }
            else {
                this.status = `YOU HAVE SUNK THE ENEMY FLEET, REAR ADMIRAL ${winner}! GAME OVER! <a class="play-again" href="#">PLAY AGAIN?</a>`;
                const playAgainLink = document.querySelector('.play-again');
                // playAgainLink.onClick = playAgain();
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
    }

    renderGameScreen(playerGameboard, computerGameboard, player, computer) {
        /*on the first render of the gameScreen, sets the volumeIcon based on 
        whether or not the player had the music playing when the START button was
        clicked*/ 
        const volumeIcon = (
            (this.introMusick.currentTime > 0 && (!this.introMusick.paused && !this.introMusick.ended))
            || (this.sonarSound.currentTime > 0 && (!this.sonarSound.paused && !this.sonarSound.ended)) 
        ) ? '🔊︁' : '︁︁🔇';

        const playerNameFirstLetterCapitalized = player.name.slice(0,1).toUpperCase() + player.name.slice(1);

        // programs the initial status to include the player's name
        if (this.status === 'Awaiting orders, Rear Admiral') {
            this.status = `Awaiting orders, Rear Admiral ${playerNameFirstLetterCapitalized}`;
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
                    const enemySunkStatuses = [`ENEMY ${shipName} SUNK!`, `REAR ADMIRAL ${playerNameFirstLetterCapitalized.toUpperCase()}, ENEMY ${shipName} DESTROYED!`, `ENEMY ${shipName} ELIMINATED!`];
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

            // every time the player makes a move, check if somebody won the game
            domController.ifThereIsAWinnerAnnounceIt(playerGameboard, computerGameboard, playerNameFirstLetterCapitalized); 

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

