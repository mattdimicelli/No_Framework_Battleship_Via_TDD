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
    }

    getAreAnyOfTheLocationsOccupied(locations) {
        for (let setOfLocations of this.occupiedLocations.values()) {
            for (let location of locations) {
                if(setOfLocations.has(location)) {
                    return true;
                }
            }
        }
    }


    receiveAttack(locationCoordinates) {
        for (let [ship , setOfLocations] of this.occupiedLocations.entries()) {
            if (setOfLocations.has(locationCoordinates)) {
                ship.hit(locationCoordinates);
                return;
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