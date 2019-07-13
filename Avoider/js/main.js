window.onload = function() {

	var canvas = document.getElementById("GamePanel");
	var ctx = canvas.getContext("2d");
	if (!canvas || !canvas.getContext) {
		document.write("Your browser doesn't support the HTML5 canvas. Please upgrade your browser.");
	}
	var W = window.innerWidth;
	var H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;
	var frames = 0;
	var start = true;

	function Player(x,y) {
		this.x = x;
		this.y = y;
		this.w = 16;
		this.h = 16;
		this.vel = 5;
		this.velChange = 0;
		this.jump = false;
		this.style = "rgb(255,0,0)";
		this.update = function() {
			if (this.jump) {
				this.velChange = -1;
				if (this.vel <= -15) {
					this.velChange = 0;
					this.vel = 5;
					this.jump = false;
				}
			}
			this.vel += this.velChange;
			player.y += this.vel;
			ctx.fillStyle = this.style;
			ctx.fillRect(this.x,this.y,this.w,this.h);
		}
	}

	function Wall(x,y,h) {
		this.x = x;
		this.y = y;
		this.w = 30;
		this.h = h;
		this.style = "rgb(0,0,255)";
		this.draw = function() {
			ctx.fillStyle = this.style;
			ctx.fillRect(this.x,this.y,this.w,this.h);
		}
	}

	function toRect(obj) {
		return [obj.x,obj.y,obj.w,obj.h];
	}

	var player = new Player(W/8-8,H/2-8);
	var walls = [];
	var lost = false;
	var score = 0;

	function loop() {
		// Fill screen.
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillRect(0,0,W,H);
		if (start) {
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.font = "48px SansSerif";
			ctx.textAlign = "center";
			ctx.fillText("Welcome to Avoider!",W/2,150);
			ctx.fillText("Press any key to jump and avoid the walls.",W/2,250);
			ctx.fillText("Press <SPACE> to start.",W/2,350);
		} else if (lost) {
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.font = "48px SansSerif";
			ctx.textAlign = "center";
			ctx.fillText("Good Try.",W/2,150);
			ctx.fillText("Your Final Score: "+(score/2).toString(),W/2,250);
			ctx.fillText("Press <SPACE> to play again.",W/2,350);
		} else {
			// Update game state.
			++frames;
			if (frames % 25 == 0) { ranWall(); }
			for (var i = 0; i < walls.length; i++) {
				if (collideRect(toRect(player),toRect(walls[i]))) {
					lost = true;
				}
			}
			if (player.y < 0 || player.y + player.h > H) { lost = true; }
			for (var i = 0; i < walls.length; i++) {
				if (walls[i].x < 0) { score++;walls.splice(i,1); }
			}
			// Score.
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.font = "48px SansSerif";
			ctx.fillText(Math.ceil(score/2).toString(),W/2-100,150);
			// Draw player.
			player.update();
			// Draw walls.
			for (var i = 0; i < walls.length; i++) {
				walls[i].draw();
				walls[i].x -= walls[i].w;
			}
		}
	}

	window.onresize = function() {
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;
	}

	window.onkeydown = function(event) {
		if (event.which == 32) { // SPACE
			if (lost) { window.location.reload(); }
			if (start) { start = false; }
		}
		player.jump = true;
	}

	setInterval(loop,33);

	function ranRange(lower,upper) {
		return lower + Math.round((upper - lower) * Math.random());
	}

	function ranWall() {
		var randomHeight = ranRange(0,H*3/4);
		var otherHeight = randomHeight + player.y + 2;
		walls.push(new Wall(W-40,0,randomHeight))
		walls.push(new Wall(W-40,otherHeight,H - otherHeight));
	}

	function collidePoint(a,b) {
		return a[0] <= b[0] && b[0] <= a[0] + a[2] && a[1] <= b[1] && b[1] <= a[1] + a[3];
	}

	function collideRect(a,b) {
		return collidePoint(a,b) || collidePoint(b,a);
	}

};
