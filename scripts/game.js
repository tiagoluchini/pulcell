window.onload = function() {
	Crafty.init(SCREEN_WIDTH, SCREEN_HEIGHT);
	Crafty.canvas.init();
	
	Crafty.sprite(50, 50, "sprites/tile.png", {
		tile: [0, 0],
	});
	
	Crafty.scene("loading", function() {
		Crafty.load(["sprites/tile.png"], function() {
			Crafty.scene("game");
		});
	});
	
	Crafty.scene("game", function() {
		grid = Crafty.e("2D, ObjectGrid, Mouse")
			.attr({x: GRID_LEFT_MARGIN, y: GRID_TOP_MARGIN, w: GRID_SIZE * GRID_WIDTH, h: GRID_SIZE * GRID_HEIGHT})
			.ObjectGrid(GRID_SIZE, GRID_WIDTH, GRID_HEIGHT);
		console.log(grid);
	});
	
	Crafty.scene("loading");
}

