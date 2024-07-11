import { TimeKey, SortKey, RegionWeather } from "./weather";

describe("TimeKey", () => {
    it("should make a string well", () => {
        const timeKey = TimeKey.create(2021, 1, 2, 3);
        expect(timeKey.toString()).toBe("21010203");
    });

    it("should not make invalid timekey", () => {
        expect(() => TimeKey.create(2021, 13, 2, 3)).toThrow();
        expect(() => TimeKey.create(2021, 1, 32, 3)).toThrow();
        expect(() => TimeKey.create(2021, 1, 2, 24)).toThrow();
    });

    it("should shift positive hours", () => {
        const timeKey = TimeKey.create(2021, 1, 2, 3);
        const shiftedTimeKey = timeKey.shift(100);
        expect(shiftedTimeKey.toString()).toBe("21010607");
    });

    it("should shift negative hours", () => {
        const timeKey = TimeKey.create(2021, 1, 2, 3);
        const shiftedTimeKey = timeKey.shift(-1);
        expect(shiftedTimeKey.toString()).toBe("21010202");
    });

    it("should shift zero hours", () => {
        const timeKey = TimeKey.create(2021, 1, 2, 3);
        const shiftedTimeKey = timeKey.shift(0);
        expect(shiftedTimeKey.toString()).toBe("21010203");
    });
});

describe("SortKey", () => {
    test("should make a string well", () => {
        const trueKey = SortKey.create("true");
        expect(trueKey.toString()).toBe("true");

        const scoreKey = SortKey.create("score", "WDY");
        expect(scoreKey.toString()).toBe("score#WDY");

        const predKey = SortKey.create("pred", "KMA", 3);
        expect(predKey.toString()).toBe("pred#KMA.U3");

        expect(() => SortKey.create("wrong" as any)).toThrow();
        expect(() => SortKey.create("pred", null as any, 3)).toThrow();
    });

    test("should not make a string with incomplete key", () => {
        expect(() => SortKey.create("pred", "KMA").toString()).toThrow();
    });

    test("should decide if key is complete", () => {
        expect(SortKey.create("true").isComplete()).toBe(true);

        expect(SortKey.create("score").isComplete()).toBe(false);
        expect(SortKey.create("score", "KMA").isComplete()).toBe(true);

        expect(SortKey.create("pred").isComplete()).toBe(false);
        expect(SortKey.create("pred", "KMA").isComplete()).toBe(false);
        expect(SortKey.create("pred", "KMA", 3).isComplete()).toBe(true);

        expect(
            new SortKey(null as any, null as any, null as any).isComplete()
        ).toBe(false);
    });
});

describe("RegionWeather", () => {
    it("should create using the create method", () => {
        const regionWeather = RegionWeather.create("Region2", {
            temperature: 30,
            humidity: 70,
        });
        expect(regionWeather.getRegion()).toBe("Region2");
        expect(regionWeather.getData()).toEqual({
            temperature: 30,
            humidity: 70,
        });
    });

    it("should not create with null value", () => {
        expect(() => RegionWeather.create("Region5", null)).toThrow();
        expect(() =>
            RegionWeather.create(null as any, { temperature: 30, humidity: 70 })
        ).toThrow();
    });

    it("should create from JSON", () => {
        const json =
            '{"region":"Region3","data":{"temperature":20,"humidity":90}}';
        const regionWeather = RegionWeather.fromJSON(json);
        expect(regionWeather.getRegion()).toBe("Region3");
        expect(regionWeather.getData()).toEqual({
            temperature: 20,
            humidity: 90,
        });
    });

    it("should convert to JSON", () => {
        const regionWeather = new RegionWeather("Region4", {
            temperature: 15,
            humidity: 95,
        });
        const json = regionWeather.toJSON();
        expect(json).toBe(
            '{"region":"Region4","data":{"temperature":15,"humidity":95}}'
        );
    });
});
