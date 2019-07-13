window.onload = function() {

	var canvas = document.getElementById("GamePanel");
	var ctx = canvas.getContext("2d");
	if (!canvas || !canvas.getContext) {
		document.write("<h1>Your browser doesn't support the HTML5 canvas. Please upgrade your browser.</h1>")
	}
	var W = window.innerWidth;
	var H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;
	var playersize = 5;
	var playerspeed = 1;
	var pastkeyhittime = 0;
	var time = 0;
	var player = {
		x:W/2-playersize/2,
		y:H-50,
		xchange:playersize * playerspeed,
		ychange:0,
		w:playersize,
		h:playersize
	}
	var start = true;
	var lost = false;
	function Obstacle(x,y,xchange,ychange) {
		this.x = x;
		this.y = y;
		this.xchange = xchange;
		this.ychange = ychange;
		this.w = 5;
		this.h = 5;
		this.style = "red";
		this.draw = function() {
			ctx.fillStyle = this.style;
			ctx.fillRect(this.x,this.y,this.w,this.h);
		}
		this.update = function() {
			this.x += this.xchange;
			this.y += this.ychange;
			if (this.x + this.w >= W || this.x <= 0) {
				this.xchange *= -1;
			}
			if (this.y + this.h >= H || this.y <= 0) {
				this.ychange *= -1;
			}
			if (Math.abs(this.x - player.x) < 10 && Math.abs(this.y - player.y) < 10) {
				lost = true;
			}
		}
	}
	var size = 5;
	var obstacles = [
		new Obstacle(0,0,size,size),
		new Obstacle(W-size,0,-size,size),
		new Obstacle(0,H-size,size,-size),
		new Obstacle(W-size,H-size,-size,-size),
		new Obstacle(W/2-size/2,0,0,size),
		new Obstacle(W/2-size/2,H-size,0,-size),
		new Obstacle(W/4-size/2,0,size,size),
		new Obstacle(W*3/4-size/2,0,-size,size),
		new Obstacle(W/4-size/2,H-size,size,-size),
		new Obstacle(W*3/4-size/2,H-size,-size,-size),
		new Obstacle(0,H/2-size/2,size,0),
		new Obstacle(W-size,H/2-size/2,-size,0),
		new Obstacle(0,H/4-size/2,size,size),
		new Obstacle(0,H*3/4-size/2,size,-size),
		new Obstacle(W-size,H/4-size/2,-size,size),
		new Obstacle(W-size,H*3/4-size/2,-size,-size),
		new Obstacle(W/2-size/2,H/2-size/2,-size,-size),
		new Obstacle(W/2-size/2,H/2-size/2,size,-size),
		new Obstacle(W/2-size/2,H/2-size/2,size,size),
		new Obstacle(W/2-size/2,H/2-size/2,-size,size)
	]
	function loop() {
		// Screen
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,W,H);
		if (start) {
			render(50,"Pixel",50,"black");
			render(130,"You are the blue pixel.",30,"green");
			render(210,"Use the WASD and ARROW keys to move.",30,"green");
			render(290,"Avoid the red pixels.",30,"green");
			render(370,"Click or press <SPACE> to play.",30,"green");
		}else if (lost) {
			render(50,"Good Try.",50,"black");
			render(130,"Score: "+Math.round(time/33).toString(),30,"green");
			render(210,"<SPACE> to play again.",30,"green");
		} else {
			++time;
			if (time - pastkeyhittime >= 99) {
				lost = true;
			}
			// Player
			player.x += player.xchange;
			player.y += player.ychange;
			if (player.x <= 0 || player.x + player.w >= W) { player.xchange *= -1; }
			if (player.y <= 0 || player.y + player.h >= H) { player.ychange *= -1; }
			ctx.fillStyle = "blue";
			ctx.fillRect(player.x,player.y,player.w,player.h)
			// Obstacles
			for (var i = 0; i < obstacles.length; i++) {
				obstacles[i].update();
				obstacles[i].draw();
			}
		}
	}
	window.onresize = function() {	
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;
	}
	window.onclick = function(event) { if (start) { start = false; } }
	window.onkeydown = function(event) {
		pastkeyhittime = time;
		switch (event.which) {
			case 87: // W
			case 38: // UP
				player.ychange = -player.h * playerspeed;
				break;
			case 83: // S
			case 40: // DOWN
				player.ychange = player.h * playerspeed;
				break;
			case 65: // A
			case 37: // LEFT
				player.xchange = -player.w * playerspeed;
				break;
			case 68: // D
			case 39: // RIGHT
				player.xchange = player.w * playerspeed;
				break;
			case 32: // SPACE
				if (start) { start = false; }
				if (lost) { window.location.reload(); }
				break;
			default:
				break;
		}
	}
	setInterval(loop,33);
	function ranRange(lower,upper) {
		return lower + Math.round((upper - lower) * Math.random());
	}
	function render(y,msg,size,color) {
		ctx.fillStyle = color;
		ctx.font = size.toString() + "px Noteworthy";
		var xDisplacement = Math.round(msg.length / 4) * size;
		ctx.fillText(msg,W/2 - xDisplacement,y);
	}
	function collision(object1,object2) {
		if (object1.x <= object2.x + object2.w  && object1.x + object1.w  >= object2.x &&
		object1.y <= object2.y + object2.h && object1.y + object1.h >= object2.y) {
			return true;
		} else { return false; }
	}

};
