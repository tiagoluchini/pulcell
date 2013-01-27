TILE_SIZE = 8;

window.onload = function() {
	Crafty.init(SCREEN_WIDTH, SCREEN_HEIGHT);
	Crafty.canvas.init();
	
	Crafty.sprite(50, 50, "sprites/tile.png", {
		tile: [0, 0],
	});

    Crafty.sprite(32, 32, "sprites/small_city.png", {
        citySpriteSmall: [0, 0],
    });

    Crafty.sprite(48, 48, "sprites/medium_city.png", {
        citySpriteMedium: [0, 0],
    });

    Crafty.sprite(64, 64, "sprites/big_city.png", {
        citySpriteBig: [0, 0],
    });
	
	Crafty.sprite(800, 600, "sprites/grass.jpg", {
		grass: [0, 0],
	});
	
	Crafty.sprite(8, 8, "sprites/infection.png", {
		infection: [0, 0],
	});	
	
	Crafty.scene("loading", function() {
		Crafty.load(["sprites/tile.png", "sprites/grass.jpg", "sprites/infection.png", "sprites/small_city.png", "sprites/medium_city.png", "sprites/big_city.png"], function() {
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

    grid_cities = new Array(col_count);
    for (var i = 0; i < col_count; i++) {
        grid_cities[i] = new Array(row_count);
        for (var j = 0; j < row_count; j++) {
            grid_cities[i][j] = 0;
        }
    }
		
	
	
	Crafty.scene("game", function() {
/*
		grid = Crafty.e("2D, ObjectGrid, Mouse")
			.attr({x: GRID_LEFT_MARGIN, y: GRID_TOP_MARGIN, w: GRID_SIZE * GRID_WIDTH, h: GRID_SIZE * GRID_HEIGHT})
			.ObjectGrid(GRID_SIZE, GRID_WIDTH, GRID_HEIGHT);
		console.log(grid);
*/

		Crafty.background(Crafty.e("2D, Canvas, grass").attr({z:0}));
		

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

        var city2 = Crafty.e("City")
            .City(31, 31, 4);
        var wall_builder2 = Crafty.e("WallBuilder").WallBuilder(city2)
            .attr({x:0, y:0, w:SCREEN_WIDTH, h:SCREEN_HEIGHT});
        city2.setWallBuilder(wall_builder2);

		
//		var wall = Crafty.e("Line").Line(500, 100, 400, 500);

        var wall1 = Crafty.e("Line").Line(500, 401, 100, 401);
        var wall3 = Crafty.e("Line").Line(100, 401, 100, 201);
        var wall4 = Crafty.e("Line").Line(100, 201, 400, 201);
        var wall5 = Crafty.e("Line").Line(400, 201, 500, 401);
		
		var infection = Crafty.e("Infection")
			.Infection(50, 37);

		infection.buildWall(500, 401, 100, 401)
		infection.buildWall(100, 401, 100, 201)
		infection.buildWall(100, 201, 400, 201)
		infection.buildWall(400, 201, 500, 401)



	});
	
	Crafty.scene("loading");
}
