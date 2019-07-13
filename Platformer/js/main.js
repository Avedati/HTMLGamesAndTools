window.onload = function() {

	/* Grad and setup canvas we made a few lines ago. */
	var canvas = document.getElementById("GamePanel");
	var ctx = canvas.getContext("2d");
	if (!canvas || !canvas.getContext) {
		document.write("<center><h1>Your browser doesn't support the HTML5 canvas. Please upgrade your browser.</h1></center>");
	}
	var W = window.innerWidth;
	var H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;
	var won = false;
	var start = true;
	var blocksize = 40;
	var frames = 0;
	var playerHp = 14;
	var xchange = -1;
	var speed = -1;
	var backgroundDesign = [
		/* 105x40 */
		/* 48 Enemies. */
		'ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g    P                    E                                                   E                         g'.split(""),
		'gggggggggggggggggggggggggggggggggggggggggggggggggggg gggggggggggggggggggggggggggggggggggggggggggggggggggg'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                         E                                                   E                         g'.split(""),
		'gggggggggggggggggggggggggggggggggggggggggggggggggg gggggggggggggggggggggggggggggggggggggggggggggggggggggg'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                         E                                                   E                         g'.split(""),
		'ggggggggggggggggggggggggggggggggggggggggggggggggg ggggggggggggggggggggggggggggggggggggggggggggggggggggggg'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                         E                                                   E                         g'.split(""),
		'gggggggggggggggggggggggggggggggggggggggggggggggggg gggggggggggggggggggggggggggggggggggggggggggggggggggggg'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                         E                                                   E                         g'.split(""),
		'ggggggggggggggggggggggggggggggggggggggggggggggggg ggggggggggggggggggggggggggggggggggggggggggggggggggggggg'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                         E                                                   E                         g'.split(""),
		'gggggggggggggggggggggggggggggggggggggggggggggggg gggggggggggggggggggggggggggggggggggggggggggggggggggggggg'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                         E                                                   E                         g'.split(""),
		'gggggggggggggggggggggggggggggggggggggggggggggggg gggggggggggggggggggggggggggggggggggggggggggggggggggggggg'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                                                                                                       g'.split(""),
		'g                         E                                                   E                         g'.split(""),
		'ggggggggggggggggggggggggggggggggggggggggggggggggg ggggggggggggggggggggggggggggggggggggggggggggggggggggggg'.split("")
	];

	function drawBackground(X,Y) {
		var px,py;
		for (var y = 0; y < backgroundDesign.length; y++) {
			for (var x = 0; x < backgroundDesign[y].length; x++) {
				px = X + x * blocksize;
				py = Y + y * blocksize;
				switch (backgroundDesign[y][x]) {
					case "g":
						ctx.fillStyle = "rgb(0,255,0)";
						break;
					case "P":
						if (Math.abs(y - backgroundDesign.length) <= 1) { won = true; }
						ctx.fillStyle = "rgb(0,0,120)";
						break;
					case "E":
						AI(x,y);
						ctx.fillStyle = "rgb(255,127,0)";
						break;
					default:
						ctx.fillStyle = "rgb(255,255,255)"
						break;
				}
				ctx.fillRect(px,py,blocksize,blocksize);
				if (backgroundDesign[y][x] == "P" || backgroundDesign[y][x] == "E")
				{
					// Eyes.
					ctx.fillStyle = "rgb(255,255,255)";
					ctx.fillRect(px + blocksize / 8, py + blocksize / 4, blocksize / 4, blocksize / 4);
					ctx.fillRect(px + blocksize * 5 / 8, py + blocksize / 4, blocksize / 4, blocksize / 4);
					// Pupils.
					ctx.fillStyle = "rgb(139,69,39)"
					xMod = (backgroundDesign[y][x] == "P" ? (xchange == -1 ? 0 : 1/8) : 0)
					ctx.fillRect(px + blocksize * (1/8 + xMod), py + blocksize / 4, blocksize / 8, blocksize / 4);
					ctx.fillRect(px + blocksize * (5/8 + xMod), py + blocksize / 4, blocksize / 8, blocksize / 4);
				}
			}
		}
	}

	function loop() {
		/* Fill screen. */
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,W,H);
		if (start) {
			ctx.fillStyle = "black";
			ctx.font = "48px Envy Code R";
			ctx.fillText("Platformer",W/2-600,150);
			ctx.fillText("Avoid the orange pixels and make it to the bottom.",W/2-650,250);
			ctx.fillText("Press <SPACE> to play.",W/2-550,350);
		} else if (won) {
			ctx.fillStyle = "black";
			ctx.font = "48px Envy Code R";
			ctx.fillText("You Won!",W/2-600,150);
			ctx.fillText("Score (lower is better.): "+frames.toString(),W/2-650,250);
			ctx.fillText("Press <SPACE> to play again.",W/2-550,350);
		} else {
			/* Update game state. */
			if (playerHp <= 0) { window.location.reload(); }
			++frames;
			/* Draw everything else. */
			var playerCoords = findPlayer();
			swap(playerCoords,[playerCoords[0] + xchange,playerCoords[1]]);
			drawBackground(-blocksize * playerCoords[0] + 300,-blocksize * playerCoords[1] + 300);
			/* Draw score. */
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.font = "48px Envy Code R";
			ctx.fillText("LIVES: "+playerHp.toString(),W/2-100,250);
		}
	}

	function swap(a,b) {
		if (backgroundDesign[a[1]][a[0]] == "g" || backgroundDesign[b[1]][b[0]] == "g") { return -1; }
		var temp = backgroundDesign[a[1]][a[0]];
		backgroundDesign[a[1]][a[0]] = backgroundDesign[b[1]][b[0]];
		backgroundDesign[b[1]][b[0]] = temp;
		return 1;
	}

	window.onresize = function() {	
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;
	}

	window.onkeydown = function(event) {
		window.close();
		var playerCoords = findPlayer();
		switch (event.which) {
			case 38: // UP ARROW.
			case 87: // W KEY.
				swap(playerCoords,[playerCoords[0],playerCoords[1]-1])
				break;
			case 40: // DOWN ARROW.
			case 83: // S KEY.
				swap(playerCoords,[playerCoords[0],playerCoords[1]+1])
				break;
			case 37: // LEFT ARROW.
			case 65: // A KEY.
				xchange = -1;
				break;
			case 39: // RIGHT ARROW.
			case 68: // D KEY.
				xchange = 1;
				break;
			case 32: // SPACE BAR.
				if (start) { start = false; }
				if (won) { window.location.reload(); }
			default:
				break;
		}
	}

	function findPlayer() {
		for (var y = 0; y < backgroundDesign.length; y++) {
			for (var x = 0; x < backgroundDesign[y].length; x++) {
				if (backgroundDesign[y][x] == "P") { return [x,y] }
			}
		}
		return null;
	}

	function AI(x,y) {
		var playerCoords = findPlayer();
		if (x == 2) {
			backgroundDesign[y][x] = " ";
			if (backgroundDesign[y][backgroundDesign[0].length-2] != "P") {
				backgroundDesign[y][backgroundDesign[0].length-2] = "E";
			} else { backgroundDesign[y][backgroundDesign[0].length-3] = "E"; }
		}
		if (Math.abs((x + speed) - playerCoords[0]) <= 1 && y == playerCoords[1]) { --playerHp; }
		swap([x,y],[x+speed,y]);
	}

	setInterval(loop,33);

};
