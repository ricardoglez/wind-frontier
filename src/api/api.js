const API_KEY = 'd4ddc2d1d8f55c051e0081042cbda343';

import { interpret } from 'xstate';
import {stateMachine} from '../utils/stateMachine';

let machineService = interpret(stateMachine);


const getWeatherData = async (coords) => {
  // const city = 'Ciudad de Mexico';
  const basePath = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.long}&appid=${API_KEY}`;
  const result =  await fetch(basePath,{method: 'GET'} );
  const json = result.json()
  return json
};

const getLatLong = async () => {
  machineService.send('GET_POS');
  const pos = await new Promise((res, rej) => {
    const success = (data) => {
      res(data)
    };
    const error = (err) => {
      // TODO Add a flow to use a different location that your current 
      console.error('Geolocation Error',err);
      rej(err);
    };
    if(!navigator.geolocation) {
      console.error('geoLocation is not available in this browser');
      rej(new Error('Geolocationis not supported'))
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  });
  console.log('Coords results', pos.coords);
  const coords = {
    long: pos.coords.longitude,
    lat: pos.coords.latitude,
  };

  return coords;
}

export {getLatLong, getWeatherData};