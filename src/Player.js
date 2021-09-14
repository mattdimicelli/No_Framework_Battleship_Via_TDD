class Player {
    constructor(name) {
        this.name = name;
        this.shotsFiredByThisPlayer = new Set();
        this.playerMadeFirstMove = false;
    }

    attack(coords, gameBoard) {
        if (!this.getCoordinatesHaveAlreadyBeenShotAtByThisPlayer(coords)) {
            const result = gameBoard.receiveAttack(coords);
            this.shotsFiredByThisPlayer.add(coords);
            if (Array.isArray(result)) return result;
            if (result === 'missed shot') return 'attack missed';
        }
        if (this.getCoordinatesHaveAlreadyBeenShotAtByThisPlayer(coords)) {
            return 'repeat shot';
        }
    }

    getCoordinatesHaveAlreadyBeenShotAtByThisPlayer(coords) {
        return this.shotsFiredByThisPlayer.has(coords);
    }
}

export default Player;