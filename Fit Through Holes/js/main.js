window.onload = function() {

	var canvas = document.getElementById("GamePanel");
	var ctx = canvas.getContext("2d");
	var W,H;
	var lost = false;
	var start = true;
	var score = 0;
	var gameFont = "Chalkduster";
	var frames = 0;

	canvas.width = W = window.innerWidth;
	canvas.height = H = window.innerHeight;

	var cubes = [];
	var spaces = [];
	var player = [0,0,-5];
	var rect = [W/2 - 100,H/2 - 100,200,200];

	function circle(x,y,l,style)
	{
		ctx.beginPath();
		ctx.fillStyle = style;
		ctx.arc(x,y,l,0,2 * Math.PI);
		ctx.fill();
	}

	function line(p0,p1,style)
	{
		ctx.beginPath();
		ctx.strokeStyle = style;
		ctx.moveTo(p0[0],p0[1]);
		ctx.lineTo(p1[0],p1[1]);
		ctx.stroke();
	}

	function polygon(pts,style)
	{
		ctx.beginPath();
		ctx.fillStyle = style;
		ctx.moveTo(pts[0][0],pts[0][1]);
		var pt;
		for (var i = 1; i < pts.length; i++)
		{
			pt = pts[i];
			ctx.lineTo(pt[0],pt[1]);
		}
		ctx.fill();
	}

	function Cube(a,b,c,pos,style)
	{
		this.a = a;
		this.b = b;
		this.c = c;
		this.pos = pos;

		var a1 = this.a / 2;
		var b1 = this.b / 2;
		var c1 = this.c / 2;
		this.pts = [
			[-a1,-b1,-c1],
			[a1,-b1,-c1],
			[a1,b1,-c1],
			[-a1,b1,-c1],
			[-a1,-b1,c1],
			[a1,-b1,c1],
			[a1,b1,c1],
			[-a1,b1,c1],
		];

		this.move = function(x,y,z)
		{
			for (var i = 0; i < this.pts.length; i++)
			{
				this.pts[i][0] += x;
				this.pts[i][1] += y;
				this.pts[i][2] += z;
			}
		}

		this.move(this.pos[0],this.pos[1],this.pos[2]);
		
		this.lines = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
		this.style = style;
		this.faces = [[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[0,2,6,4],[1,3,7,5]];

		this.update = function()
		{
			var pt,x,y,z,f;
			var screen_coords = [];
			var zs = [];
			for (var i = 0; i < this.pts.length; i++)
			{
				// Unpacking point.
				pt = this.pts[i];
				x = pt[0];
				y = pt[1];
				z = pt[2];
				// Translating points.
				x -= player[0];
				y -= player[1];
				z -= player[2];

				// 3d projection.
				f = (W / 2 < H / 2 ? W / 2 : H / 2) / z;
				x *= f;
				y *= f;
				screen_coords.push([W/2+x,H/2+y]);
				zs.push(z);
			}

			// Check if cube is off the screen.
			var pos;
			for (var i = 0; i < zs.length; i++)
			{
				if (zs[i] <= 2)
				{
					if (screen_coords[0][0]<=rect[0]+rect[2]&&
					rect[0]<=screen_coords[2][0]&&
					screen_coords[1][1]<=rect[1]+rect[3]&&
					rect[1]<=screen_coords[3][1])
					{
						lost = true;
					}
					return -1;
				}
			}

			// Draw pts.
			for (var i = 0; i < screen_coords.length; i++)
			{
				circle(screen_coords[i][0],screen_coords[i][1],6,"rgb(0,0,0)");
			}
			// Draw faces
			var face,p2,p3
			for (var i = 0; i < this.faces.length; i++)
			{
				face = this.faces[i];
				p0 = screen_coords[face[0]];
				p1 = screen_coords[face[1]];
				p2 = screen_coords[face[2]];
				p3 = screen_coords[face[3]];
				polygon([p0,p1,p2,p3],this.style);
			}
			// Draw lines.
			var p0,p1;
			for (var i = 0; i < this.lines.length; i++)
			{
				p0 = screen_coords[this.lines[i][0]];
				p1 = screen_coords[this.lines[i][1]];
				line(p0,p1,"rgb(0,0,0)");
			}
		}
	}

	function loop()
	{
		// Screen.
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillRect(0,0,W,H);
		if (start)
		{
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.font = "48px "+gameFont;
			ctx.textAlign = "center";
			ctx.fillText("Welcome to \"Fit Through Holes!\"",W/2,150);
			ctx.font = "24px "+gameFont;
			ctx.fillText("Don\'t let the red square hit the cubes!",W/2,250);
			ctx.fillText(
				"Use the A and D keys or the left and right arrow keys to move left and right."
				,W/2
				,350
				);
			ctx.fillText("Press :SPACE: to start.",W/2,450);
		}
		else if (lost)
		{
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.font = "48px "+gameFont;
			ctx.textAlign = "center";
			ctx.fillText("You crashed (Aw man!)",W/2,150);
			ctx.font = "24px "+gameFont;
			ctx.fillText("Cubes Avoided: "+Math.floor(score).toString(),W/2,250);
			ctx.fillText("Press :SPACE: to play again.",W/2,350);
		}
		else
		{
			if (frames % 100 == 0)
			{
				createCube();
			}
			++frames;
			// Score.
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.font = "48px "+gameFont;
			ctx.textAlign = "center";
			ctx.fillText(Math.floor(score).toString(),W/2,150);
			// Cubes.
			for (var i = 0; i < cubes.length; i++)
			{
				cubes[i].move(0,0,-.1);
				if (cubes[i].update() == -1)
				{
					score += .5;
					spaces.splice(i,1);
					cubes.splice(i,1);
					continue;
				}
			}
			// Square.
			ctx.fillStyle = "rgb(255,0,0)";
			ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
		}
	}

	window.onresize = function()
	{
		canvas.width = W = window.innerWidth;
		canvas.width = W = window.innerWidth;
	}

	window.onkeydown = function(event)
	{
		switch (event.which)
		{
			case 65: // A KEY.
			case 37: // LEFT ARROW.
				player[0] -= .3;
				if (player[0] < -8.25)
				{
					player[0] = -8.25;
				}
				break;

			case 68: // S KEY.
			case 39: // RIGHT ARROW.
				player[0] += .3;
				if (player[0] > 8.25)
				{
					player[0] = 8.25;
				}
				break;
			case 32: // SPACE BAR.
				if (start)
				{
					start = false;
				}
				else if (lost)
				{
					window.location.reload();
				}
				break;
			default:
				break;
		}
	}

	setInterval(loop,33);

	function createCube()
	{
		// First Cube.
		var cube1W = 11;
		var cubePos = -player[0] - randRange(5,10);
		var r = randRange(0,220).toString();
		var g = randRange(0,255).toString();
		var b = randRange(0,255).toString();
		cubes.push(new Cube(cube1W,1,1,[cubePos,0,7],"rgb("+r+","+g+","+b+")"));
		spaces.push(cubePos + 12);

		// Second Cube.
		var cube2W = 11;
		var xPos = cubePos + 13;
		cubes.push(new Cube(cube2W,1,1,[xPos,0,7],"rgb("+r+","+g+","+b+")"));
	}

	function randRange(lower, upper)
	{
		return lower + Math.round((upper - lower) * Math.random());
	}

	function all(bools)
	{
		for (var i = 0; i < bools.length; i++)
		{
			if (!bools[i])
			{
				return false;
			}
		}
		return true;
	}

};
