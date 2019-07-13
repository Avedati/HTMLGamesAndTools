window.onload = function() {
	var canvas = document.getElementById("GamePanel"),
			ctx = canvas.getContext("2d"),
			pts = [];

	canvas.style.marginLeft = Math.round(window.innerWidth / 2 - canvas.width / 2).toString() + "px";
	canvas.style.marginTop = Math.round(window.innerHeight / 2 - canvas.height / 2).toString() + "px";

	function circle(x,y,rad,style)
	{
		ctx.beginPath();
		ctx.fillStyle = style;
		ctx.arc(x,y,rad,0,2*Math.PI);
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

	function drawGraph()
	{
		ctx.fillStyle = "rgb(187,187,187)";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		for (var y = 1; y < 22; y++)
		{
			line([0, y * (canvas.height / 22)], [canvas.width, y * (canvas.height / 22)], "rgb(0,0,0)");
		}
		for (var x = 1; x < 22; x++)
		{
			line([x * (canvas.width / 22), 0], [x * (canvas.width / 22), canvas.height], "rgb(0,0,0)");
		}
		circle(canvas.width / 2, canvas.height / 2,4,"rgb(0,0,0)");
	}

	function drawPoints()
	{
		for (var i = 0; i < pts.length; i++)
		{
			circle(pts[i][0],pts[i][1],4,"rgb(255,0,0)");
		}
	}

	function pxToInt(px)
	{
		var arr = px.split("");
		var str = "";
		
		for (var i = 0; i < arr.length; i++)
		{
			if (arr[i] == "p") { break }
			str += arr[i]
		}

		return parseInt(str); 
	}

	setInterval(function()
	{
		drawGraph();
		drawPoints();
	},33);

	window.onresize = function()
	{
		canvas.style.marginLeft = Math.round(window.innerWidth / 2 - canvas.width / 2).toString() + "px";
		canvas.style.marginTop = Math.round(window.innerHeight / 2 - canvas.height / 2).toString() + "px";
	}

	window.onclick = function(evt)
	{
		pts.push([evt.clientX - pxToInt(canvas.style.marginLeft),evt.clientY - pxToInt(canvas.style.marginTop)]);
	}
}
