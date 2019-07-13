window.onload = function() {

	var canvas = document.getElementById("GamePanel");
	var ctx = canvas.getContext("2d");
	if (!canvas || !canvas.getContext) {
		document.write("<center><h1>Your browser doesn\'t support the HTML5 canvas. Please upgrade your browser.</h1><center>")
	}
	var W = window.innerWidth;
	var H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;
	var click = false;
	var mx = 0;
	var my = 0;
	var cells = [
		[new Cell('p',0),new Cell('p',1),new Cell('P',2),new Cell('P',3)],
		[new Cell('c',4),new Cell('c',5),new Cell('C',6),new Cell('C',7)],
		[new Cell('r',8),new Cell('r',9),new Cell('x',10),new Cell('x',11)],
		[new Cell('t',12),new Cell('t',13),new Cell('s',14),new Cell('s',15)]
	];
	shuffle(cells);
	var flipped = [];
	var cherry_design = [
		"                        ".split(""),
		"                        ".split(""),
		"                        ".split(""),
		"                        ".split(""),
		"                        ".split(""),
		"                        ".split(""),
		"                 bb     ".split(""),
		"               bbbb     ".split(""),
		"             bb b       ".split(""),
		"            b   b       ".split(""),
		"       rrrrb   b        ".split(""),
		"      rrrrbrr b         ".split(""),
		"      rrrrr  rbrrr      ".split(""),
		"      r rr rrrbrrrr     ".split(""),
		"      rr r rrrrrrrr     ".split(""),
		"       rrr r rrrrrr     ".split(""),
		"           rr rrrr      ".split(""),
		"            rrrrr       ".split(""),
		"                        ".split(""),
		"                        ".split(""),
		"                        ".split(""),
		"                        ".split(""),
		"                        ".split(""),
		"                        ".split("")
	];
	var pencil_design = [
		"      pppppppppppp      ".split(""),
		"      pppppppppppp      ".split(""),
		"      pppppppppppp      ".split(""),
		"      pppppppppppp      ".split(""),
		"      yyyyyyyyyyyy      ".split(""),
		"      yyyyyyyyyyyy      ".split(""),
		"      yyyyyyyyyyyy      ".split(""),
		"      yyyyyyyyyyyy      ".split(""),
		"      yyyyyyyyyyyy      ".split(""),
		"      yyyyyyyyyyyy      ".split(""),
		"      yyyyyyyyyyyy      ".split(""),
		"      yyyyyyyyyyyy      ".split(""),
		"      yyyyyyyyyyyy      ".split(""),
		"      yyyyyyyyyyyy      ".split(""),
		"      yyyyyyyyyyyy      ".split(""),
		"      yyyyyyyyyyyy      ".split(""),
		"      yyyyyyyyyyyy      ".split(""),
		"      BBBBBBBBBBBB      ".split(""),
		"      BBBBBBBBBBBB      ".split(""),
		"      BBBBBBBBBBBB      ".split(""),
		"       BBBBBBBBBB       ".split(""),
		"        BBBBBBBB        ".split(""),
		"         BBBBBB         ".split(""),
		"          BBBB          ".split("")
	];
	var cube_design = [
		"BBBBBBBBBBBBBBBBBBBB    ".split(""),
		"3ByyyyyByyyyyByyyyyB    ".split(""),
		"33ByyyyyByyyyyByyyyyB   ".split(""),
		"333BBBBBBBBBBBBBBBBBBB  ".split(""),
		"33B3ByyyyyByyyyyByyyyyB ".split(""),
		"3B333ByyyyyByyyyyByyyyyB".split(""),
		"B33333ByyyyyByyyyyByyyyy".split(""),
		"3333333BBBBBBBBBBBBBBBBB".split(""),
		"333333B3ByyyyyByyyyyByyy".split(""),
		"33333B333ByyyyyByyyyyByy".split(""),
		"3333B33333ByyyyyByyyyyBy".split(""),
		"333B3333333BBBBBBBBBBBBB".split(""),
		"B3B3333333BrrrrrBrrrrrBr".split(""),
		"3B3333333BrrrrrBrrrrrBrr".split(""),
		"33B33333BrrrrrBrrrrrBrrr".split(""),
		"333B333BBBBBBBBBBBBBBBBB".split(""),
		"3333B3BrrrrrBrrrrrBrrrrB".split(""),
		"33333BrrrrrBrrrrrBrrrrB ".split(""),
		"3333BrrrrrBrrrrrBrrrrB  ".split(""),
		"333BBBBBBBBBBBBBBBBBB   ".split(""),
		"33BrrrrrBrrrrrBrrrrB    ".split(""),
		"3BrrrrrBrrrrrBrrrrB     ".split(""),
		"BrrrrrBrrrrrBrrrrB      ".split(""),
		"BBBBBBBBBBBBBBBBB       ".split("")
	];
	var pong_design = [
		"           ww           ".split(""),
		"     w     ww           ".split(""),
		"     w     ww   www     ".split(""),
		"     w  w         w     ".split(""),
		"     w     ww     w     ".split(""),
		"           ww     w     ".split(""),
		"           ww     w     ".split(""),
		"                        ".split(""),
		"           ww           ".split(""),
		"           ww           ".split(""),
		"           ww     w     ".split(""),
		"                  w     ".split(""),
		"           ww     w     ".split(""),
		"   www     ww     w     ".split(""),
		"  w   w    ww           ".split(""),
		"  w   w                 ".split(""),
		"  w   w    ww           ".split(""),
		"   www     ww           ".split(""),
		"           ww           ".split(""),
		"                        ".split(""),
		"           ww           ".split(""),
		"           ww           ".split(""),
		"           ww           ".split(""),
		"                        ".split(""),
	];
	var road_design = [
		"                        ".split(""),
		"           yy           ".split(""),
		"           yy           ".split(""),
		"                        ".split(""),
		"                        ".split(""),
		"           yy           ".split(""),
		"    rr     yy           ".split(""),
		"   rwwr                 ".split(""),
		"  BrrrrB                ".split(""),
		"   rrrr    yy           ".split(""),
		"   rrrr    yy           ".split(""),
		"  BrrrrB          33    ".split(""),
		"   BBBB          3ww3   ".split(""),
		"           yy   B3333B  ".split(""),
		"           yy    3333   ".split(""),
		"                 3333   ".split(""),
		"                B3333B  ".split(""),
		"           yy    BBBB   ".split(""),
		"           yy           ".split(""),
		"                        ".split(""),
		"                        ".split(""),
		"           yy           ".split(""),
		"           yy           ".split(""),
		"                        ".split("")
	];
	var X_design = [
		"3                     3 ".split(""),
		"33                   33 ".split(""),
		"3 3                 3 3 ".split(""),
		"3  3               3  3 ".split(""),
		"3   3             3   3 ".split(""),
		"3    3           3    3 ".split(""),
		"3     3         3     3 ".split(""),
		"3      3       3      3 ".split(""),
		"3 B   B 3     3 B   B 3 ".split(""),
		"3  B B   3   3   B B  3 ".split(""),
		"3   B     3 3     B   3 ".split(""),
		"3  B B   B 3 B   B B  3 ".split(""),
		"3 B   B B  3  B B   B 3 ".split(""),
		" 3     B   3   B     3  ".split(""),
		"  3   B B  3  B B   3   ".split(""),
		"   3 B   B 3 B   B 3    ".split(""),
		"    3      3      3     ".split(""),
		"     3     3     3      ".split(""),
		"      3    3    3       ".split(""),
		"       3   3   3        ".split(""),
		"        3  3  3         ".split(""),
		"         3 3 3          ".split(""),
		"          333           ".split(""),
		"           3            ".split(""),
	];
	var TTT_design = [
		"       B       B        ".split(""),
		" B   B B B   B B B   B  ".split(""),
		"  B B  B  B B  B  B B   ".split(""),
		"   B   B   B   B   B    ".split(""),
		"  B B  B  B B  B  B B   ".split(""),
		" B   B B B   B B B   B  ".split(""),
		"       B       B        ".split(""),
		"BBBBBBBBBBBBBBBBBBBBBBBB".split(""),
		"       B       B        ".split(""),
		"       B  BBB  B  BBB   ".split(""),
		"       B B   B B B   B  ".split(""),
		"       B B   B B B   B  ".split(""),
		"       B B   B B B   B  ".split(""),
		"       B  BBB  B  BBB   ".split(""),
		"       B       B        ".split(""),
		"BBBBBBBBBBBBBBBBBBBBBBBB".split(""),
		"       B       B        ".split(""),
		"       B       B        ".split(""),
		"       B       B        ".split(""),
		"       B       B        ".split(""),
		"       B       B        ".split(""),
		"       B       B        ".split(""),
		"       B       B        ".split(""),
		"       B       B        ".split("")
	];
	var snake_design = [
		"                    1   ".split(""),
		"   122                  ".split(""),
		"     2    1             ".split(""),
		"     2                  ".split(""),
		"     22222222           ".split(""),
		"            2           ".split(""),
		"            2           ".split(""),
		"       2222 2           ".split(""),
		"          2 2           ".split(""),
		"          222           ".split(""),
		"                        ".split(""),
		"                        ".split(""),
		"              1         ".split(""),
		" 1                      ".split(""),
		"                        ".split(""),
		"    1                   ".split(""),
		"            1           ".split(""),
		"    1                   ".split(""),
		"                 111    ".split(""),
		"                        ".split(""),
		"                        ".split(""),
		"                        ".split(""),
		"     1                  ".split(""),
		"                        ".split(""),
	]

	function Cell(c,number) {
		this.char = c;
		this.image = "_";
		this.number = number;
		this.flip = function() { this.image = this.image == "_" ? this.char : "_"; }
		this.ne = function(other) { return other.char != this.char; }
		this.setState = function(state) { this.image = (state == 0) ? "_" : this.char; }
	}

	function drawImage(X,Y,design,size) {
		var l = size / 24;
		for (var y = 0; y < design.length; y++) {
			for (var x = 0; x < design[y].length; x++) {
				switch (design[y][x]) {
					case "r":
						ctx.fillStyle = "rgb(255,0,0)";
						break;
					case "b":
						ctx.fillStyle = "rgb(139,69,19)";
						break;
					case "B":
						ctx.fillStyle = "rgb(0,0,0)";
						break;
					case "1":
						ctx.fillStyle = "rgb(255,0,0)";
						break;
					case "2":
						ctx.fillStyle = "rgb(0,255,0)";
						break;
					case "3":
						ctx.fillStyle = "rgb(0,0,255)";
						break;
					case "y":
						ctx.fillStyle = "rgb(255,255,0)";
						break;
					case "p":
						ctx.fillStyle = "rgb(255,192,203)";
						break;
					case "w":
						ctx.fillStyle = "rgb(255,255,255)";
						break;
					default:
						ctx.fillStyle = "rgb(40,40,40)";
						break;
				}
				ctx.fillRect(X+x*l,Y+y*l,l,l);
			}
		}
	}

	function render() {
		console.log(flipped.length);
		var l = Math.floor((W < H ? W : H) / 4);
		for (var y = 0; y < 4; y++) {
			for (var x = 0; x < 4; x++) {
				if (x*l <= mx && mx <= x*l+l && y*l <= my && my <= y*l+l && click && cells[y][x].image == "_") {
					cells[y][x].flip();
					flipped.push(cells[y][x]);
					++steps;
				}
				switch (cells[y][x].image) {
					case '_':
						ctx.fillStyle = "rgb(255,0,0)";
						break;
					case 'c':
						drawImage(x*l,y*l,cherry_design,l);
						continue;
					case 'C':
						drawImage(x*l,y*l,cube_design,l);
						continue;
					case 'p':
						drawImage(x*l,y*l,pencil_design,l);
						continue;
					case 'P':
						drawImage(x*l,y*l,pong_design,l);
						continue;
					case 'r':
						drawImage(x*l,y*l,road_design,l);
						continue;
					case 'x':
						drawImage(x*l,y*l,X_design,l);
						continue;
					case 't':
						drawImage(x*l,y*l,TTT_design,l);
						continue;
					case 's':
						drawImage(x*l,y*l,snake_design,l);
						continue;
					default:
						continue;
				}
				ctx.fillRect(x * l + 2, y * l + 2, l - 4, l - 4);
			}
		}
	}

	function update() {
		if (flipped.length == 2) {
			var a = flipped.pop(); // Get pair.
			var b = flipped.pop(); // Get pair.
			if (a.ne(b)) /* Flip them back. */ {
				a.flip();
				b.flip();
			}
		}
	}

	function loop() {
		// Fill screen.
		ctx.fillStyle = "rgb(40,40,40)";
		ctx.fillRect(0,0,W,H);
		// Draw.
		update();
		render();
		// Render Message.
		if (won()) {
			ctx.fillStyle = "rgb(255,127,0)";
			ctx.font = "48px Menlo";
			ctx.textAlign = "center";
			ctx.fillText("You won!",W*3/4,H/2);
			ctx.font = "24px Menlo";
			ctx.fillText("Press <SPACE> to play again.",W*3/4,H/2+50);
		}
	}

	window.onresize = function() {
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;
	}

	window.onmousedown = function(event) {
		click = true;
		mx = event.x;
		my = event.y;
	}

	window.onmousemove = function(event) {
		mx = event.x;
		my = event.y;
	}

	window.onmouseup = function(event) {
		click = false;
		mx = event.x;
		my = event.y;
	}

	window.onkeydown = function(event) {
		if (event.which == 32) /* Space Bar. */ { window.location.reload(); }
	}

	setInterval(loop,33);

	function ranRange(lower,upper) {
		return lower + Math.round((upper - lower) * Math.random());
	}

	function shuffle(board) {
		var randomIndex,temp;
		for (var y = 0; y < board.length; y++) {
			for (var x = 0; x < board[y].length; x++) {
				randomIndex = [ranRange(0,3),ranRange(0,3)];
				temp = board[randomIndex[1]][randomIndex[0]];
				board[randomIndex[1]][randomIndex[0]] = board[y][x];
				board[y][x] = temp;
			}
		}
	}

	function won() {
		for (var y = 0; y < cells.length; y++) {
			for (var x = 0; x < cells[y].length; x++) {
				if (cells[y][x].image == "_") {
					return false;
				}
			}
		}
		return true;
	}

};
