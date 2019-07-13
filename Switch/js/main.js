window.onload = function() {

	var canvas = document.getElementById("GamePanel");
	var ctx = canvas.getContext("2d");
	if (!canvas || !canvas.getContext) {
		document.write("<h1>Your browser doesn't support the HTML5 canvas. Please upgrade your browser.</h1>");
	}
	var W = window.innerWidth;
	var H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;
	function Player() {
		this.x = W/2-8;
		this.y = H/4-8;
		this.w = 16;
		this.h = 16;
		this.style = "red";
	}
	var player = new Player();
	var blocks = [];
	var last = 0;
	var lastSpawn = 0;
	var frames = 0;
	var lost = false;
	var start = true;

	function loop() {
		if (ranRange(1,10) == 5 && frames - lastSpawn >= 10) {
			blocks.push([0,last ? H*3/4-8 : H/4-8,16,16])
			last = !last;
			lastSpawn = frames;
		}
		// Screen.
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,W,H);
		if (start) {
			ctx.fillStyle = "black";
			ctx.font = "48px Courier";
			ctx.fillText("Welcome to Switch!",W/2-400,150);
			ctx.font = "24px Courier";
			ctx.fillText("You are the red square.",W/2-550,250);
			ctx.fillText("Press space to \"switch\" and avoid the blue squares.",W/2-470,350);
			ctx.fillText("Press space to start.",W/2-340,450);
		} else if (lost) {
			ctx.fillStyle = "black";
			ctx.font = "48px Courier";
			ctx.fillText("Good Try.",W/2-400,150)
			ctx.fillText("Frames Survived: "+frames.toString(),W/2-470,250);
			ctx.fillText("Space to play again.",W/2-550,350);
		} else {
			// Update game state.
			++frames;
			// Player.
			ctx.fillStyle = player.style;
			ctx.fillRect(player.x,player.y,player.w,player.h);
			// Blocks.
			ctx.fillStyle = "blue";
			for (var i = 0; i < blocks.length; i++) {
				blocks[i][0] += blocks[i][2];
				var block = blocks[i];
				ctx.fillRect(block[0],block[1],block[2],block[3]);
				if (player.x <= block[0] && block[0] <= player.x + player.w && block[1] == player.y) {
					lost = true;
				}
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
		switch (event.which) {
			case 32: // SPACE BAR.
				if (start) { start = false; }
				else if (lost) { window.location.reload(); }
				else {
					player.y = (player.y == H*3/4-8 ? H/4-8 : H*3/4-8);
				}
			default:
				break;
		}
	}

	setInterval(loop,33);

	function ranRange(lower,upper) { return lower + Math.round((upper - lower) * Math.random()); }

};
