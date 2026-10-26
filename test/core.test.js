import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseJulianDateFraction, extractFraction, combineJulianDate } from '../src/index.js';

test('parseJulianDateFraction splits integer-valued Julian date', () => {
    const result = parseJulianDateFraction(2451545.0);
    assert.equal(result.julianDay, 2451545);
    assert.equal(result.fractionOfDay, 0);
});

test('parseJulianDateFraction splits Julian date with midday fraction', () => {
    const result = parseJulianDateFraction(2451545.5);
    assert.equal(result.julianDay, 2451545);
    assert.equal(result.fractionOfDay, 0.5);
});

test('parseJulianDateFraction splits Julian date with quarter-day fraction', () => {
    const result = parseJulianDateFraction(2451545.25);
    assert.equal(result.julianDay, 2451545);
    assert.ok(Math.abs(result.fractionOfDay - 0.25) < 1e-9);
});

test('parseJulianDateFraction splits whole + fractional values consistently', () => {
    const result = parseJulianDateFraction(2459000.75);
    assert.equal(result.julianDay, 2459000);
    assert.ok(Math.abs(result.fractionOfDay - 0.75) < 1e-9);
});

test('parseJulianDateFraction keeps fraction in [0, 1) for small fractional input', () => {
    const result = parseJulianDateFraction(0.25);
    assert.equal(result.julianDay, 0);
    assert.equal(result.fractionOfDay, 0.25);
});

test('parseJulianDateFraction rejects NaN', () => {
    assert.throws(() => parseJulianDateFraction(NaN), { message: /must be a number/ });
});

test('parseJulianDateFraction rejects Infinity', () => {
    assert.throws(() => parseJulianDateFraction(Infinity), { message: /must be finite/ });
});

test('parseJulianDateFraction rejects negative values', () => {
    assert.throws(() => parseJulianDateFraction(-1), { message: /non-negative/ });
});

test('extractFraction returns only the fractional part', () => {
    assert.ok(Math.abs(extractFraction(2451545.25) - 0.25) < 1e-9);
});

test('combineJulianDate reconstructs a Julian date from parts', () => {
    const result = combineJulianDate(2451545, 0.5);
    assert.ok(Math.abs(result - 2451545.5) < 1e-9);
});

test('combineJulianDate rejects non-integer julianDay', () => {
    assert.throws(() => combineJulianDate(2451545.5, 0.5), { message: /must be an integer/ });
});

test('combineJulianDate rejects out-of-range fraction', () => {
    assert.throws(() => combineJulianDate(2451545, 1.0), { message: /\[0, 1\)/ });
    assert.throws(() => combineJulianDate(2451545, -0.1), { message: /\[0, 1\)/ });
});

test('round-trip through split and combine is consistent', () => {
    const original = 2459000.75;
    const { julianDay, fractionOfDay } = parseJulianDateFraction(original);
    const reconstructed = combineJulianDate(julianDay, fractionOfDay);
    assert.ok(Math.abs(reconstructed - original) < 1e-9);
});
