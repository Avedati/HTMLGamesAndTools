window.onload = function() {

	var

	canvas,
	ctx,

	boardSize = 6,

	board;

	(function()
	{
		canvas = (function()
		{
			var c = document.createElement("canvas");

			c.width = window.innerWidth;
			c.height = window.innerHeight;

			document.body.appendChild(c);
			return c;
		})();

		ctx = canvas.getContext("2d");

		board = (function(w,h)
		{
			var arr = new Array();
			for (var i = 0; i < w * h; i++) { arr.push(i); }
			arr[arr.length - 1] = -1;
			return arr;
		})(boardSize, boardSize);
	})();

	function update()
	{

	}

	function render()
	{
		// Fill screen with white.
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillRect(0,0,W(),H());
		// Draw array.
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.font = (W() < H() ? W() / boardSize : H() / boardSize) + "px Ubuntu Mono";
		for (var y = 0; y < boardSize; y++)
		{
			for (var x = 0; x < boardSize; x++)
			{
				if (board[y*boardSize+x] == -1) { continue; }
				ctx.fillText(board[y*boardSize+x] + "", x*W()/boardSize,y*H()/boardSize+100);
			}
		}
	}

	function findTile(param) { for (var i = 0; i < board.length; i++) { if (board[i] == param) { return i; } } }

	function adj()
	{
		var tile = findTile(-1);
		var a = (tile - boardSize >= 0 ? tile - boardSize : null);
		var b = (tile + boardSize < boardSize**2 ? tile + boardSize : null);
		var c = (tile % boardSize != 0 ? tile - 1 : null);
		var d = (tile % boardSize != boardSize ? tile + 1 : null);

		var arr = new Array();
		if (a != null) { arr.push(a); }
		if (b != null) { arr.push(b); }
		if (c != null) { arr.push(c); }
		if (d != null) { arr.push(d); }

		return arr;
	}

	function swap(j)
	{
		var a = adj();
		var good = false;
		for (var i = 0; i < a.length; i++) { if (j == a[i]) { good = true; } }
		if (!good) { return; }

		var i = findTile(-1);
		board[i] = board[j];
		board[j] = -1;
	}

	function W() { return canvas.width;  }
	function H() { return canvas.height; }

	function randInt(MIN, MAX) { return MIN + Math.round(Math.random() * (MAX - MIN)); }

	window.onmousedown = function(evt)
	{
	}

	setInterval(function()
	{
		update();
		render();
	})

}
