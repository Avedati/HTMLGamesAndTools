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
	var player = {
		x: W/9,
		y: H*8/9,
		w: 120,
		h: 30,
		style: "red",
		vels: [
			[-12,-4],[-8,-8],[-4,-12],[4,-12],[8,-8],[12,-4]
		],
		score: 0
	}

	var opponent = {
		x: W*7/9,
		y: H*8/9,
		speed: 12,
		w:120,
		h:30,
		style: "blue",
		vels: [
			[-12,-4],[-8,-8],[-4,-12],[4,-12],[8,-8],[12,-4]
		],
		score: 0
	}

	function Ball() {
		this.x = ranRange(1,2) == 1 ? W/4-4 : W*3/4-4;
		this.y = H/4-4;
		this.w = 8;
		this.h = 8;
		this.style = "black";
		this.vel = [8,8];
		this.draw = function() {
			ctx.fillStyle = this.style;
			ctx.fillRect(this.x,this.y,this.w,this.h);
		}
		this.update = function() {
			this.x += this.vel[0];
			this.y += this.vel[1];
			if (this.x <= 0) { this.vel[0] = Math.abs(this.vel[0]); }
			if (this.x + this.w >= W) { this.vel[0] = -Math.abs(this.vel[0]); }
			if (this.y <= 0) { this.vel[1] = Math.abs(this.vel[1]); }
			if (this.y >= H) {
				if (this.x >= barrier[0] + barrier[2]) {
					player.score++;
				} else if (this.x + this.w <= barrier[0]) { opponent.score++; }
				ball = new Ball();
				return;
			}
			var count = -1;
			for (var i = player.x; i < player.x + player.w; i += Math.round(player.w / 6)) {
				++count;
				if (i <= this.x && this.x <= Math.round(i + player.w / 6) && player.y <= this.y && this.y <= player.y + player.h) {
					console.log(opponent.vels[count]);
					this.vel[0] = player.vels[count][0];
					this.vel[1] = player.vels[count][1];
				}
			}
			count = -1;
			for (var i = opponent.x; i < opponent.x + opponent.w; i += Math.round(opponent.w / 6)) {
				++count;
				if (i <= this.x && this.x <= Math.round(i + opponent.w / 6) && opponent.y <= this.y && this.y <= opponent.y + opponent.h) {
					this.vel[0] = opponent.vels[count][0];
					this.vel[1] = opponent.vels[count][1];
				}
			}
			if (Math.abs(barrier[0] - this.x) <= 8 && barrier[1] <= this.y) { this.vel[0] = -Math.abs(this.vel[0]); }
			if (Math.abs((barrier[0] + barrier[2]) - this.x) <= 8 && barrier[1] <= this.y) {
				this.vel[0] = Math.abs(this.vel[0])
			}
			if (Math.abs(barrier[1] - this.y) <= 8 && barrier[0] <= this.x && this.x <= barrier[0] + barrier[2]) {
				this.vel[1] = -Math.abs(this.vel[1])
			}
		}
	}

	var ball = new Ball()
	var randomHeight = ranRange(100,700);
	var barrier = [ranRange(W*3/10,W*5/10),H - randomHeight,ranRange(50,200),randomHeight];

	function AI() {
		if (ball.x >= barrier[0] + barrier[2] && ball.vel[1] > 0) {
			if (opponent.x <= ball.x && ball.x <= opponent.x + opponent.w) { return; }
			if (ball.x > opponent.x) {
				opponent.x += opponent.speed;
				if (opponent.x + opponent.w > W) { opponent.x = W - opponent.w; }
			}
			if (ball.x < opponent.x) {
				opponent.x -= opponent.speed;
				if (opponent.x < barrier[0] + barrier[2]) { opponent.x = barrier[0] + barrier[2]; }
			}
		}
	}

	function loop() {
		++frames;
		// Screen.
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,W,H);
		if (start) {
			ctx.fillStyle = "black";
			ctx.font = "48px Courier";
			ctx.fillText("Barrier Pong",W/2-500,150);
			ctx.fillText("It's normal \"Pong\", but with a barrier.",W/2-530,250);
			ctx.fillText("Use the WASD or ARROW keys to move.",W/2-530,350);
			ctx.fillText("Press <SPACE> to start",W/2-470,450);
		} else {
			// Player Tank.
			ctx.fillStyle = player.style;
			ctx.fillRect(player.x,player.y + player.h / 2,player.w,player.h / 2);
			// Opponent Tank.
			AI();
			ctx.fillStyle = opponent.style;
			ctx.fillRect(opponent.x,opponent.y + opponent.h / 2,opponent.w,opponent.h / 2);
			// Barrier.
			ctx.fillStyle = "black";
			ctx.fillRect(barrier[0],barrier[1],barrier[2],barrier[3]);
			// Ball.
			ball.update();
			ball.draw();
			// Scores.
			ctx.fillStyle = "black";
			ctx.font = "100px Courier";
			ctx.fillText(player.score.toString(),W/4-100,150);
			ctx.fillText(opponent.score.toString(),W*3/4-100,150);
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
			case 65: // A
			case 37: // LEFT
				player.x -= 15;
				if (player.x < 0) { player.x = 0; }
				break;
			case 68: // D
			case 39: // RIGHT
				player.x += 15;
				if (player.x + player.w > barrier[0]) { player.x = barrier[0] - player.w; }
				break;
			case 32: // SPACE
				if (start) { start = false; }
			default:
				break;
		}
	}

	setInterval(loop,33);

	function ranRange(lower,upper) {
		return lower + Math.round((upper - lower) * Math.random());
	}

};
