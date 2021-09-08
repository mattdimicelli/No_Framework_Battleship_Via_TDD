class Player {
    constructor(name) {
        this.name = name;
        this.shotsFiredByThisPlayer = new Set();
    }

    attack(coords, gameBoard) {
        if (!this.getCoordinatesHaveAlreadyBeenShotAtByThisPlayer(coords)) {
            const result = gameBoard.receiveAttack(coords);
            this.shotsFiredByThisPlayer.add(coords);
            if (Array.isArray(result) && result === 'hit ship') return 'hit';
            if (Array.isArray(result) && result[0] === 'sunk ship') {
                return result[1];
            }
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