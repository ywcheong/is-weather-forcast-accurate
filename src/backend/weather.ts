import assert from "assert";
import { stringify } from "querystring";

/**
 * Represents a time key for a specific date and hour.
 */
export class TimeKey {
    date: Date;

    constructor(date: Date) {
        this.date = date;
    }

    /**
     * Creates a new instance of the TimeKey class.
     * @param year - The year of the date. (4-digit)
     * @param month - The month of the date (1-12 format).
     * @param day - The day of the date. (1-31 format)
     * @param hour - The hour of the time. (0-23 format)
     */
    static create(year: number, month: number, day: number, hour: number) {
        assert(0 <= year && year <= 9999, "Year must be between 0 and 9999.");
        assert(1 <= month && month <= 12, "Month must be between 1 and 12.");
        assert(1 <= day && day <= 31, "Day must be between 1 and 31.");
        assert(0 <= hour && hour <= 23, "Hour must be between 0 and 23.");

        const date = new Date(year, month - 1, day, hour);
        return new TimeKey(date);
    }

    shift(hours: number): TimeKey {
        const newDate = new Date(this.date);
        newDate.setHours(newDate.getHours() + hours);
        return new TimeKey(newDate);
    }

    toString() {
        const pad = (num: number) => num.toString().padStart(2, "0");

        const YY = this.date.getFullYear().toString().slice(-2);
        const MM = pad(this.date.getMonth() + 1);
        const DD = pad(this.date.getDate());
        const HH = pad(this.date.getHours());

        return `${YY}${MM}${DD}${HH}`;
    }
}

/**
 * true             (keytype)
 * score#WDY        (keytype, institute)
 * pred#KMA.U3      (keytype, institute, timeframe)
 */
type SortKeyType = "true" | "pred" | "score";

// SortKeyType validity
function isSortKeyType(keyType: string): keyType is SortKeyType {
    return keyType === "true" || keyType === "pred" || keyType === "score";
}

export class SortKey {
    keytype: string;
    institute: string | null;
    timeframe: number | null;

    constructor(keyType: SortKeyType, institute: string | null, timeframe: number | null) {
        this.keytype = keyType;
        this.institute = institute;
        this.timeframe = timeframe;
    }

    static create(keyType: SortKeyType, institute: string | null = null, timeframe: number | null = null) {
        // check keyType type validity
        if (!isSortKeyType(keyType)) {
            throw new Error("Invalid keyType");
        }

        // timeframe cannot set unless institution is set
        if (timeframe !== null && institute === null) {
            throw new Error("Timeframe cannot be set without institution");
        }

        return new SortKey(keyType, institute, timeframe);
    }

    isComplete(): boolean {
        if (this.keytype === "true") return true;

        if (this.keytype === "score") return this.institute !== null;

        if (this.keytype === "pred") return this.institute !== null && this.timeframe !== null;

        return false;
    }

    toString(): string {
        if (this.keytype === "true") {
            return "true";
        }

        if (this.keytype === "score") {
            if (this.institute === null) return `score`;
            return `score#${this.institute}`;
        }

        if (this.keytype === "pred") {
            if (this.institute === null) return `pred`;
            if (this.timeframe === null) return `pred#${this.institute}`;
            return `pred#${this.institute}.U${this.timeframe}`;
        }

        throw new Error("Impossible");
    }
}

export class RegionWeather {
    region: string;
    data: any;

    constructor(region: string, data: any) {
        this.region = region;
        this.data = data;
    }

    static create(region: string, data: any) {
        // check if region, data is null
        if (region === null || data === null) {
            throw new Error("Region and data cannot be null");
        }

        return new RegionWeather(region, data);
    }

    static fromJSON(json: string) {
        const obj = JSON.parse(json);
        return new RegionWeather(obj.region, obj.data);
    }

    getRegion(): string {
        return this.region;
    }

    getData(): any {
        return this.data;
    }

    toJSON() {
        return JSON.stringify({
            region: this.region,
            data: this.data,
        });
    }
}
