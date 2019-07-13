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
	var lost = false;
	var start = true;

	function Player(x,y) {
		this.x = x;
		this.y = y;
		this.w = 10;
		this.h = 10;
		this.xchange = 0;
		this.ychange = -this.h;
		this.style = "rgb(0,255,0)";
		this.list = [];
		this.l = 3;
		this.update = function() {
			this.x += this.xchange;
			this.y += this.ychange;
			this.list.unshift([this.x,this.y,this.w,this.h]);
			if (this.list.length > this.l) { this.list.pop(); }
			for (var i = 1; i < this.list.length; i++) {
				if (this.x == this.list[i][0] && this.y == this.list[i][1]) { lost = true; }
			}
			// Collision Detection.
			for (var j = 0; j < apples.length; j++) {
				var apple = apples[j];
				if (((this.x <= apple[0] && apple[0] <= this.x + this.w) || 
				(this.x <= apple[0] + apple[2] && apple[0] + apple[2] <= this.x + this.w)) && 
				((this.y <= apple[1] && apple[1] <= this.y + this.h) || 
				(this.y <= apple[1] + apple[3] && apple[1] + apple[3] <= this.y + this.h))) {
					this.l++;
					apples.splice(j,1);
					continue;
				}
			}
			if (this.x <= 0 || this.x + this.w >= W || this.y <= 0 || this.y + this.h >= H) { lost = true; }
			ctx.fillStyle = this.style;
			for (var i = 0; i < this.list.length; i++) {
				var block = this.list[i];
				ctx.fillRect(block[0],block[1],block[2],block[3]);
			}
		}
	}

	var player = new Player(W/2,H/2);
	var apples = [];

	function loop() {
		/* Screen */
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,W,H);
		if (start) {
			ctx.fillStyle = "black";
			ctx.font = "48px SansSerif";
			ctx.fillText("Snake",30,150);
			ctx.fillText("Eat the apples.",30,250);
			ctx.fillText("Don't run into the sides or yourself.",80,350);
			ctx.fillText("<SPACE> to play.",15,450);
		} else if (lost) {
			ctx.fillStyle = "black";
			ctx.font = "48px SansSerif";
			ctx.fillText("Good Try.",80,150);
			ctx.fillText("Final length: "+player.list.length.toString()+".",50,250)
			ctx.fillText("<SPACE> to play again.",30,350);
		} else {
			/* Player */
			player.update();
			/* Apples */
			if (ranInt(1,20) == 10) { randApple(); }
			ctx.fillStyle = "rgb(255,0,0)";
			for (var i = 0; i < apples.length; i++) { ctx.fillRect(apples[i][0],apples[i][1],apples[i][2],apples[i][3]); }	
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
			case 87: // W
			case 38: // UP
				player.ychange = -player.h;
				player.xchange = 0;
				break;
			case 83: // S
			case 40: // DOWN
				player.ychange = player.h;
				player.xchange = 0;
				break;
			case 65: // A
			case 37: // LEFT
				player.ychange = 0;
				player.xchange = -player.w;
				break;
			case 68: // D
			case 39: // RIGHT
				player.ychange = 0;
				player.xchange = player.w;
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

	function ranInt(lower,upper) {
		return lower + Math.round((upper - lower) * Math.random());
	}

	function randApple() {
		var x = ranInt(0,Math.floor(W / 10)) * 10;
		var y = ranInt(0,Math.floor(H / 10)) * 10;
		apples.push([x,y,10,10]);
	}

};
