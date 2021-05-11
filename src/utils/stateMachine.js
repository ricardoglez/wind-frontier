import { createMachine, assign } from 'xstate';

export const stateMachine = createMachine({
  id:'stateMachine',
  initial: 'inactive',
  context: {
    coords: null,
    weatherData: null,
    dataReady: false,
    coordsReady: false
  }, 
  states: {
    inactive: {
      on: {
        SET_COORDS: {
          actions: assign({
            coords: ( context, event) => { return {lat: event.lat, long: event.long}},
            coordsReady: true
          })
        },
        SET_WEATHER_DATA:{
          actions: assign({
            weatherData: (context, event) => {console.log('WD',event); return event.weatherData},
            dataReady: true
          })
        }
      }
    },
  }
});