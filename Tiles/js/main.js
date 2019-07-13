window.onload = function() {

	var canvas = document.getElementById("GamePanel");
	var ctx = canvas.getContext("2d");
	if (!canvas || !canvas.getContext) {
		document.write("<h1>Your browser doesn't support the HTML5 canvas. Please upgrade your browser.</h1>");
	}
	var W = window.innerWidth;
	var H = window.innerHeight;
	var lost = false;
	var spikesY = H;
	var lasers = [];
	var frames = 0;
	var start = true;
	var player = {
		rect: [W/2-8,H/2-8,16,16],
		vel: 1,
		style: "red",
		jump: false
	}
	canvas.width = W;
	canvas.height = H;

	function updatePlayer() {
		player.rect[1] += player.vel;
		if (player.jump) {
			player.vel -= 1;
			if (player.vel <= -9) { player.vel = 1;player.jump = false; }
		}
		if (player.rect[1] <= 0 || player.rect[1] + player.rect[3] >= spikesY - 150) {
			lost = true;
		}
	}

	function loop() {
		// Screen
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,W,H);
		if (start) {
			ctx.fillStyle = "black";
			ctx.font = "48px Marker Felt";
			ctx.fillText("TILES",W/2-50,50);
			ctx.fillText("Avoid everything.",W/2-100,150);
			ctx.fillText("Press <SPACE> to jump.",W/2-120,250);
			ctx.fillText("<SPACE> to start the game.",W/2-140,350);
		} else if (lost) {
			ctx.fillStyle = "black";
			ctx.font = "48px Marker Felt";
			ctx.fillText("GAME OVER.",W/2-100,50);
			ctx.fillText("Frames Survived: "+frames.toString(),W/2-250,150);
			ctx.fillText("<SPACE> to play again.",W/2-175,300);
		} else {
			++frames;
			// Spikes
			ctx.fillStyle = "gray";
			if (frames % 10 == 0) { --spikesY; }
			for (var i = 0; i + 50 < W; i += Math.floor(W / 10)) {
				ctx.beginPath();
				ctx.moveTo(i,spikesY);
				ctx.lineTo(i+75,spikesY-150);
				ctx.lineTo(i+150,spikesY);
				ctx.fill();
			}
			// Player
			updatePlayer();
			ctx.fillStyle = player.style;
			ctx.fillRect(player.rect[0],player.rect[1],player.rect[2],player.rect[3]);
			// Lasers
			if (ranRange(1,4) == 1) {
				lasers.push([0,ranRange(0,100)*10,30,10]);
			}
			ctx.fillStyle = "black";
			for (var i = 0; i < lasers.length; i++) {
				var laser = lasers[i];
				laser[0] += laser[2];
				if (Math.abs(laser[0] - player.rect[0]) <= 15 && Math.abs(laser[1] - player.rect[1]) <= 10) {
					lost = true;
				}
				ctx.fillRect(laser[0],laser[1],laser[2],laser[3]);
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
			case 32: // SPACE
				if (start) { start = false;break; }
				if (lost) { window.location.reload(); }
				player.jump = true;
				break;
		}
	}

	setInterval(loop,33);

	function ranRange(lower,upper) {
		return lower + Math.round((upper - lower) * Math.random());
	}

};
