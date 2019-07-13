window.onload = function() {

	var canvas = document.getElementById("GamePanel");
	var ctx = canvas.getContext("2d");
	var W,H;

	canvas.width = W = window.innerWidth;
	canvas.height = H = window.innerHeight;

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

	window.onmousemove = function(event) { mouse.x = event.x;mouse.y = event.y; }
	window.onmousedown = function(event) { mouse.click = true; }
	window.onmouseup = function(event) { mouse.click = false; }

	var dt,hs,ms,ss;

	setInterval(function()
	{
		dt = new Date();
		// Fill screen with white.
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillRect(0,0,W,H);
		// Setup render.
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.font = "48px Envy Code R";
		ctx.textAlign = "center";
		// Get date.
		hs = dt.getHours().toString();
		ms = dt.getMinutes().toString();
		ss = dt.getSeconds().toString();
		// Process Date
		if (hs.length == 1)
		{
			hs = "0" + hs;
		}
		if (ms.length == 1)
		{
			ms = "0" + ms;
		}
		if (ss.length == 1)
		{
			ss = "0" + ss;
		}
		// Render date.
		ctx.fillText(hs+":"+ms+":"+ss,W/2,H/2);
	},33);

	function randRange(lower,upper)
	{
		return lower + Math.round((upper - lower) * Math.random());
	}

	function render(y,text,size,color)
	{
		ctx.fillStyle = color;
		ctx.font = size.toString() + "px Envy Code R";
		ctx.textAlign = "center";
		ctx.fillText(text,W/2,y);
	}

};
