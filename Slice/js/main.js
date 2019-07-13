window.onload = function() {

	// Math functions.
	function toRadians(x)
	{
		return x * Math.PI / 180;
	}

	function toDegrees(x)
	{
		return x * 180 / Math.PI;
	}

	function pythagorean(a,b)
	{
		return Math.sqrt(a * a + b * b)
	}

	var canvas = document.getElementById("GamePanel");
	var ctx = canvas.getContext("2d");

	var W,H;

	canvas.width = W = window.innerWidth;
	canvas.height = H = window.innerHeight;

	var numHues = 120;
	var circleRad = 300;

	var score = 0;

	var gameState = "START";

	var player = {
		x: W/2,
		y: H/2,
		rad: 50,
		core: 15,
		angle: 0,
		thickness: 3,

		style: "rgb(0,0,255)",

		draw: function()
		{
			circle(this.x,this.y,this.rad,this.style);
			circle(this.x,this.y,this.core,"rgb(0,0,0)");
			pts = [];
			for (var i = 0; i < this.thickness; i++)
			{
				pts.push(
					[
					this.x + Math.cos(toRadians(this.angle + i)) * this.rad,
					this.y + Math.sin(toRadians(this.angle + i)) * this.rad
					]
					);
				pts.push(
					[
					this.x + Math.cos(toRadians(this.angle - (180 - i))) * this.rad,
					this.y + Math.sin(toRadians(this.angle - (180 - i))) * this.rad
					]
					);
				pts.push(
					[
					this.x + Math.cos(toRadians(this.angle - i)) * this.rad,
					this.y + Math.sin(toRadians(this.angle - i)) * this.rad
					]
					);
				pts.push(
					[
					this.x + Math.cos(toRadians(this.angle - (180 + i))) * this.rad,
					this.y + Math.sin(toRadians(this.angle - (180 + i))) * this.rad
					]
					);
			}
			for (var i = 0; i < pts.length; i += 2)
			{
				line(pts[i],pts[i+1]);
			}
		}
	}

	function Projectile(angle)
	{
		this.angle = angle;

		this.x = W/2 + Math.cos(toRadians(this.angle)) * (circleRad - 20);
		this.y = H/2 + Math.sin(toRadians(this.angle)) * (circleRad - 20);

		this.xChange = (this.x - W/2) / (100 - score / 2);
		this.yChange = (this.y - H/2) / (100 - score / 2);

		this.rad = 2;

		this.draw = function()
		{
			circle(this.x,this.y,this.rad,"rgb(0,255,0)");
		}

		this.update = function()
		{
			this.x -= this.xChange;
			this.y -= this.yChange;
			
			if (pythagorean(W/2 - this.x,H/2 - this.y) >= circleRad)
			{
				return -1;
			}
			if (collision(this.x,player.x,this.y,player.y,this.rad,player.rad))
			{
				var diff = (player.angle % 180) - (this.angle % 180);
				console.log(diff);
				if (-player.thickness <= diff && diff <= player.thickness)
				{
					return;
				}
				else if (-180 + player.thickness >= diff && diff >= -180 - player.thickness)
				{
					return;
				}
				else
				{
					gameState = "LOST";
				}
			}
			return 1;
		}
	}

	function line(p0,p1,style)
	{
		ctx.beginPath();
		ctx.strokeStyle = style;
		ctx.moveTo(p0[0],p0[1]);
		ctx.lineTo(p1[0],p1[1]);
		ctx.stroke();
	}

	function circle(x,y,rad,style)
	{
		ctx.beginPath();
		ctx.fillStyle = style;
		ctx.arc(x,y,rad,0,2*Math.PI);
		ctx.fill();
	}

	function drawHues()
	{
		var count = -1;
		for (var y = 0; count < numHues; y += H / numHues)
		{
			++count;
			ctx.fillStyle = "rgb(" + (count + 50).toString() + ",50,50)";
			ctx.fillRect(0,y,W,H / numHues);
		}
	}

	function drawOuterCircle()
	{
		var x,y;
		for (var i = 0; i < 360; i++)
		{
			x = W/2 + Math.cos(i) * circleRad;
			y = H/2 + Math.sin(i) * circleRad;

			circle(x,y,4,"rgb(0,0,0)");
		}
	}

	function updateProjectiles()
	{
		for (var i = 0; i < projectiles.length; i++)
		{
			if (projectiles[i].update() == -1)
			{
				++score;
				projectiles.splice(i,1);
				continue;
			}
		}
	}

	function drawProjectiles()
	{
		for (var i = 0; i < projectiles.length; i++)
		{
			projectiles[i].draw();
		}
	}

	function spawnProjectiles() { if (projectiles.length == 0) { projectiles.push(new Projectile(randInt(1,360))); } }

	var projectiles = [new Projectile(randInt(1,360))];

	setInterval(function()
	{
		drawHues(); // Makes the background feel ambient.
		if (gameState == "START")
		{
			render(150,"SLICE",48,"rgb(0,0,0)","Monaco");
			render(250,"Press <1> to play.",36,"rgb(0,0,0)","Monaco");
			render(350,"Press <2> for rules.",36,"rgb(0,0,0)","Monaco");
		}
		else if (gameState == "RULES")
		{
			render(150,"RULES",48,"rgb(0,0,0)","Monaco");
			render(250,"Use the left and right arrow keys to rotate left and right.",24,"rgb(0,0,0)","Monaco");
			render(350,"Move the green circles through the middle of the blue circle",24,"rgb(0,0,0)","Monaco");
			render(450,"Press <1> to play.",24,"rgb(0,0,0)","Monaco");

		}
		else if (gameState == "GAME")
		{
			spawnProjectiles();
			drawOuterCircle(); // Draw bounding circle.
			player.draw(); // Draw player.
			updateProjectiles(); // Update projectiles.
			drawProjectiles(); // Draw projectiles coming at player.
			render(25,"Press <2> for rules.",24,"rgb(0,0,0)","Monaco");
			render(65,"Score: " + score.toString(),24,"rgb(0,0,0)","Monaco");
		}
		else if (gameState == "LOST")
		{
			render(150,"Good Try.",48,"rgb(0,0,0)","Monaco");
			render(250,"Final score: "+score.toString(),36,"rgb(0,0,0)","Monaco");
			render(350,"Press <1> to play again.",36,"rgb(0,0,0)","Monaco");
			render(450,"Press <2> to review the rules",36,"rgb(0,0,0)","Monaco");
		}
	},33)

	window.onresize = function()
	{
		canvas.width = W = window.innerWidth;
		canvas.height = H = window.innerHeight;
	}

	window.onkeydown = function(evt)
	{
		switch (evt.which)
		{
			case 37: // LEFT ARROW KEY.
				player.angle -= 3;
				break;
			case 39: // RIGHT ARROW KEY.
				player.angle += 3;
				break;
			case 49: // 1 KEY.
				if (gameState == "LOST") { window.location.reload();break; }
				if (gameState != "LOST") { gameState = "GAME"; }
				break;
			case 50: // 2 KEY.
				gameState = "RULES";
				break;
			case 51: // 3 KEY.
				break;
			default:
				break;
		}
	}

	function randInt(MIN,MAX) { return MIN + Math.round(Math.random() * MAX - MIN); }

	function collision(x1,x2,y1,y2,r1,r2) { return pythagorean(x1 - x2,y1 - y2) < r1 + r2; }

	function render(y,text,size,color,face)
	{
		ctx.font = size.toString() + "px " + face;
		ctx.fillStyle = color;
		ctx.textAlign = "center";
		ctx.fillText(text,W/2,y);
	}

};
