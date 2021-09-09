import domController from './DOMController';
import './styles.css';




domController.renderStartScreen();
// const startBtn = document.querySelector('.start-button');
// const nameInput = document.querySelector('.name-input');
// startBtn.addEventListener('click', handleStartBtn);


// function handleStartBtn() {
//     domController.renderStartScreen();
    // domController.renderPlaceShipsScreen({name: 'Matt'});
    // const playerName = nameInput.value;
    // const player = new Player(playerName);
    // const playerGameboard = new Gameboard('player');
    // const computer = new ComputerPlayer();
    // const computerGameboard = new Gameboard('computer');
    // playerGameboard.createShipAndPlaceItOnBoard('Carrier', 'B1', 'C1', 'D1', 'E1', 'F1');
    // playerGameboard.createShipAndPlaceItOnBoard('Battleship', 'C4', 'C5', 'C6', 'C7');
    // playerGameboard.createShipAndPlaceItOnBoard('Cruiser', 'F8', 'F9', 'F10');
    // playerGameboard.createShipAndPlaceItOnBoard('Submarine', 'F5', 'G5', 'H5');
    // playerGameboard.createShipAndPlaceItOnBoard('Destroyer', 'H8', 'I8');

    // computerGameboard.createShipAndPlaceItOnBoard('Carrier', 'J6', 'J7', 'J8', 'J9', 'J10');
    // computerGameboard.createShipAndPlaceItOnBoard('Battleship', 'C4', 'D4', 'E4', 'F4');
    // computerGameboard.createShipAndPlaceItOnBoard('Cruiser', 'C8', 'C9', 'C10');
    // computerGameboard.createShipAndPlaceItOnBoard('Submarine', 'H2', 'H3', 'H4');
    // computerGameboard.createShipAndPlaceItOnBoard('Destroyer', 'E1', 'F1');

    // domController.renderGameScreen(playerGameboard, computerGameboard, player, computer);



























// The game is played on four grids, two for each player
// 10×10 (A-J)
// Before play begins, each player secretly arranges their ships on their
// primary grid.

	
// Carrier	    5
// Battleship	4
// Cruiser	    3
// Submarine	3
// Destroyer	2

// In each round, each player takes a turn to announce a target square in the
// opponent's grid which is to be shot at. The opponent announces whether or not
// the square is occupied by a ship.

// If it is a "hit", the player who is hit marks this on their own grid with a
// red peg. The attacking player marks the hit or miss on their own "target" 
// with red for "hit", white for "miss", in order to build up a picture of the 
// opponent's fleet.

// When all of the squares of a ship have been hit, the ship's owner announces 
// the sinking of the Carrier, Submarine, Cruiser/Destroyer/Patrol Boat, or the
// titular Battleship.

// If all of a player's ships have been sunk, the game is over and their 
// opponent wins.

// If all ships of both players are sunk by the end of the round, the game is a 
// draw.


