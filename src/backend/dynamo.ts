import assert from "assert";

import { TimeKey, SortKey, RegionWeather } from "./weather";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { getConfig } from "./config";

function compilePutItem(timeKey: TimeKey, sortKey: SortKey, regionWeather: RegionWeather) {
    return {
        TableName: getConfig("AWS", "dynamo-table-name"),
        Item: {
            timekey: {
                S: timeKey.toString(),
            },
            sortkey: {
                S: sortKey.toString(),
            },
            weather: {
                S: regionWeather.toJSON(),
            },
        },
    };
}

function compileSearchExactItem(timeKey: TimeKey, sortKey: SortKey) {
    return {
        TableName: getConfig("AWS", "dynamo-table-name"),
        Key: {
            timekey: {
                S: timeKey.toString(),
            },
            sortkey: {
                S: sortKey.toString(),
            },
        },
    };
}

export class WeatherDB {
    private static dynamo: DynamoDB | null = null;

    static connect(): void {
        if (WeatherDB.dynamo !== null) return;

        WeatherDB.dynamo = new DynamoDB({
            region: getConfig("AWS", "region"),
        });
    }

    static async add(timeKey: TimeKey, sortKey: SortKey, regionWeather: RegionWeather): Promise<boolean> {
        WeatherDB.connect();
        try {
            assert(WeatherDB.dynamo !== null);
            await WeatherDB.dynamo.putItem(compilePutItem(timeKey, sortKey, regionWeather));
            return true;
        } catch (_) {
            return false;
        }
    }

    static async search(timeKey: TimeKey, sortKey: SortKey): Promise<RegionWeather | null> {
        WeatherDB.connect();
        assert(sortKey.isComplete());

        try {
            assert(WeatherDB.dynamo !== null);
            const response = await WeatherDB.dynamo.getItem(compileSearchExactItem(timeKey, sortKey));

            if (!response) throw new Error(`DynamoDB Error: No response (PK: ${timeKey}, SK: ${sortKey})`);

            if (!response.Item) return null;

            if (!response.Item.weather || !response.Item.weather.S)
                throw new Error(`Found entry does not have weather data although key exists (PK: ${timeKey}, SK: ${sortKey})`);

            return RegionWeather.fromJSON(response.Item.weather.S);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // static async searchRange(timeKey: TimeKey, sortKey: SortKey): Promise<RegionWeather[]> {
    //     WeatherDB.connect();
    //     assert(!sortKey.isComplete());
    // }

    static async remove(timeKey: TimeKey, sortKey: SortKey): Promise<boolean> {
        WeatherDB.connect();
        try {
            assert(WeatherDB.dynamo !== null);
            let compiledOption = compileSearchExactItem(timeKey, sortKey);
            (compiledOption as any).ConditionExpression = "attribute_exists(timekey) and attribute_exists(sortkey)";
            await WeatherDB.dynamo.deleteItem(compiledOption);
            return true;
        } catch (e: Error | unknown) {
            if(e instanceof Error && e.name === "ConditionalCheckFailedException")
                return false;

            throw Error(`Failed to remove item from DynamoDB (PK: ${timeKey}, SK: ${sortKey})`);
        }
    }
}
