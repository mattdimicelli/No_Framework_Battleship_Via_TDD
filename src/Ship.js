export default class Ship {
    constructor(shipType) {
        this.shipType = shipType;
        this.damage = new Set();

        switch (shipType) {
        case 'Destroyer':
            this.length = 2;
            break;
        case 'Battleship':
            this.length = 4;
            break;
        case 'Cruiser':
            this.length = 3;
            break;
        case 'Submarine':
            this.length = 3;
            break;
        case 'Carrier':
            this.length = 5;
            break;
        }
    }

    hit(location) {
        this.damage.add(location);
    }

    isSunk() {
        return (this.length === this.damage.size);
    }
}

