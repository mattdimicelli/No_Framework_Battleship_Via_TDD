import Ship from './src/Ship';
import Gameboard from './src/Gameboard';
import { expect, test } from '@jest/globals';
import Player from './src/Player';
import ComputerPlayer from './src/ComputerPlayer';
import gameLoop from './src/index';


describe('Ship constructor', () => {
    test('Ships should be of following lengths: Carrier 5, Battleship 4, Cruiser 3, Submarine 2, Destroyer 2', () => {
        expect(new Ship('Destroyer').length).toBe(2);
        expect(new Ship('Battleship').length).toBe(4);
        expect(new Ship('Carrier').length).toBe(5);
        expect(new Ship('Cruiser').length).toBe(3);
        expect(new Ship('Submarine').length).toBe(3);
    });

    test('ship object knows where it has been hit', () => {
        const sub = new Ship('Submarine');
        sub.hit('A1');
        expect(sub.damage).toEqual(new Set(['A1']));
    });

    test('function isSunk() determines that a Destroyer that has been hit two times is sunk ', function() {
        const destroyer = new Ship('Destroyer');
        destroyer.hit('A1');
        destroyer.hit('A2');
        expect(destroyer.isSunk()).toBe(true);
    });  

    test('function isSunk() determines that a Destroyer that has been hit once is not sunk ', function() {
        const destroyer = new Ship('Destroyer');
        destroyer.hit('B2');
        expect(destroyer.isSunk()).toBe(false);
    }); 
});

describe('gameboard module', function() {
    test('Gameboard can place a destroyer at A1 and A2 by calling ship constructor', function() {
        const p1PersonalGameboard = new Gameboard();
        p1PersonalGameboard.createShipAndPlaceItOnBoard('Destroyer', 'A1', 'A2');
        const arr = [];
        for (let value of p1PersonalGameboard.occupiedLocations.values()) {
            arr.push(value);
        }
        expect(arr[0]).toEqual(new Set(['A1','A2']));
    });

    test('Gameboard can place submarine at E7, E8, E9 by calling ship constructor', function() {
        const p1PersonalGameboard = new Gameboard();
        p1PersonalGameboard.createShipAndPlaceItOnBoard('Submarine', 'E7','E8','E9');
        const arr = [];
        for (let value of p1PersonalGameboard.occupiedLocations.values()) {
            arr.push(value);
        }
        expect(arr[0]).toEqual(new Set(['E7','E8', 'E9']));
    });

    test('gameboard keeps track of the position of two ships', function() {
        const p1PersonalGameboard = new Gameboard();
        p1PersonalGameboard.createShipAndPlaceItOnBoard('Submarine', 'E7','E8','E9');
        p1PersonalGameboard.createShipAndPlaceItOnBoard('Destroyer', 'A1','A2');
        const map = new Map();
        map.set(new Ship('Submarine'), new Set(['E7', 'E8', 'E9']));
        map.set(new Ship('Destroyer'), new Set(['A1', 'A2']));
        expect(p1PersonalGameboard.occupiedLocations).toEqual(map);
    });

    test('Submarine cannot be placed at E7, E8, E9 if there is a Destroyer on E7 and E8', function() {
        const p1PersonalGameboard = new Gameboard();
        p1PersonalGameboard.createShipAndPlaceItOnBoard('Destroyer', 'E7','E8');
        const returnValue = p1PersonalGameboard.createShipAndPlaceItOnBoard('Submarine', 'E7','E8','E9');
        expect(returnValue).toBe('Cannot place ship, location already occupied');
        const arr = [];
        for (let entry of p1PersonalGameboard.occupiedLocations.entries()) {
            arr.push(entry);
        }
        expect(arr).toEqual([[new Ship('Destroyer'), new Set(['E7', 'E8'])]]);
    });

    test('receiveAttack() calls the hit function on submarine with the attack coordinates if the submarine\'s location is attacked', function() {
        const p1PersonalGameboard = new Gameboard();
        const sub = new Ship('Submarine');
        p1PersonalGameboard.occupiedLocations.set(sub, new Set(['E7','E8','E9']));
        sub.hit = jest.fn();
        p1PersonalGameboard.receiveAttack('E7');
        expect(sub.hit.mock.calls[0][0]).toBe('E7');
    });

    test('gameboard records a missed shot if a location that doesn\'t have a ship is attacked', () => {
        const p1PersonalGameboard = new Gameboard();
        p1PersonalGameboard.receiveAttack('E7');
        expect(p1PersonalGameboard.missedShotsFromOpponent).toEqual(new Set(['E7']));
    });

    test('gameboard records multiple missed shots if those locations that are attacked don\'t have a ship', () => {
        const p1PersonalGameboard = new Gameboard();
        p1PersonalGameboard.receiveAttack('E7');
        p1PersonalGameboard.receiveAttack('A5');
        p1PersonalGameboard.receiveAttack('B2');
        expect(p1PersonalGameboard.missedShotsFromOpponent).toEqual(new Set(['E7','A5','B2']));
    });

    test('gameboard correctly reports that all ships are sunk', function() {
        const p1PersonalGameboard = new Gameboard();
        p1PersonalGameboard.createShipAndPlaceItOnBoard('Destroyer', 'A3', 'A4');
        p1PersonalGameboard.createShipAndPlaceItOnBoard('Carrier', 'D1', 'D2', 'D3', 'D4', 'D5');
        for (let ship of p1PersonalGameboard.occupiedLocations.keys()) {
            if (ship.shipType === 'Destroyer') {
                ship.damage.add('A3');
                ship.damage.add('A4');
            } else if (ship.shipType === 'Carrier') {
                ship.damage.add('D1');
                ship.damage.add('D2');
                ship.damage.add('D3');
                ship.damage.add('D4');
                ship.damage.add('D5');
            }
        }
        expect(p1PersonalGameboard.getAllOfThisPlayersShipsAreSunk()).toBe(true);
    });

    test('gameboard correctly reports that not all ships are sunk', function() {
        const p1PersonalGameboard = new Gameboard();
        p1PersonalGameboard.createShipAndPlaceItOnBoard('Destroyer', 'A3', 'A4');
        p1PersonalGameboard.createShipAndPlaceItOnBoard('Carrier', 'D1', 'D2', 'D3', 'D4', 'D5');
        for (let ship of p1PersonalGameboard.occupiedLocations.keys()) {
            if (ship.shipType === 'Destroyer') {
                ship.damage.add('A3');
                ship.damage.add('A4');
            } else if (ship.shipType === 'Carrier') {
                ship.damage.add('D1');
                ship.damage.add('D3');
                ship.damage.add('D4');
                ship.damage.add('D5');
            }
        }
        expect(p1PersonalGameboard.getAllOfThisPlayersShipsAreSunk()).toBe(false);
    });

    test('when an attack on the enemy gameboard doesn\'t hit a ship, the miss is recorded on the enemy gameboard', function () {
        const enemyGameBoard = new Gameboard;
        const matt = new Player('Matt');
        matt.attack('E7', enemyGameBoard);
        expect(enemyGameBoard.missedShotsFromOpponent.has('E7')).toBe(true);
    });
});

