import Ship from './Ship';

class Gameboard {
    constructor() {
        this.occupiedLocations = new Map();
        this.missedShotsFromOpponent = new Set();
    
    }

    createShipAndPlaceItOnBoard(shipName, ...locations) {
        if(this.getAreAnyOfTheLocationsOccupied(locations)) {
            return 'Cannot place ship, location already occupied';
        }
        const ship = new Ship(shipName);
        this.occupiedLocations.set(ship, new Set(locations));
        return ship;
    }

    getAreAnyOfTheLocationsOccupied(locations) {
        if(this.occupiedLocations.size > 0) {
            for (let setOfLocations of this.occupiedLocations.values()) {
                for (let location of locations) {
                    if(setOfLocations.has(location)) {
                        return true;
                    }
                }
            }
        }
    }

    receiveAttack(locationCoordinates) {
        for (let [ship , setOfLocations] of this.occupiedLocations.entries()) {
            if (setOfLocations.has(locationCoordinates)) {
                return ship.hit(locationCoordinates);
            } 
        }
        this.missedShotsFromOpponent.add(locationCoordinates);

    }

    getAllOfThisPlayersShipsAreSunk() {
        const arrOfShips = this.occupiedLocations.keys();
        for (let ship of arrOfShips) {
            if (ship.isSunk() === false) {
                return false;
            }
        }
        return true;
    }
}

export default Gameboard;