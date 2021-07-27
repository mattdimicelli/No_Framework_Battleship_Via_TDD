

class Player {
    constructor(name) {
        this.name = name;
        this.shotsFiredByThisPlayer = new Set();
    }

    attack(coords, gameBoard) {
        if (!this.getCoordinatesHaveAlreadyBeenShotAtByThisPlayer(coords)) {
            gameBoard.receiveAttack(coords);
            this.shotsFiredByThisPlayer.add(coords);
        }
        
    }

    getCoordinatesHaveAlreadyBeenShotAtByThisPlayer(coords) {
        return this.shotsFiredByThisPlayer.has(coords);
    }
}

export default Player;