describe('the player', () => {
    test('player object has name of player', function () {
        const matt = new Player('Matt');
        expect(matt.name).toBe('Matt');
    });


    test('player can attack a ship on the opponent\'s gameboard', function() {
        const matt = new Player('Matt');
        const enemyGameBoard = new Gameboard();
        enemyGameBoard.createShipAndPlaceItOnBoard('Destroyer', 'B1', 'B2');
        matt.attack('B2', enemyGameBoard);
        let damage;
        for (let ship of enemyGameBoard.occupiedLocations.keys()) {
            damage = ship.damage;
        }
        expect(damage.has('B2')).toBe(true);
    });


    test('player keeps track of the shots that it has fired', function() {
        const doofy = new Player('doofy');
        const anEnemyGameBoard = new Gameboard();
        doofy.attack('C8', anEnemyGameBoard);
        doofy.attack('D9', anEnemyGameBoard);
        expect(doofy.shotsFiredByThisPlayer.has('C8')).toBe(true);
        expect(doofy.shotsFiredByThisPlayer.has('D9')).toBe(true);
    });
});

describe('the computer player', function() {
    test('generateRandomCoordinates() only makes appropriate Battleship coordinates', function() {
        const computer = new ComputerPlayer();
        for (let i = 0; i < 100; i++) {
            expect(computer.generateRandomCoordinates()).toMatch(/[A-J](?:[0-9]|(?:10))/);
        }
    });

    test('the computer knows not to fire on a space that it has already fired at', function() {
        const computer = new ComputerPlayer('doofy');
        const anEnemyGameBoard = new Gameboard();
        computer.generateRandomCoordinates = jest.fn();
        computer.generateRandomCoordinates.mockReturnValueOnce('C7').mockReturnValueOnce('C7').mockReturnValueOnce('C7').mockReturnValueOnce('C8');
        computer.attack(anEnemyGameBoard);
        computer.attack(anEnemyGameBoard);
        expect(computer.generateRandomCoordinates.mock.calls.length).toBe(4);
        expect(computer.shotsFiredByThisPlayer.size).toBe(2);
        expect(computer.shotsFiredByThisPlayer.has('C7')).toBe(true);
        expect(computer.shotsFiredByThisPlayer.has('C8')).toBe(true);
    });
});

test('when setting up the game, the player and computer player are created with requested names.', function() {
    const humanName = 'Matt';
    const computerName = 'Mussolini';
    const players = gameLoop.createPlayers(humanName, computerName);
    expect(players.human.name).toBe('Matt');
    expect(players.computer.name).toBe('Mussolini');
});

test('when setting up game a human board and a computer-enemy board are created', () => {
    const boards = gameLoop.setupBoards();
    expect(boards).toEqual({
        human: new Gameboard(),
        computer: new Gameboard(),
    });
});




