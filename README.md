# julian-date-fraction-parser

Splits a continuous Julian date float into an integer day count and a fractional time-of-day, and recombines them. Built for astronomical timestamp arithmetic where date and sub-day components are handled independently.

```js
import { parseJulianDateFraction, extractFraction, combineJulianDate } from 'julian-date-fraction-parser';

const { julianDay, fractionOfDay } = parseJulianDateFraction(2451545.5);
// julianDay === 2451545, fractionOfDay === 0.5

const justTime = extractFraction(2451545.25); // 0.25

const jd = combineJulianDate(2451545, 0.5); // 2451545.5
```

## Why this exists

Julian dates are a continuous float: the integer part is the day, the fractional part is the time elapsed since noon UT. Astronomical code often needs to manipulate these separately — add a day, shift the time-of-day, then recombine — without pulling in a full date library. This library does exactly that split and join, nothing more.

The trade-off: we only support non-negative Julian dates. Negative Julian dates (before 4713 BC, the Julian epoch) would require a convention where flooring behaves differently around the epoch boundary, and that off-by-one risk isn't worth it for the common case.

## Edge cases

- Input must be a finite, non-negative number. `NaN`, `Infinity`, and negative values throw.
- The fractional part is always returned in `[0, 1)` via `Math.floor`, so a whole-number Julian date yields a fraction of exactly `0`.
- `combineJulianDate` requires `fractionOfDay` to be in `[0, 1)`; it rejects values outside that range rather than silently wrapping.
