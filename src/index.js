import p5 from 'p5';
import {sketch} from './sketch.js';

const init = () => {
   const sK =  new p5(sketch);
   console.log(sK, 'p5Canvas');
};


init();
