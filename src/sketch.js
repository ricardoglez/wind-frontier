import { interpret } from 'xstate';
import {getWeatherData, getLatLong } from './api/api';
import {stateMachine} from './utils/stateMachine';
import {CurlyShape, Spring2D } from './utils/drawUtils';
console.log(CurlyShape);

export const sketch =(p) => {
  let mainState = stateMachine.initialState;
  let machineService = null;
  let w = window.innerWidth;
  let h = window.innerHeight;
  let vector = null;
  const position = p.createVector(w/2, 0);
  // let w = 800;
  // let h = 400;

  p.setup = function() {
    machineService = interpret(stateMachine)
      .onTransition((state)=> {
        console.log('State transition Val', state.value);
      })
      .onSend((state) => {
        console.log('State send', state);
      }).start();
    p.textSize(20);
    const canvas = p.createCanvas(w , h);
    canvas.parent('p5Canvas');
    p.textAlign(p.CENTER, p.CENTER);
    p.rectMode(p.CENTER);
    p.frameRate(24)
  };

  const initialView = () => {
    console.log('¿Initial View')
    const textBox = {
      w: w/3, 
      h: h/2,
      x: w/2,
      y: h/2,
      content: 'This app uses location data to show the border of the country that are located.'
    };
    p.noFill()
    p.stroke('#fff');
    p.strokeWeight(2);
    p.rect(textBox.x, textBox.y, textBox.w, textBox.h,20 )
    p.fill('#fff')
    p.strokeWeight(.5);
    p.text(textBox.content, textBox.x, textBox.y, textBox.w, textBox.h);
  };

  const drawChain = (x, y, vector, childs) => {
    let chains = [];
    for(let chain = 0; chain <= childs; chain++){
      chains.push(new Spring2D( x, y*chain, 80, mainState.context.weatherData, p));
      
      chains[chain].update(position.x+p.map(p.mouseX, 0, 1000, 0,100), position.y+ p.map(p.mouseY, 0, 1000 , 0, 100));
      chains[chain].display(x, y);
    }
  };

  const drawBorder = () => {
    vector = p.createVector( mainState.context.weatherData.wind.speed, mainState.context.weatherData.wind.deg);
    for(let point = 20; point <= w-20; point += 42 ) {
      p.fill(255,255,255, 120);
      drawChain(point, 40, vector, 300);
    }
  };
  const drawUI = () => {
    console.log('drawUI', mainState);
    const name = mainState.context.weatherData && mainState.context.weatherData.name ? mainState.context.weatherData.name : 'Name';
    const vel = `${mainState.context.weatherData.wind.speed}km/h` ;
    const deg = `${mainState.context.weatherData.wind.deg}°` ;
    p.fill(0,0,0);
    p.text(name, w/2, 80 , w/6, 200);
    p.text(vel, w/2, 110 , w/6, 200);
    p.text(deg, w/2, 140 , w/6, 200);
  };

  p.draw = function() {
    p.background(255,255,255);
    const isDataReady = mainState.context.dataReady;
    const isCoordsReady = mainState.context.isCoordsReady;
    if ( !isCoordsReady && !isDataReady) {
      initialView();
    } else {
      drawUI();
      drawBorder();
    }
    
   
  };
  window.addEventListener('resize', () => {
    console.log('Resize to' , window.innerWidth-15);
    w = window.innerWidth-15;
    const canvas = p.createCanvas(w , 410);
    canvas.parent('p5Canvas');
  });

  window.onload = async () => {
    const coords = await getLatLong();
    mainState = machineService.send('SET_COORDS', coords);
    const weatherData = await getWeatherData(coords);
    mainState = machineService.send('SET_WEATHER_DATA', {weatherData});
  }
};