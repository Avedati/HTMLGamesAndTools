window.onload = function() {

	var canvas = document.getElementById("GamePanel");
	var ctx = canvas.getContext("2d");
	var W,H;

	canvas.width = W = window.innerWidth;
	canvas.height = H = window.innerHeight;

	function pythagorean(a,b)
	{
		return Math.sqrt(a * a + b * b);
	}

	function Circle(x,y,style)
	{
		this.x = x;
		this.y = y;
		
		this.rad = 12;
		
		this.style = style;

		this.update = function(player)
		{
			// Check.
			if (player.collides(this))
			{
				switch (this.style)
				{
					case "rgb(255,0,0)":
						lost = true;
						break;
					case "rgb(0,0,255)":
						score++;
						break;
					default:
						break;
				}
				return -1;
			}
			if (this.y >= H)
			{
				return -1;
			}
			// Draw.
			ctx.beginPath();
			ctx.fillStyle = this.style;
			ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
			ctx.fill();
		}

		this.collides = function(other)
		{
			return pythagorean(this.x - other.x, this.y - other.y) < this.rad + other.rad;
		}
	}

	var circles = [];
	var player = new Circle(0,0,"rgb(0,0,0)");
	var score = 0;
	var mouseClick = false;

	player.update = function()
	{
		// Draw.
		ctx.beginPath();
		ctx.fillStyle = this.style;
		ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
		ctx.fill();
	}
	
	var frames = 0;
	var lost = false;
	var start = true;

	window.onresize = function()
	{
		canvas.width = W = window.innerWidth;
		canvas.height = H = window.innerHeight;
	}

	setInterval(function()
	{
		// Fill screen with gray.
		ctx.fillStyle = "rgb(200,200,200)";
		ctx.fillRect(0,0,W,H);
		if (start)
		{
			render(150,"Selector (BETA)",48,"rgb(255,255,255)");
			button(250,"Test",36,["rgb(100,100,100)","rgb(0,0,0)"],function(){start = false;});
		}
		else if (lost)
		{
			render(150,"Good Try",48,"rgb(255,255,255)");
			render(250,"Final score: "+score.toString(),36,"rgb(255,255,255)");
			button(350,"Play again",36,["rgb(100,100,100)","rgb(0,0,0)"],function(){window.location.reload();});
		}
		else
		{
			// Update game state.
			++frames;
			if (frames % 10 == 0)
			{
				spawn();
			}
			// Draw circles.
			for (var i = 0; i < circles.length; i++)
			{
				circles[i].y += 25;
				if (circles[i].update(player) == -1)
				{
					circles.splice(i,1);
					continue;
				}
			}
			// Draw player.
			player.update();
			// Draw score.
			ctx.fillStyle = "rgb(255,255,255)";
			ctx.font = "48px Envy Code R";
			ctx.textAlign = "center";
			ctx.fillText(score.toString(),W/2,H/2);
		}
	},33);

	window.onmousemove = function(event)
	{
		player.x = event.x;
		player.y = event.y;
	}

	window.onkeydown = function(event)
	{
		if (event.which == 32 && lost)
		{
			window.location.reload();
		}
	}
	window.onmousedown = function() { mouseClick = true; }
	window.onmouseup = function()   { mouseClick = false; }

	function randRange(a,b)
	{
		return a + Math.round((b - a) * Math.random());
	}

	function spawn()
	{
		circles.push(new Circle(randRange(0,W - 24),0,randRange(1,40) != 20 ? "rgb(255,0,0)" : "rgb(0,0,255)"));
	}

	function render(y,text,size,color)
	{
		ctx.fillStyle = color;
		ctx.font = size.toString() + "px Envy Code R";
		ctx.textAlign = "center";
		ctx.fillText(text,W/2,y);
	}

	function button(y,text,size,colors,func)
	{
		var color = 0;
		if (W / 2 - size / 2 <= player.x && player.x <= W / 2 + size / 2 && y - size / 2 <= player.y && player.y <= y + size / 2)
		{
			color = 1;
			if (mouseClick)
			{
				func();
			}
		}
		render(y,text,size,colors[color]);
	}

};
