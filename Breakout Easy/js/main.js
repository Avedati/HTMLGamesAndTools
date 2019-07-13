window.onload = function() {

	var canvas = document.getElementById("GamePanel");
	var ctx = canvas.getContext("2d");
	if (!canvas || !canvas.getContext) {
		document.write("<center><h1>Please upgrade your browser to play this game.</h1></center>")
	}
	
	var W = window.innerWidth;
	var H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;
	var blocksize = [20,60];
	var started = false;
	var end = false;
	
	function Block(x,y,style) {
		this.x = x;
		this.y = y;
		this.w = blocksize[0];
		this.h = blocksize[1];
		this.style = style;
		this.draw = function() {
			ctx.fillStyle = this.style;
			ctx.fillRect(this.x+2,this.y+2,this.w-4,this.h-4);
		}
	}
	
	function Paddle(x,y,style) {
		this.x = x;
		this.y = y;
		this.w = 240;
		this.h = 10;
		this.score = 0;
		this.style = style;
		this.vels = [
			[-13,-1],
			[-7, -7],
			[-1,-13],
			[ 1,-13],
			[ 7, -7],
			[ 13,-1]
		]
		this.draw = function() {
			ctx.fillStyle = this.style;
			ctx.fillRect(this.x,this.y,this.w,this.h);
		}
		this.update = function(ball) {
			var count = -1;
			for (var x = this.x; x < this.x + this.w; x += this.w / 6) {
				++count;
				if (collideRect([x,this.y,this.w / 6,this.h],toRect(ball))) {
					ball.xVel = this.vels[count][0];
					ball.yVel = this.vels[count][1];
				}
			}
		}
	}
	
	function Ball(x,y,style) {
		this.x = x;
		this.y = y;
		this.w = 10;
		this.h = 10;
		this.xVel = 8 * (ranRange(0,1) == 0 ? -1 : 1);
		this.yVel = 8 * (ranRange(0,1) == 0 ? -1 : 1);
		this.style = style;
		this.draw = function() {
			ctx.fillStyle = this.style;
			ctx.beginPath();
			ctx.arc(this.x + this.w / 2,this.y + this.h / 2,this.w / 2,0,2 * Math.PI);
			ctx.fill();
		}
		this.update = function() {
			this.x += this.xVel;
			this.y += this.yVel;
			if (this.x < 0) { this.xVel = Math.abs(this.xVel); }
			if (this.x + this.w > W) { this.xVel = -Math.abs(this.xVel); }
			if (this.y < 0) { this.yVel = Math.abs(this.yVel); }
			if (this.y > player.y) {
				ball = 1;
				end = true;
				feedMessage = "Click to play again.";
			}
			for (var i = 0; i < blocks.length; i++) {
				var block = blocks[i];
				if (collideRect(toRect(block),toRect(this))) {
					if (ranRange(1,7) == 4) {
						switch (block.style) {
							case "rgb(255,255,0)":
								this.yVel = 3;
								break;
							case "rgb(255,127,0)":
								this.yVel = 8;
								break;
							case "rgb(255,0,0)":
								this.yVel = 13;
								break;
						}
					}
					blocks.splice(i,1);
					player.score++;
					continue;
				}
			}
		}
	}
	
	var player = new Paddle(W/2 - 120,H / 2 - 10,"rgb(0,0,255)");
	var ball = new Ball(W / 2 - 5,H / 2 - 25,"rgb(100,100,100)");
	// Setup blocks.
	var blocks = [];
	var colors = ["rgb(255,0,0)","rgb(255,127,0)","rgb(255,255,0)"];
	var count = -1;
	for (var y = 0; y < H / 4; y += blocksize[1]) {
		++count;
		for (var x = blocksize[0] / 3; x + blocksize[0] * 2 / 3 < W; x += blocksize[0]) {
			blocks.push(new Block(x,y,colors[count]));
		}
	}
	var feedMessage = "Click to start.";
	// Setup blocks.
	
	function loop() {
		// Update game state.
		if (blocks.length == 0) { feedMessage = "You Win! Click to play again.";end = true; }
		// Fill screen white.
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillRect(0,0,W,H);
		// Draw blocks.
		for (var i = 0; i < blocks.length; i++) {
			blocks[i].draw();
		}
		// Draw player.
		player.update(ball);
		player.draw();
		// Draw ball.
		if (ball != 1) {
			if (started) { ball.update(); }
			ball.draw();
		}
		// Draw score.
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.font = "48px SansSerif";
		ctx.textAlign = "center";
		ctx.fillText(player.score.toString(),W/2,H*3/4-24);
		// Render feed message.
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.textAlign = "center";
		ctx.fillText(feedMessage,W/2,H*7/8-24);
	}
	
	window.onresize = function() {
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;
	}
	
	window.onmousemove = function(event) {
		player.x = event.x - 120;
	}
	
	window.onmousedown = function(event) {
		if (!started) { started = true;feedMessage = ""; }
		if (end) { window.location.reload(); }
	}
	
	setInterval(loop,33);
	
	function ranRange(lower,upper) {
		return lower + Math.round((upper - lower) * Math.random());
	}
	
	function toRect(entity) {
		try {
			return [ entity.x,entity.y,entity.w,entity.h ];
		} catch (exception) { return null; }
	}
	
	function collideRect(a,b) {
		if ((a[0]<=b[0]&&b[0]<=a[0]+a[2])||(a[0]<=b[0]+b[2]&&b[0]+b[2]<=a[0]+a[2])) {
			if ((a[1]<=b[1]&&b[1]<=a[1]+a[3])||(a[1]<=b[1]+b[3]&&b[1]+b[3]<=a[1]+a[3])) {
				return true;
			}
		}
		return false;
	}

};
