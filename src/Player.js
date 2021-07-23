

class Player {
    constructor(name) {
        this.name = name;
        this.shotsFiredByThisPlayer = new Set();
    }

    attack(coords, gameBoard) {
        if (this.getCoordinatesHaveNotAlreadyBeenShotAtByThisPlayer(coords)) {
            gameBoard.receiveAttack(coords);
            this.shotsFiredByThisPlayer.add(coords);
        }
        
    }

    getCoordinatesHaveNotAlreadyBeenShotAtByThisPlayer(coords) {
        return !this.shotsFiredByThisPlayer.has(coords);
    }
}

export default Player;