/**
 * Parses a continuous Julian date into its integer date part and fractional time-of-day part.
 *
 * A Julian date is a continuous count of days since noon Universal Time on January 1, 4713 BC.
 * The integer portion identifies the day; the fractional portion identifies the time elapsed since noon.
 * Splitting the two lets consumers perform independent date and sub-day arithmetic.
 *
 * This implementation works on any finite non-negative number, which is the full range
 * of well-formed Julian dates in common astronomical use. Negative Julian dates (before 4713 BC)
 * are rejected by design; supporting them would require a two-floor convention that
 * invites off-by-one errors at the Julian epoch, and we decline that complexity.
 *
 * @param {number} jd - Julian date as a finite, non-negative float.
 * @returns {{julianDay: number, fractionOfDay: number}}
 *   julianDay is an integer count of days; fractionOfDay is in [0, 1).
 * @throws {Error} If jd is non-finite, negative, or not a number.
 */
export function parseJulianDateFraction(jd) {
    if (typeof jd !== 'number' || Number.isNaN(jd)) {
        throw new Error('Julian date must be a number');
    }
    if (!Number.isFinite(jd)) {
        throw new Error('Julian date must be finite');
    }
    if (jd < 0) {
        throw new Error('Julian date must be non-negative');
    }

    // Math.floor gives a clean split so that fractionOfDay is always in [0, 1),
    // even when jd has no fractional part (e.g., 2451545.0 → 2451545 and 0).
    const julianDay = Math.floor(jd);
    const fractionOfDay = jd - julianDay;

    return { julianDay, fractionOfDay };
}

/**
 * Converts a Julian date into the fraction of a day elapsed since noon UT.
 *
 * Convenience wrapper for parseJulianDateFraction that returns only the fractional part.
 * Useful when only the time-of-day component is needed.
 *
 * @param {number} jd - Julian date as a finite, non-negative float.
 * @returns {number} Fraction of a day in [0, 1).
 * @throws {Error} If jd is non-finite, negative, or not a number.
 */
export function extractFraction(jd) {
    return parseJulianDateFraction(jd).fractionOfDay;
}

/**
 * Reconstructs a full Julian date from an integer day and a fractional day.
 *
 * Inverse of parseJulianDateFraction. The fraction is clamped to [0, 1) so
 * that composing split → recombine is idempotent for any valid input.
 *
 * @param {number} julianDay - Integer day count; must be a non-negative integer.
 * @param {number} fractionOfDay - Fraction of a day; clamped to [0, 1) if out of range.
 * @returns {number} The combined Julian date.
 * @throws {Error} If julianDay is negative, non-integer, or non-finite.
 */
export function combineJulianDate(julianDay, fractionOfDay) {
    if (typeof julianDay !== 'number' || Number.isNaN(julianDay)) {
        throw new Error('julianDay must be a number');
    }
    if (!Number.isFinite(julianDay)) {
        throw new Error('julianDay must be finite');
    }
    if (julianDay < 0) {
        throw new Error('julianDay must be non-negative');
    }
    if (!Number.isInteger(julianDay)) {
        throw new Error('julianDay must be an integer');
    }
    if (typeof fractionOfDay !== 'number' || Number.isNaN(fractionOfDay)) {
        throw new Error('fractionOfDay must be a number');
    }
    if (!Number.isFinite(fractionOfDay)) {
        throw new Error('fractionOfDay must be finite');
    }

    if (fractionOfDay < 0 || fractionOfDay >= 1) {
        throw new Error('fractionOfDay must be in [0, 1)');
    }

    return julianDay + fractionOfDay;
}
