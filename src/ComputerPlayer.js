import Player from './Player';

class ComputerPlayer extends Player {
    constructor() {
        super();
    }

    generateRandomCoordinates() {
        const letters = ['A','B','C','D','E','F','G','H','I','J'];
        const numbers = ['1','2','3','4','5','6','7','8','9','10'];
        const randomIndex1 = Math.floor(Math.random() * 10);
        const randomIndex2 = Math.floor(Math.random() * 10);
        return letters[randomIndex1] + numbers[randomIndex2];
    }

    attack(gameBoard) {
        let coords = this.generateRandomCoordinates();
        if (!this.getCoordinatesHaveAlreadyBeenShotAtByThisPlayer(coords)) {
            const result = gameBoard.receiveAttack(coords);
            this.shotsFiredByThisPlayer.add(coords);
            if (Array.isArray(result)) return result;
        } else {
            return this.attack(gameBoard);
        }
    }

    randomlyGenerateComputerShipPlacements() {
        const letterNumberHash = {
            'A': 1,
            'B': 2,
            'C': 3,
            'D': 4,
            'E': 5,
            'F': 6,
            'G': 7,
            'H': 8,
            'I': 9,
            'J': 10
        };
        const numberLetterHash = {
            1: 'A',
            2: 'B',
            3: 'C',
            4: 'D',
            5: 'E',
            6: 'F',
            7: 'G',
            8: 'H',
            9: 'I',
            10: 'J',
        };
        
        let remainingGridCoordinates = [];
        
        // Initially the computer has the entire grid where to place a ship
        for (let i = 1; i <= 10; i++) {
            for (let letter of Object.keys(letterNumberHash)) {
                remainingGridCoordinates.push(letter + i);
            }
        }

        const shipLocations = {
            carrier: placeHorizontallyOrVertically(5),
            battleship: placeHorizontallyOrVertically(4),
            cruiser: placeHorizontallyOrVertically(3),
            submarine: placeHorizontallyOrVertically(3),
            destroyer: placeHorizontallyOrVertically(2),
        };

        console.log('computer ship locations', shipLocations);
        return shipLocations;
    
        function placeHorizontallyOrVertically(shipLength) {
            let coords = null;
            /* placeShipHorizontally() and placeShipVertically() both do not
            always return coordinates on every invocation.  this loop executes
            either function until one returns (valid) coordinates */
            while (coords === null) {
                if (Math.random() >= 0.5) {
                    coords = placeShipHorizontally(shipLength);
                } else {
                    coords = placeShipVertically(shipLength);
                }
            }
            return coords;
        }

        function placeShipHorizontally(shipLength) {
            const randomLetter = _.sample(Object.keys(letterNumberHash));
            const randomNumber = _.sample(Object.values(letterNumberHash));
            const randomCoord = randomLetter + randomNumber;
            /* If the random coordinate is already occupied by another ship on the
            enemy gameboard*/
            if (!remainingGridCoordinates.includes(randomCoord)) {
                return null;
            } else {
                /* the grid is 10 x 10 cells, so return null if the number is 
                more than 10*/
                if (randomNumber + (shipLength - 1) > 10) {
                    return null;
                } else {
                    const coordsAlreadyOccupied = [];
                    const coordsForShip = [];
                    coordsForShip.push(randomCoord);
                    for (let i = 1; i < shipLength; i++) {
                        const newNumber = randomNumber + i;
                        const newCoord = randomLetter + newNumber;
                        if (!remainingGridCoordinates.includes(newCoord)) {
                            coordsAlreadyOccupied.push(newCoord);
                        }
                        coordsForShip.push(newCoord);
                    }
                    /* If ANY of the coordinates where the computer is trying to
                    place the ship are already occupied, return null */ 
                    if (coordsAlreadyOccupied.length > 0) {
                        return null;
                    } else {
                        /* this removes the coordinates for the currently 
                        selected ship from the "bank" of available coords*/
                        remainingGridCoordinates = remainingGridCoordinates.filter(coord => {
                            for (let chosenCoord of coordsForShip) {
                                if (coord === chosenCoord) return false;
                            }
                            return true;
                        });
                        return coordsForShip;
                    }
                }
            }
        }

        function placeShipVertically(shipLength) {
            const randomLetter = _.sample(Object.keys(letterNumberHash));
            const randomNumber = _.sample(Object.values(letterNumberHash));
            const randomCoord = randomLetter + randomNumber;
            if (!remainingGridCoordinates.includes(randomLetter + randomNumber)) {
                return null;
            } else {
                const randomLetterCodified = letterNumberHash[randomLetter];
                /* the grid is 10 x 10 cells, so return null if the number is 
                more than 10*/
                if (randomLetterCodified + (shipLength - 1) > 10) {
                    return null;
                } else {
                    const coordsAlreadyOccupied = [];
                    const coordsForShip = [];
                    coordsForShip.push(randomCoord);
                    for (let i = 1; i < shipLength; i++) {
                        const newLetterCodified = randomLetterCodified + i;
                        const newLetter = numberLetterHash[newLetterCodified];
                        const newCoord = newLetter + randomNumber;
                        if (!remainingGridCoordinates.includes(newCoord)) {
                            coordsAlreadyOccupied.push(newCoord);
                        }
                        coordsForShip.push(newCoord);
                    }
                    if (coordsAlreadyOccupied.length > 0) {
                        return null;
                    } else {
                        /* this removes the coordinates for the currently 
                        selected ship from the "bank" of available coords*/
                        remainingGridCoordinates = remainingGridCoordinates.filter(coord => {
                            for (let chosenCoord of coordsForShip) {
                                if (coord === chosenCoord) return false;
                            }
                            return true;
                        });
                        return coordsForShip;
                    }
                }
            }
        }
    }
}

export default ComputerPlayer;