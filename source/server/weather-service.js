class WeatherService {
    constructor(serviceName){
        this.serviceName = name;
    }

    get_weather(timeKey, location){
        throw new Error('WeatherService is an abstract class. Implement the get_weather method in a subclass.');
    }

}

class KMAWeatherService extends WeatherService {
    constructor(){
        super('KMAWeatherService');
    }
}