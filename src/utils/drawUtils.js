function Spring2D(xpos, ypos,gap, weatherData, p) {
  this.x = xpos;// The x- and y-coordinates
  this.y = ypos;
  this.leftX = xpos-gap/2;
  this.leftTopY = (ypos-gap/2);
  this.leftBottomY = ( ypos+gap/2);
  this.rightX = (xpos+gap/2);
  this.rightTopY = (ypos-gap/2) ;
  this.rightBottomY = ( ypos+gap/2) ;
  this.vx = 0; // The x- and y-axis velocities
  this.vy = 0;
  this.mass = weatherData.main.pressure;
  this.windDeg = weatherData.wind.deg;
  this.windSpeed = weatherData.wind.speed;
  this.gravity = 9.0;
  this.radius = 30;
  this.stiffness = 300;
  this.damping = 0.7;

  this.update = function(targetX, targetY) {
    let forceX = (targetX - this.x) * this.stiffness;
    let ax = forceX / this.mass;
    this.vx = this.damping * (this.vx + ax);
    this.rigthX += this.vx;
    this.rightTopY += this.vx * this.vy / 10;
    let forceY = (targetY - this.leftTopY) * this.stiffness;
    forceY += this.gravity;
    let ay = forceY / this.mass;
    this.vy = this.damping * (this.vy + ay);
    this.leftX += this.vy;
    this.rotate = this.windDeg;
    this.windSpeed = this.windSpeed*(ax/100);
  }

  this.display = function() {
    // p.fill(10,10,10,5);
    p.stroke(0,0,0,50);
    p.strokeWeight(p.map(this.windSpeed, 0 ,30, 10 ,40 ));
    let steps = 30;
    p.rotate(this.rotate)
    p.bezier(this.leftX, this.leftTopY, this.rightX, this.rightTopY ,this.leftX, this.leftBottomY, this.rightX, this.rightBottomY);
    // for( let i = 0; i <= steps; i++) {
    //   let x = p.bezierPoint(this.leftX+=this.windSpeed, this.rightX, this.leftX, this.rightX, i/steps);
    //   let y = p.bezierPoint(this.leftTopY, this.rightTopY, this.leftBottomY, this.rightBottomY, i/steps);
    //   p.circle(x, y , i/2);
    // } 
  }
}

export {Spring2D};