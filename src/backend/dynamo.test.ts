import { TimeKey, SortKey, RegionWeather } from "./weather";
import { WeatherDB } from "./dynamo";

describe("WeatherDB test", () => {
    const testTimeKey = TimeKey.create(1910, 12, 31, 23);
    
    const testSortKeyT1 = SortKey.create("score", "test1");
    const testWeatherT1 = RegionWeather.create("test-region", {
        sky: "cloud",
        precip: 11,
        temp: 11,
        wind: 11,
        humid: 11,
    });

    const testSortKeyT2 = SortKey.create("score", "test2");
    const testWeatherT2 = RegionWeather.create("test-region", {
        sky: "cloud",
        precip: 22,
        temp: 22,
        wind: 22,
        humid: 22,
    });

    const testSortKeyT3 = SortKey.create("score", "test3");
    const testWeatherT3 = RegionWeather.create("test-region", {
        sky: "cloud",
        precip: 33,
        temp: 33,
        wind: 33,
        humid: 33,
    });

    it("should insert item", async () => {
        const result1 = await WeatherDB.add(testTimeKey, testSortKeyT1, testWeatherT1);
        expect(result1).toBe(true);

        const result2 = await WeatherDB.add(testTimeKey, testSortKeyT2, testWeatherT2);
        expect(result1).toBe(true);

        const result3 = await WeatherDB.add(testTimeKey, testSortKeyT3, testWeatherT3);
        expect(result1).toBe(true);

        const wrongKey = {toString(){return "";}} as TimeKey;
        const result4 = await WeatherDB.add(wrongKey, testSortKeyT3, testWeatherT3);
        expect(result4).toBe(false);
    });

    it("should get item with (PK, SK)", async () => {
        const result1 = await WeatherDB.search(testTimeKey, testSortKeyT1);
        expect(result1).toStrictEqual(testWeatherT1);

        const result2 = await WeatherDB.search(testTimeKey, testSortKeyT2);
        expect(result2).toStrictEqual(testWeatherT2);

        const result3 = await WeatherDB.search(testTimeKey, testSortKeyT3);
        expect(result3).toStrictEqual(testWeatherT3);

        const nonexistingTimeKey = TimeKey.create(9999, 1, 1, 1);
        const resultNotFound = await WeatherDB.search(nonexistingTimeKey, testSortKeyT3);
        expect(resultNotFound).toStrictEqual(null);
    });

    it("should throw on wrong response or empty weather section", async () => { 
        const backupDynamo = (WeatherDB as any).dynamo;

        // void response
        (WeatherDB as any).dynamo = {getItem(x: any){
            return null;
        }};

        expect(WeatherDB.search(testTimeKey, testSortKeyT1)).rejects.toThrow();

        // No weather
        (WeatherDB as any).dynamo = {getItem(x: any){
            return {Item: "aaa"};
        }};
        expect(WeatherDB.search(testTimeKey, testSortKeyT1)).rejects.toThrow();

        // No weather
        (WeatherDB as any).dynamo = {getItem(x: any){
            return {Item: {weather: "a"}};
        }};
        expect(WeatherDB.search(testTimeKey, testSortKeyT1)).rejects.toThrow();

        (WeatherDB as any).dynamo = backupDynamo;
    });

    it("should delete item", async () => {
        const result1 = await WeatherDB.remove(testTimeKey, testSortKeyT1);
        expect(result1).toBe(true);

        const result2 = await WeatherDB.remove(testTimeKey, testSortKeyT2);
        expect(result1).toBe(true);

        const result3 = await WeatherDB.remove(testTimeKey, testSortKeyT3);
        expect(result1).toBe(true);

        const wrongKey = {toString(){return "what-not-exist";}} as TimeKey;
        const result4 = await WeatherDB.remove(wrongKey, testSortKeyT3);
        expect(result4).toBe(false);

        const backupDynamo = (WeatherDB as any).dynamo;
        (WeatherDB as any).dynamo = {deleteItem(x: any){
            throw Error("what the hell");
        }};
        expect(WeatherDB.remove(testTimeKey, testSortKeyT1)).rejects.toThrow();
        (WeatherDB as any).dynamo = backupDynamo;
    });
});
