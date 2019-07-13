window.onload = function() {

	/* Grab and setup canvas we created a few lines ago. */
	var canvas = document.getElementById("GamePanel");
	var ctx = canvas.getContext("2d");
	if (!canvas || !canvas.getContext) {
		document.write("<center><h1>Your browser doesn't support the HTML5 canvas. Please upgrade your browser.</h1></center>");
	}
	var W = window.innerWidth;
	var H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;

	var blocksize = [30,10]
	var playerspeed = 20;
	var start = true;

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

	function Player(x,y) {
		this.style = "rgb(0,0,255)";
		this.rects = [
			[[-13,-1],[x-30,y,10,10]],
			[[ -7,-7],[x-20,y,10,10]],
			[[-1,-13],[x-10,y,10,10]],
			[[ 1,-13],[   x,y,10,10]],
			[[  7,-7],[x+10,y,10,10]],
			[[ 13,-1],[x+20,y,10,10]]
		];
		this.draw = function() {
			ctx.fillStyle = this.style;
			for (var i = 0; i < this.rects.length; i++) {
				var rect = this.rects[i][1];
				ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
			}
		}
		this.move = function(amount) {
			for (var i = 0; i < this.rects.length; i++) {
				this.rects[i][1][0] += amount;
			}
		}
	}

	function Ball(x,y) {
		this.x = x;
		this.y = y;
		this.w = 8;
		this.h = 8;
		this.xVel = -7;
		this.yVel = -7;
		this.style = "rgb(0,0,0)"
		this.maxBlocksHit = ranRange(1,7);
		this.blocksHit = 0;
		this.score = 0;
		this.update = function() {
			/* Move. */
			this.x += this.xVel;
			this.y += this.yVel;
			/* Bounce off walls. */
			if (this.x < 0) { this.xVel = Math.abs(this.xVel); }
			if (this.x + this.w > W) { this.xVel = -Math.abs(this.xVel); }
			if (this.y < 0) { this.yVel = Math.abs(this.yVel); }
			/* Lose. */
			if (this.y > player.rects[0][1][1] + player.rects[0][1][3]) { window.location.reload(); }
			/* Collisions. */
			/* Player. */
			for (var i = 0; i < player.rects.length; i++) {
				var rect = player.rects[i][1];
				if (collideRect(rect,[this.x,this.y,this.w,this.h])) {
					this.xVel = player.rects[i][0][0];
					this.yVel = player.rects[i][0][1];
				}
			}
			/* Blocks. */
			for (var i = 0; i < blocks.length; i++) {
				var block = blocks[i];
				if (collideRect([block.x,block.y,block.w,block.h],[this.x,this.y,this.w,this.h])) {
					this.blocksHit++;this.score++;
					if (this.blocksHit >= this.maxBlocksHit) {
						this.blocksHit = 0;
						this.maxBlocksHit = ranRange(1,7);
						this.yVel *= -1;
					}
					blocks.splice(i,1);
					continue;
				}
			}
			/* Draw. */
			ctx.fillStyle = this.style;
			ctx.fillRect(this.x,this.y,this.w,this.h);
		}
	}

	var blocks = [];
	for (var y = blocksize[1]; y < 310; y += blocksize[1]) {
		for (var x = blocksize[0]; x < W - blocksize[0]; x += blocksize[0]) {
			blocks.push(new Block(x,y,"rgb("+Math.round(x/10).toString()+",0,0)"));
		}
	}
	var player = new Player(W/2,H-50);
	var ball = new Ball(W/2-4,H/2-4);

	function loop() {
		/* Fill screen with green. */
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillRect(0,0,W,H);
		if (start) {
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.font = "48px Envy Code R";
			ctx.fillText("Welcome to Breakout!",W/2-100,150);
			ctx.font = "24px Envy Code R";
			ctx.fillText("Use the A and LEFT ARROW keys to move left.",W/2-200,250);
			ctx.fillText("Use the D and RIGHT ARROW keys to move right.",W/2,350);
			ctx.fillText("Don\'t let the ball fall to the bottom of the screen.",W/2-400,450);
			ctx.fillText("Press :SPACE: to start",W/2-175,550);
		} else {
			/* Draw blocks to screen. */
			for (var i = 0; i < blocks.length; i++) { blocks[i].draw(); }
			/* Draw player to screen. */
			player.draw();
			/* Update and draw ball. */
			ball.update();
			/* Draw score to screen. */
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.font = "48px Envy Code R";
			ctx.fillText("Score: "+ball.score.toString(),W/2-100,H/2+100);
		}
	}

	window.onresize = function() {
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;
	}

	window.onkeydown = function(event) {
		switch (event.which) {
			case 37: // LEFT ARROW
			case 65: // A KEY
				player.move(-playerspeed);
				if (player.rects[0][1][0] < 0) { player.move(playerspeed); }
				break;
			case 39: // RIGHT ARROW
			case 68: // D KEY
				player.move(playerspeed);
				if (player.rects[player.rects.length - 1][1][0] + player.rects[0][1][2] > W) {
					player.move(-playerspeed);
				}
				break;
			case 32: // SPACE
				if (start) { start = false; }
			default:
				break;
		}
	}

	setInterval(loop,33);
	function ranRange(lower,upper) { return lower + Math.round((upper - lower) * Math.random()); }
	function collideRect(a,b) {
		if (a[0] <= b[0] + b[2] && a[0] + a[2] >= b[0] && 
		a[1] <= b[1] + b[3] && a[1] + a[3] >= b[1]) {
			return true;
		} else { return false; }
	}

};
