import { getConfig } from './config';

describe('getConfig', () => {
    
    it('should return the value of the option', () => {
        const actual = getConfig('secret', 'api-key-file');
        expect(actual).toBe('secret/example-api-key.toml');
    });

    it('should throw error if option is not found', () => {
        expect(() => getConfig('it is', 'impossible')).toThrow("Cannot find key of ('it is', 'impossible')");
    });

});