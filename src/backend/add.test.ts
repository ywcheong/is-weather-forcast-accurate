import { add_two } from './add';

test('Adding two positive numbers', () => {
    expect(add_two(2, 3)).toBe(5);
});

test('Adding two negative numbers', () => {
    expect(add_two(-5, -7)).toBe(-12);
});

test('Adding a positive and a negative number', () => {
    expect(add_two(10, -5)).toBe(5);
});

test('Adding zero to a number', () => {
    expect(add_two(8, 0)).toBe(8);
});

test('Adding two decimal numbers', () => {
    expect(add_two(1.5, 2.3)).toBeCloseTo(3.8);
});