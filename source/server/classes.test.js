const { TimeKey } = require('./classes');

describe('TimeKey', () => {
    test('new / toString', () => {
        const timeKey = TimeKey.create(2021, 1, 2, 3);
        expect(timeKey.toString()).toBe('21010203');
    });

    test('new - wrong format', () => {
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