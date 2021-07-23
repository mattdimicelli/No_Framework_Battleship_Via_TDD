import Ship from './src/Ship';


test('creates a Destroyer with length of 2', () => {
    expect(new Ship('Destroyer')).toEqual({ shipType: 'Destroyer', length: 2, sunk: false, location: null });
});

test('create a Battleship with a length of 4', function () {
    expect(new Ship('Battleship')).toEqual({ shipType: 'Battleship', length: 4, sunk: false, location: null, });
});

test('submarine stores location of user choice', () => {
    const sub = new Ship('Submarine');
    sub.setLocation("A1","A2","A3");
    expect(sub).toEqual({ shipType: 'Submarine', length: 3, location: ["A1","A2","A3"], sunk: false, });
});

test('ship can be hit if it\'s at that location', () => {
    const sub = new Ship('Submarine');
    sub.setLocation("A1","A2","A3");
    sub.hit('A1');
    expect(sub).toEqual({ shipType: 'Submarine', length: 3, location: ["A1","A2","A3"], sunk: false, damage: ['A1'] });
});
