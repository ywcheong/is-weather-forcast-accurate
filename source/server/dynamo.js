class DynamoDB {
    constructor() {
        
    }
}

const { Inspector } = require("aws-sdk");

const SECOND_TO_TIMESTAMP = 1000;
const MINUTE_TO_TIMESTAMP = 60 * SECOND_TO_TIMESTAMP;
const HOUR_TO_TIMESTAMP = 60 * MINUTE_TO_TIMESTAMP;

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
        if(year < 0 || month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23) {
            throw new Error('Invalid time format');
        }

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

class SortKey {
    static create(type, ){

    }

    constructor() {

    }

    toString() {

    }
}

class WeatherDataUnit {
    constructor() {
        this.weatherList = {};
    }

    insert(location, weatherData){
        this.weatherList[location] = weatherData;
    }
}

module.exports = { TimeKey, SortKey, WeatherDataUnit, DynamoDB };