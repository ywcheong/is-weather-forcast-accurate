const { TimeKey, SortKey, WeatherDataUnit, DynamoDB } = require('./dynamo.js');

describe('TimeKey', () => {
    test('new / toString', () => {
        const timeKey = TimeKey.create(2021, 1, 2, 3);
        expect(timeKey.toString()).toBe('21010203');
    });

    test('new - wrong format', () => {
        expect(() => TimeKey.create(21, 1, 2, 3)).toThrow();
        expect(() => TimeKey.create(2021, 13, 2, 3)).toThrow();
        expect(() => TimeKey.create(2021, 1, 32, 3)).toThrow();
        expect(() => TimeKey.create(2021, 1, 2, 24)).toThrow();
    });

    test('shift - positive hours', () => {
        const timeKey = TimeKey.create(2021, 1, 2, 3);
        const shiftedTimeKey = timeKey.shift(100);
        expect(shiftedTimeKey.toString()).toBe('21010607');
    });

    test('shift - negative hours', () => {
        const timeKey = TimeKey.create(2021, 1, 2, 3);
        const shiftedTimeKey = timeKey.shift(-1);
        expect(shiftedTimeKey.toString()).toBe('21010202');
    });

    test('shift - zero hours', () => {
        const timeKey = TimeKey.create(2021, 1, 2, 3);
        const shiftedTimeKey = timeKey.shift(0);
        expect(shiftedTimeKey.toString()).toBe('21010203');
    });

});

describe('SortKey', () => {
    test('new / toString', () => {
        const trueKey = SortKey.create('TRUE');
        const predKey = SortKey.create('PRED', 'KMA', 'U3');
        const scoreKey = SortKey.create('SCORE', 'WDY');
        expect(trueKey.toString()).toBe('TRUE');
        expect(predKey.toString()).toBe('PRED#KMA.U3');
        expect(scoreKey.toString()).toBe('SCORE#WDY');
    });

    test('new - wrong format', () => {
        expect(() => SortKey.create('TRUE', 'KMA')).toThrow();
        expect(() => SortKey.create('PRED')).toThrow();
        expect(() => SortKey.create('PRED', 'KMA')).toThrow();
        expect(() => SortKey.create('PRED', 'KMA', 'U3', 'Extra')).toThrow();
        expect(() => SortKey.create('SCORE')).toThrow();
        expect(() => SortKey.create('SCORE', 'WDY', 'Extra')).toThrow();
        expect(() => SortKey.create('INVALID')).toThrow();
    });
});