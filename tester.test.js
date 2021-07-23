import Ship from './src/Ship';
import Gameboard from './src/Gameboard';
import { expect, test } from '@jest/globals';


test('creates a Destroyer with length of 2', () => {
    expect(new Ship('Destroyer').length).toBe(2);
});

test('create a Battleship with a length of 4', function () {
    expect(new Ship('Battleship').length).toBe(4);
});

test('ship can be hit if it\'s at that location', () => {
    const sub = new Ship('Submarine');
    sub.location = new Set(["A1","A2","A3"]);
    sub.hit('A1');
    expect(sub.damage).toEqual(new Set(['A1']));
});

test('function isSunk() determines that a Destroyer that has been hit two times is sunk ', function() {
    const destroyer = new Ship('Destroyer');
    destroyer.location = new Set (['A1','A2']);
    destroyer.damage = new Set(['A1','A2']);
    expect(destroyer.isSunk()).toBe(true);
});  

test('function isSunk() determines that a Destroyer that has been hit once is not sunk ', function() {
    const destroyer = new Ship('Destroyer');
    destroyer.location = new Set (['A1','A2']);
    destroyer.damage = new Set(['A1']);
    expect(destroyer.isSunk()).toBe(false);
}); 

test('Destroyer ship can be placed at A1 and A2', function() {
    const p1PersonalGameboard = new Gameboard();
    const destroyer = p1PersonalGameboard.createShipAndPlaceItOnBoard('Destroyer', 'A1', 'A2');

    expect(p1PersonalGameboard.occupiedLocations.has(destroyer));
    expect(p1PersonalGameboard.occupiedLocations.get(destroyer)).toEqual(new Set(['A1','A2']));
});

test('Submarine can be placed at E7, E8, E9', function() {
    const p1PersonalGameboard = new Gameboard();
    const submarine = p1PersonalGameboard.createShipAndPlaceItOnBoard('Submarine', 'E7','E8','E9');
    expect(p1PersonalGameboard.occupiedLocations.has(submarine));
    expect(p1PersonalGameboard.occupiedLocations.get(submarine)).toEqual(new Set(['E7','E8', 'E9']));});

test('gameboard keeps track of the position of a ship', function() {
    const p1PersonalGameboard = new Gameboard();
    const submarine = p1PersonalGameboard.createShipAndPlaceItOnBoard('Submarine', 'E7','E8','E9');
    const map = new Map();
    map.set(submarine, new Set(['E7', 'E8', 'E9']));
    expect(p1PersonalGameboard.occupiedLocations).toEqual(map);
});

test('gameboard keeps track of the position of two ships', function() {
    const p1PersonalGameboard = new Gameboard();
    const submarine = p1PersonalGameboard.createShipAndPlaceItOnBoard('Submarine', 'E7','E8','E9');
    const destroyer = p1PersonalGameboard.createShipAndPlaceItOnBoard('Destroyer', 'A1','A2');
    const map = new Map();
    map.set(submarine, new Set(['E7', 'E8', 'E9']));
    map.set(destroyer, new Set(['A1', 'A2']));
    expect(p1PersonalGameboard.occupiedLocations).toEqual(map);
});

test('Submarine cannot be placed at E7, E8, E9 if there is a Destroyer on E7 and E8', function() {
    const p1PersonalGameboard = new Gameboard();
    p1PersonalGameboard.createShipAndPlaceItOnBoard('Destroyer', 'E7','E8');
    const returnValue = p1PersonalGameboard.createShipAndPlaceItOnBoard('Submarine', 'E7','E8','E9');
    expect(returnValue).toBe('Cannot place ship, location already occupied');
    expect(Object.keys(p1PersonalGameboard.occupiedLocations).includes('Submarine')).toBe(false);
});

test('gameboard calls the hit function on submarine if the submarine\'s location is attacked', function() {
    const p1PersonalGameboard = new Gameboard();
    const submarine = p1PersonalGameboard.createShipAndPlaceItOnBoard('Submarine', 'E7','E8','E9');
    expect(p1PersonalGameboard.receiveAttack('E7')).toBe(submarine.hit('E7'));
});

test('gameboard records a missed shot if a location that doesn\'t have a ship is attacked', () => {
    const p1PersonalGameboard = new Gameboard();
    p1PersonalGameboard.receiveAttack('E7');
    expect(p1PersonalGameboard.missedShots).toEqual(new Set(['E7']));
});

test('gameboard records multiple missed shots if those locations that are attacked don\'t have a ship', () => {
    const p1PersonalGameboard = new Gameboard();
    p1PersonalGameboard.receiveAttack('E7');
    p1PersonalGameboard.receiveAttack('A5');
    p1PersonalGameboard.receiveAttack('B2');
    expect(p1PersonalGameboard.missedShots).toEqual(new Set(['E7','A5','B2']));
});

test('gameboard correctly reports that all ships are sunk', function() {
    const p1PersonalGameboard = new Gameboard();
    const destroyer = p1PersonalGameboard.createShipAndPlaceItOnBoard('Destroyer', 'A3', 'A4');
    const carrier = p1PersonalGameboard.createShipAndPlaceItOnBoard('Carrier', 'D1', 'D2', 'D3', 'D4', 'D5');
    destroyer.damage.add('A3');
    destroyer.damage.add('A4');
    carrier.damage.add('D1');
    carrier.damage.add('D2');
    carrier.damage.add('D3');
    carrier.damage.add('D4');
    carrier.damage.add('D5');
    expect(p1PersonalGameboard.getAllShipsAreSunk()).toBe(true);
});

test('gameboard correctly reports that not all ships are sunk', function() {
    const p1PersonalGameboard = new Gameboard();
    const destroyer = p1PersonalGameboard.createShipAndPlaceItOnBoard('Destroyer', 'A3', 'A4');
    const carrier = p1PersonalGameboard.createShipAndPlaceItOnBoard('Carrier', 'D1', 'D2', 'D3', 'D4', 'D5');
    destroyer.damage.add('A3');
    destroyer.damage.add('A4');
    carrier.damage.add('D1');
    carrier.damage.add('D3');
    carrier.damage.add('D4');
    carrier.damage.add('D5');
    expect(p1PersonalGameboard.getAllShipsAreSunk()).toBe(false);
});
