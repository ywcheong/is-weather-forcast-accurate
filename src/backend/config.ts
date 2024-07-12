import { readFileSync } from "fs";
import { resolve } from "path";

// @ts-ignore
import { parse } from "toml";

const configFileLocation = "../../config/config.toml"
const configFileAbsPath = resolve(__dirname, configFileLocation);

export function getConfig(section: string, key: string): string {
    try {
        const fileContent = readFileSync(configFileAbsPath, "utf-8");
        const config = parse(fileContent);

        if (config[section] && config[section][key])
            return config[section][key];
        
    } catch (error) {
        throw new Error(`Cannot read config file: ${error}`);
    }

    throw new Error(`Cannot find key of ('${section}', '${key}')`);
}