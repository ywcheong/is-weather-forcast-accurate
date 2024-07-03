const assert = require('assert');

const SECOND_TO_TIMESTAMP = 1000;
const MINUTE_TO_TIMESTAMP = 60 * SECOND_TO_TIMESTAMP;
const HOUR_TO_TIMESTAMP = 60 * MINUTE_TO_TIMESTAMP;

/**
 * Represents a DynamoDB instance.
 */
class DynamoDB {
    constructor() {
        
    }
}

/**
 * Represents a TimeKey, which is a specific date and time.
 */
class TimeKey {
    /**
     * Creates a new TimeKey instance with the specified year, month, day, and hour.
     * @param {number} year - The year (YYYY).
     * @param {number} month - The month (1-12).
     * @param {number} day - The day of the month (1-31).
     * @param {number} hour - The hour of the day (24-hour format, two-digit).
     * @returns {TimeKey} A new TimeKey instance.
     */
    static create(year, month, day, hour) {
        assert(2000 <= year && year <= 2099, 'Year must be between 2000 and 2099');
        assert(1 <= month && month <= 12, 'Month must be between 1 and 12');
        assert(1 <= day && day <= 31, 'Day must be between 1 and 31');
        assert(0 <= hour && hour <= 23, 'Hour must be between 0 and 23');

        const keyDate = new Date(year, month - 1, day, hour);
        return new TimeKey(keyDate);
    }

    /**
     * **DO NOT USE THIS CONSTRUCTOR DIRECTLY.**
     * Use the `TimeKey.new` method instead.
     * @param {Date} keyDate - The date and time represented by the TimeKey.
     */
    constructor(keyDate) {
        this.date = keyDate;
    }

    /**
     * Returns a string representation of the TimeKey.
     * @returns {string} The string representation of the TimeKey.
     * @example
     * const timeKey = TimeKey.create(2021, 1, 2, 3);
     * console.log(timeKey.toString()); // 21010203
     */
    toString() {
        const pad = (num) => num.toString().padStart(2, '0');

        const YY = this.date.getFullYear().toString().slice(-2);
        const MM = pad(this.date.getMonth() + 1);
        const DD = pad(this.date.getDate());
        const HH = pad(this.date.getHours());

        return `${YY}${MM}${DD}${HH}`;
    }

    /**
     * Shifts the TimeKey by the specified number of hours.
     * @param {number} hours - The number of hours to shift the TimeKey.
     * @returns {TimeKey} A new TimeKey instance representing the shifted time.
     */
    shift(hours) {
        const newKeyDate = new Date(this.date.getTime() + hours * HOUR_TO_TIMESTAMP);
        return new TimeKey(newKeyDate);
    }
}

/**
 * Represents a SortKey, which is used for sorting weather data.
 */
class SortKey {
    /**
     * Creates a new SortKey instance with the specified type and subkey.
     * @param {string} type - The type of the SortKey.
     * @param {string[]} subkey - The subkey list of the SortKey.
     * @returns {SortKey} A new SortKey instance.
     */
    static create(type, ...subkey){
        if(type === 'TRUE'){
            assert(subkey.length === 0, `Invalid subkey: ${subkey}. Must be empty for TRUE type`);
        }else if(type == 'PRED'){
            assert(subkey.length === 2, `Invalid subkey: ${subkey}. Must have length 2 for PRED type`);
        }else if(type == 'SCORE'){
            assert(subkey.length === 1, `Invalid subkey: ${subkey}. Must have length 2 for SCORE type`);
        }else{
            throw new Error(`Invalid type: ${type} for SortKey. Must be one of 'TRUE', 'PRED', 'SCORE'`);
        }

        return new SortKey(type, subkey);
    }

    constructor(type, subkey) {
        this.type = type;
        this.subkey = subkey;
    }

    /**
     * Returns a string representation of the SortKey.
     * @returns {string} The string representation of the SortKey.
     */
    toString() {
        if(this.subkey.length === 0)
            return `${this.type}`;

        return `${this.type}#${this.subkey.join('.')}`;
    }
}

module.exports = { TimeKey, SortKey, DynamoDB };