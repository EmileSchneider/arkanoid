var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

class Ball {
  constructor() {
    this.x = canvas.height / 2;
    this.y = canvas.width / 2;
    this.v = [10,10];
    this.radius = 5;
  }
  render(){
    ctx.beginPath();
    ctx.fillStyle = "#00FF00";
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fill();
  }
  move(paddle){
    this.x = this.x + this.v[0];
    this.y = this.y +this.v[1];

    var checkTopOrBottom = (function(){
      if(this.y >= canvas.height){
        this.v[1] = -5;
      }
      if(this.y <= 0){
        this.v[1] = 5
      }
    }).bind(this);
    var checkLeftOrRight = (function(){
      if(this.x >= canvas.width){
        this.v[0] = -5;
      }
      if(this.x <= 0){
        this.v[0] = 5;
      }
    }).bind(this);
    var checkIfIsOnPaddle = (function(){
      if(this.y == paddle.y && this.x > paddle.x && this.x < (paddle.x + paddle.width)){
        this.v[1] = -5;
      }
    }).bind(this);

    checkIfIsOnPaddle();
    checkLeftOrRight();
    checkTopOrBottom();
  }
}

class Game {
  constructor(ball, paddle, brickwall) {
    this.brickwall = brickwall;
    this.ball = ball;
    this.paddle = paddle;
    this.brickwall.buildWall();
  }
  clearCanvas(){
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,canvas.clientWidth, canvas.clientHeight);
  }
  play(){
    setInterval( ()=>{
      this.clearCanvas();
      this.ball.move(this.paddle);
      this.ball.render();
      this.brickwall.checkBricks();
      this.brickwall.renderWall();
      this.paddle.render();
    }, 16);
  }
}

class Paddle {
  constructor() {
    this.x = 700;
    this.y = 700;
    this.width = 100;
    this.height = 25;
    document.addEventListener("keypress", this.move.bind(this));
  }
  move(e){
    if(e.keyCode == 97){
      if(this.x > 0){
        this.x = this.x - 25;
      }
    }
    if(e.keyCode == 100){
      if(this.x < canvas.width){
        this.x = this.x+45;
      }
    }
  }
  render(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(this.x,this.y,this.width,this.height);
  }
}

class Brick {
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 25;
    this.notDraw = false;
  }
  getRandomColor() {
      var letters = "0123456789ABCDEF";
      var colour = "#";
      for (var i = 0; i < 6; i++) {
        colour += letters[Math.floor(Math.random() * 16)];
      }
      return colour;
   }
  render(){
    if(!this.notDraw){
      ctx.fillStyle = this.getRandomColor();
      ctx.fillRect(this.x,this.y,this.width, this.height);
    }

  }
}

class BrickWall{
  constructor(n, ball){
    this.numberOfBricks = n;
    this.bricks = [];
    this.ball = ball;
  }
  buildWall(){
    for(var i = 0; i < 5; i++){
      for(var j = 0; j < 5; j++){
        this.bricks.push(new Brick((50+50*j+100*j),50+i*50));
      }
    }
  }
  checkBricks(){
    this.bricks.forEach(function(item){
      // checks if the ball is comming from above the brick
      if(this.ball.x > item.x && this.ball.x < item.x + item.width && this.ball.y > item.y && this.ball.y < item.y + item.height){
        this.ball.v[1] = -5;
        this.bricks.notDraw = true;
      }
      //checks if the this.ball is coming from below the brick
      if(this.ball.x > item.x && this.ball.x < item.x + item.width && this.ball.y < item.y + item.height){
        this.ball.v[1] = 5;
        this.bricks.notDraw = true;
      }
      //checks if ball is coming
      if(this.ball.x > item.x && this.ball.x < item.x+item.width && this.ball.y > item.y && this.ball.y < item.y+item.height){
        this.ball.v[0] = 5;
        this.bricks.notDraw = true;
      }
      if(this.ball.x < item.x+item.width && this.ball.y > item.y && this.ball.y < item.y+item.height){
        this.ball.v[0] = 5;
        this.bricks.notDraw = true;
      }
    }.bind(this));
  }
  renderWall(){
    var x =  this.ball;
    this.bricks.forEach(function(item){
      item.render();
    });
  }
}

// var startGame = function () {
  var spielball = new Ball();
  var paddle = new Paddle()
  var trump = new BrickWall(10, spielball);
  var spiel = new Game(spielball, paddle, trump)
  spiel.play();
// }
