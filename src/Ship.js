export default class Ship {
    constructor(shipType) {
        this.shipType = shipType;
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
        this.location = null;
        this.sunk = false;
    }

    setLocation(...locations) {
        this.location = locations;
    }
}

