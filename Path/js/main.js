window.onload = function() {

	var canvas = document.getElementById("GamePanel");
	var ctx = canvas.getContext("2d");
	var W,H;

	canvas.width = W = window.innerWidth;
	canvas.height = H = window.innerHeight;

	var blockSize = 50;

	var rad = pythagorean(blockSize,blockSize);

	function Block(x,y,w,h,style)
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.style = style;

		this.draw = function(yDist)
		{
			ctx.fillStyle = this.style;
			ctx.fillRect(this.x,this.y + yDist,this.w,this.h);
			if (this.y + yDist < 0)
			{
				return -1;
			}
			if (player[0] == this.x && H - blockSize == this.y + yDist)
			{
				return 0;
			}
			return 1;
		}
	}

	var blockStyle = [0,20,0];

	var path = [new Block(W/2 - blockSize,H - blockSize,blockSize,blockSize,toRGB(blockStyle))];

	var frames = 0;

	var player = [W/2 - blockSize,H - blockSize,blockSize,blockSize];

	var start = true;

	var lost = false;

	var score = 0;

	var mouse = {
		x: 0,
		y: 0,
		click: false
	};

	window.onresize = function()
	{
		canvas.width = W = window.innerWidth;
		canvas.height = H = window.innerHeight;
	}

	window.onkeydown = function(event)
	{
		if (!lost && !start)
		{	
			++score;
			switch (event.which)
			{
				case 87: // W KEY.
				case 38: // UP ARROW.
					player[1] -= player[3];
					break;
				case 83: // S KEY.
				case 40: // DOWN ARROW.
					player[1] += player[3];
					break;
				case 65: // A KEY.
				case 37: // LEFT ARROW.
					player[0] -= player[2];
					break;
				case 68: // D KEY.
				case 39: // RIGHT ARROW.
					player[0] += player[2];
					break;
				default:
					--score;
					break;
			}
		}
	}

	window.onmousemove = function(event)
	{
		mouse.x = event.x;
		mouse.y = event.y;
	}

	window.onmouseup = function(event)
	{
		mouse.click = false;
	}

	window.onmousedown = function(event)
	{
		mouse.click = true;
	}

	setInterval(function()
	{
		// Fill screen with black.
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(0,0,W,H);
		if (start)
		{
			render(150,"PATH",48,"rgb(255,255,255)","ChalkDuster");
			render(250,
				"Don\'t go off the path, and don\'t let the path go to the top of the screen",
				36,
				"rgb(255,255,255)",
				"ProggyCleanTT"
				);
			button(350,
				"TEST",
				36,
				["rgb(200,200,200)","rgb(255,255,255)"],
				"ProggyCleanTT",
				function()
				{
					start = false;
				}
				);
		}
		else if (lost)
		{
			render(150,"Good Try",48,"rgb(255,255,255)","ProggyCleanTT");
			render(250,"Final Score: "+score.toString(),36,"rgb(255,255,255)","ProggyCleanTT");
			button(350,
				"Play Again",
				36,
				["rgb(200,200,200)","rgb(255,255,255)"],
				"ProggyCleanTT",
				function()
				{
					window.location.reload();
				}
				);
		}
		else
		{
			// Update game state.
			++frames;
			if (frames % 7 == 0)
			{
				genPath();
			}
			// Draw path.
			var x;
			var test = true;
			for (var i = 0; i < path.length; i++)
			{
				x = path[i].draw((H-blockSize)-player[1]);
				if (x == -1)
				{
					lost = true;
				}
				else if (x == 0)
				{
					test = false;
				}
			}
			if (test)
			{
				lost = true;
			}
			// Draw player.
			ctx.fillStyle = "rgb(255,0,0)";
			ctx.fillRect(player[0],H-blockSize,player[2],player[3]);
			// Draw score.
			render(H/2,score.toString(),48,"rgb(255,255,255)","ProggyCleanTT");
		}
	},33);

	function randRange(lower,upper)
	{
		return lower + Math.round((upper - lower) * Math.random());
	}

	function toRGB(string)
	{
		return "rgb(" + string[0].toString() + "," + string[1].toString() + "," + string[2].toString() + ")";
	}

	function render(y,text,size,color,face)
	{
		ctx.fillStyle = color;
		ctx.font = size.toString() + "px "+face;
		ctx.textAlign = "center";
		ctx.fillText(text,W/2,y);
	}

	function button(y,text,size,colors,face,func)
	{
		var WnH = ctx.measureText(text);
		var rect = [W/2-WnH.width/2,y-size/2,WnH.width,size];

		var color = 0;

		if (rect[0]<=mouse.x&&mouse.x<=rect[0]+rect[2]&&rect[1]<=mouse.y&&mouse.y<=rect[1]+rect[3])
		{
			color = 1;
			if (mouse.click)
			{
				func();
			}
		}

		render(y,text,size,colors[color],face);
	}

	function genPath()
	{
		var pts;
		var r = randRange(1,6)
		if (1 <= r && r <= 4)
		{
			pts = [path[path.length - 1].x,path[path.length - 1].y - blockSize];
		}
		else if (r == 5)
		{
			pts = [path[path.length - 1].x - blockSize,path[path.length - 1].y];
		}
		else if (r == 6)
		{
			pts = [path[path.length - 1].x + blockSize,path[path.length - 1].y];
		}

		if (pts[0] < 0)
		{
			pts = [path[path.length - 1].x + blockSize,path[path.length - 1].y];
		}

		if (pts[0] + blockSize > W)
		{
			pts = [path[path.length - 1].x - blockSize,path[path.length - 1].y];
		}

		blockStyle[1]+=10;
		if (blockStyle[1] >= 255) { blockStyle[1] = 20; }

		path.push(new Block(pts[0],pts[1],blockSize,blockSize,toRGB(blockStyle)));
	}

	function pythagorean(a,b) { return Math.sqrt(a * a + b * b); }

}
