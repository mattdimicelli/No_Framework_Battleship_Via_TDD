import introMusic from './audio/intro-music.mp3';

class DOMController {
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
        volume.textContent = '︁🔇';
        volume.classList.add('volume');
        volume.href = '#';
        controlsContainer.append(nameForm, volume);
        startScreen.append(titleContainer, controlsContainer);
        setTimeout(() => {
            controlsContainer.classList.add('visible');
            titleContainer.classList.add('visible');
        }, 500);
        body.append(startScreen);
        const introMusick = new Audio(introMusic);
        volume.addEventListener('click', () => {
            if (volume.textContent === '🔊︁') {
                volume.textContent = '🔇';
                introMusick.pause();
            } else {
                volume.textContent = '🔊︁';
                introMusick.currentTime = 0;
                introMusick.play();
            }
        });
    }
    renderGameScreen() {
        const html = `
        <div class="main-container">
            <header>
                <div class="game-title-container">
                    <h1 class="game-title">BATTLESHIP</h1>
                </div>
                <h2 class="status">The enemy fires a shot into you're waters... it's a hit!</h2>
            </header>
            <div class="game-board-container">
                <div class="board-and-label-container">
                    <h2 class="board-label">FRIENDLY FLEET</h2>
                    <div class="game-player-board">
                        <div class="cell player A1">•</div>
                        <div class="cell player A2">•</div>
                        <div class="cell player A3">•</div>
                        <div class="cell player A4">•</div>
                        <div class="cell player A5">•</div>
                        <div class="cell player A6">•</div>
                        <div class="cell player A7">•</div>
                        <div class="cell player A8">•</div>
                        <div class="cell player A9">•</div>
                        <div class="cell player A10">•</div>
                        <div class="cell player B1">•</div>
                        <div class="cell player B2">•</div>
                        <div class="cell player B3">•</div>
                        <div class="cell player B4">•</div>
                        <div class="cell player B5">•</div>
                        <div class="cell player B6">•</div>
                        <div class="cell player B7">•</div>
                        <div class="cell player B8">•</div>
                        <div class="cell player B9">•</div>
                        <div class="cell player B10">•</div>
                        <div class="cell player C1">•</div>
                        <div class="cell player C2">•</div>
                        <div class="cell player C3">•</div>
                        <div class="cell player C4">•</div>
                        <div class="cell player C5">•</div>
                        <div class="cell player C6">•</div>
                        <div class="cell player C7">•</div>
                        <div class="cell player C8">•</div>
                        <div class="cell player C9">•</div>
                        <div class="cell player C10">•</div>
                        <div class="cell player D1">•</div>
                        <div class="cell player D2">•</div>
                        <div class="cell player D3">•</div>
                        <div class="cell player D4">•</div>
                        <div class="cell player D5">•</div>
                        <div class="cell player D6">•</div>
                        <div class="cell player D7">•</div>
                        <div class="cell player D8">•</div>
                        <div class="cell player D9">•</div>
                        <div class="cell player D10">•</div>  
                        <div class="cell player E1">•</div>
                        <div class="cell player E2">•</div>
                        <div class="cell player E3">•</div>
                        <div class="cell player E4">•</div>
                        <div class="cell player E5">•</div>
                        <div class="cell player E6">•</div>
                        <div class="cell player E7">•</div>
                        <div class="cell player E8">•</div>
                        <div class="cell player E9">•</div>
                        <div class="cell player E10">•</div>
                        <div class="cell player F1">•</div>
                        <div class="cell player F2">•</div>
                        <div class="cell player F3">•</div>
                        <div class="cell player F4">•</div>
                        <div class="cell player F5">•</div>
                        <div class="cell player F6">•</div>
                        <div class="cell player F7">•</div>
                        <div class="cell player F8">•</div>
                        <div class="cell player F9">•</div>
                        <div class="cell player F10">•</div>
                        <div class="cell player G1">•</div>
                        <div class="cell player G2">•</div>
                        <div class="cell player G3">•</div>
                        <div class="cell player G4">•</div>
                        <div class="cell player G5">•</div>
                        <div class="cell player G6">•</div>
                        <div class="cell player G7">•</div>
                        <div class="cell player G8">•</div>
                        <div class="cell player G9">•</div>
                        <div class="cell player G10">•</div>
                        <div class="cell player H1">•</div>
                        <div class="cell player H2">•</div>
                        <div class="cell player H3">•</div>
                        <div class="cell player H4">•</div>
                        <div class="cell player H5">•</div>
                        <div class="cell player H6">•</div>
                        <div class="cell player H7">•</div>
                        <div class="cell player H8">•</div>
                        <div class="cell player H9">•</div>
                        <div class="cell player H10">•</div>
                        <div class="cell player I1">•</div>
                        <div class="cell player I2">•</div>
                        <div class="cell player I3">•</div>
                        <div class="cell player I4">•</div>
                        <div class="cell player I5">•</div>
                        <div class="cell player I6">•</div>
                        <div class="cell player I7">•</div>
                        <div class="cell player I8">•</div>
                        <div class="cell player I9">•</div>
                        <div class="cell player I10">•</div>
                        <div class="cell player J1">•</div>
                        <div class="cell player J2">•</div>
                        <div class="cell player J3">•</div>
                        <div class="cell player J4">•</div>
                        <div class="cell player J5">•</div>
                        <div class="cell player J6">•</div>
                        <div class="cell player J7">•</div>
                        <div class="cell player J8">•</div>
                        <div class="cell player J9">•</div>
                        <div class="cell player J10">•</div>
                    </div>
                </div>
                <div class="board-and-label-container">
                    <h2 class="board-label">ENEMY FLEET</h2>
                    <div class="game-computer-board">
                        <div class="cell computer A1">•</div>
                        <div class="cell computer A2">•</div>
                        <div class="cell computer A3">•</div>
                        <div class="cell computer A4">•</div>
                        <div class="cell computer A5">•</div>
                        <div class="cell computer A6">•</div>
                        <div class="cell computer A7">•</div>
                        <div class="cell computer A8">•</div>
                        <div class="cell computer A9">•</div>
                        <div class="cell computer A10">•</div>
                        <div class="cell computer B1">•</div>
                        <div class="cell computer B2">•</div>
                        <div class="cell computer B3">•</div>
                        <div class="cell computer B4">•</div>
                        <div class="cell computer B5">•</div>
                        <div class="cell computer B6">•</div>
                        <div class="cell computer B7">•</div>
                        <div class="cell computer B8">•</div>
                        <div class="cell computer B9">•</div>
                        <div class="cell computer B10">•</div>
                        <div class="cell computer C1">•</div>
                        <div class="cell computer C2">•</div>
                        <div class="cell computer C3">•</div>
                        <div class="cell computer C4">•</div>
                        <div class="cell computer C5">•</div>
                        <div class="cell computer C6">•</div>
                        <div class="cell computer C7">•</div>
                        <div class="cell computer C8">•</div>
                        <div class="cell computer C9">•</div>
                        <div class="cell computer C10">•</div>
                        <div class="cell computer D1">•</div>
                        <div class="cell computer D2">•</div>
                        <div class="cell computer D3">•</div>
                        <div class="cell computer D4">•</div>
                        <div class="cell computer D5">•</div>
                        <div class="cell computer D6">•</div>
                        <div class="cell computer D7">•</div>
                        <div class="cell computer D8">•</div>
                        <div class="cell computer D9">•</div>
                        <div class="cell computer D10">•</div>  
                        <div class="cell computer E1">•</div>
                        <div class="cell computer E2">•</div>
                        <div class="cell computer E3">•</div>
                        <div class="cell computer E4">•</div>
                        <div class="cell computer E5">•</div>
                        <div class="cell computer E6">•</div>
                        <div class="cell computer E7">•</div>
                        <div class="cell computer E8">•</div>
                        <div class="cell computer E9">•</div>
                        <div class="cell computer E10">•</div>
                        <div class="cell computer F1">•</div>
                        <div class="cell computer F2">•</div>
                        <div class="cell computer F3">•</div>
                        <div class="cell computer F4">•</div>
                        <div class="cell computer F5">•</div>
                        <div class="cell computer F6">•</div>
                        <div class="cell computer F7">•</div>
                        <div class="cell computer F8">•</div>
                        <div class="cell computer F9">•</div>
                        <div class="cell computer F10">•</div>
                        <div class="cell computer G1">•</div>
                        <div class="cell computer G2">•</div>
                        <div class="cell computer G3">•</div>
                        <div class="cell computer G4">•</div>
                        <div class="cell computer G5">•</div>
                        <div class="cell computer G6">•</div>
                        <div class="cell computer G7">•</div>
                        <div class="cell computer G8">•</div>
                        <div class="cell computer G9">•</div>
                        <div class="cell computer G10">•</div>
                        <div class="cell computer H1">•</div>
                        <div class="cell computer H2">•</div>
                        <div class="cell computer H3">•</div>
                        <div class="cell computer H4">•</div>
                        <div class="cell computer H5">•</div>
                        <div class="cell computer H6">•</div>
                        <div class="cell computer H7">•</div>
                        <div class="cell computer H8">•</div>
                        <div class="cell computer H9">•</div>
                        <div class="cell computer H10">•</div>
                        <div class="cell computer I1">•</div>
                        <div class="cell computer I2">•</div>
                        <div class="cell computer I3">•</div>
                        <div class="cell computer I4">•</div>
                        <div class="cell computer I5">•</div>
                        <div class="cell computer I6">•</div>
                        <div class="cell computer I7">•</div>
                        <div class="cell computer I8">•</div>
                        <div class="cell computer I9">•</div>
                        <div class="cell computer I10">•</div>
                        <div class="cell computer J1">•</div>
                        <div class="cell computer J2">•</div>
                        <div class="cell computer J3">•</div>
                        <div class="cell computer J4">•</div>
                        <div class="cell computer J5">•</div>
                        <div class="cell computer J6">•</div>
                        <div class="cell computer J7">•</div>
                        <div class="cell computer J8">•</div>
                        <div class="cell computer J9">•</div>
                        <div class="cell computer J10">•</div>
                    </div>
                </div>
            </div>
                `;
                
        const body = document.querySelector('body');
        body.innerHTML = '';
        body.insertAdjacentHTML('afterbegin', html);
        document.addEventListener('mousemove', (e) => console.log(e.target.className));
    }

    renderGameboard(gameboard) {
        const { player } = gameboard;
        if (player === 'player') {
            for (let setOfLocations of gameboard.occupiedLocations.values()) {
                for (let location of setOfLocations) {
                    const cell = document.querySelector(`.cell.${player}.${location}`);
                    cell.classList.add('occupied');
                }
            }
        } else if (player === 'computer') {

        }
    }
}

export default new DOMController();

