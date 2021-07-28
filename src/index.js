// import './styles.css';
// import Icon from './icon.png';
import Player from './Player';
import ComputerPlayer from './ComputerPlayer';
import Gameboard from './Gameboard';
import Ship from './Ship';


class GameLoop {
    createPlayers(humanName, computerName) {
        return { 
            human: new Player(humanName),
            computer: new ComputerPlayer(computerName),
        };
    }
    setupBoards() {
        return {
            human: new Gameboard(),
            computer: new Gameboard(),
        };
    }
   

}

const gameLoop = new GameLoop();
export default gameLoop;
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


