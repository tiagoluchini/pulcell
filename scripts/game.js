TILE_SIZE = 8;

window.onload = function() {
	Crafty.init(SCREEN_WIDTH, SCREEN_HEIGHT);
	Crafty.canvas.init();
	
	Crafty.sprite(50, 50, "sprites/tile.png", {
		tile: [0, 0],
	});

    Crafty.sprite(50, 50, "sprites/city.png", {
        citySprite: [0, 0],
    });
	
	Crafty.sprite(800, 600, "sprites/grass.jpg", {
		grass: [0, 0],
	});
	
	Crafty.sprite(8, 8, "sprites/infection.png", {
		infection: [0, 0],
	});	
	
	Crafty.scene("loading", function() {
		Crafty.load(["sprites/tile.png", "sprites/grass.jpg", "sprites/infection.png", "sprites/city.png"], function() {
			Crafty.scene("game");
		});
	});

    col_count = SCREEN_WIDTH/TILE_SIZE;
    row_count = SCREEN_HEIGHT/TILE_SIZE;

    grid_state = new Array(col_count);
    for (var i = 0; i < col_count; i++) {
        grid_state[i] = new Array(row_count);
        for (var j = 0; j < row_count; j++) {
            grid_state[i][j] = 0;
        }
    }
		
	
	
	Crafty.scene("game", function() {
/*
		grid = Crafty.e("2D, ObjectGrid, Mouse")
			.attr({x: GRID_LEFT_MARGIN, y: GRID_TOP_MARGIN, w: GRID_SIZE * GRID_WIDTH, h: GRID_SIZE * GRID_HEIGHT})
			.ObjectGrid(GRID_SIZE, GRID_WIDTH, GRID_HEIGHT);
		console.log(grid);
*/

//		Crafty.background(Crafty.e("2D, Canvas, grass").attr({z:0}));
		

//		var line = Crafty.e("Line").attr({z:1000});
//		Crafty.addEvent(this, Crafty.stage.elem, "mousemove", function(e) {
			
//		    var pos = Crafty.DOM.translate(e.clientX, e.clientY);
//		    line.Line(150, 100, pos.x, pos.y);
//		});

		event_dispatcher = Crafty.e("EventDispatcher").EventDispatcher()
			.attr({x:0, y:0, w:SCREEN_WIDTH, h:SCREEN_HEIGHT});


		var city = Crafty.e("City")
    		.City(37, 36, 6);

		var wall_builder = Crafty.e("WallBuilder").WallBuilder(city)
			.attr({x:0, y:0, w:SCREEN_WIDTH, h:SCREEN_HEIGHT});
	
		city.setWallBuilder(wall_builder);
	
//		var wall = Crafty.e("Line").Line(500, 100, 400, 500);
		
//		var infection = Crafty.e("Infection")
//			.Infection(50, 37)
//			.buildWall(500, 100, 400, 500);



	});
	
	Crafty.scene("loading");
}

