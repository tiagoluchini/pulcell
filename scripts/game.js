TILE_SIZE = 8;

function buildWallState(ax, ay, bx, by) {

	if (ax == bx) { ax += -1 }
	if (ax > bx) { 
		var tx = ax; var ty = ay;
		ax = bx; ay = by;
		bx = tx; by = ty;
	}
	
	var alpha = (by-ay)/(bx-ax);
	var beta = ay - alpha * ax;

	for (var i = ax; i <= bx; i += (bx-ax)/200) {
		var pos = fromXYToGrid(i, alpha*i+beta);
		grid_state[pos[0]][pos[1]] = 5;
	}

}

function fromXYToGrid(x, y) {
	console.log(x, y);
	col = Math.floor(x / TILE_SIZE);
	row = Math.floor(y / TILE_SIZE);
	return [col, row];
}

function fromGridToXY(col, row) {
	x = col * TILE_SIZE;
	y = row * TILE_SIZE;
	return [x, y];
}

function victory(score) {
        console.log("++++++++++++++++++++++ YOU WON ++++++++++++++++++++++")   
        console.log("++++++++++++++++++++++ SCORE "+score+" ++++++++++++++++++++++")
}

function gameOver() {
        console.log("++++++++++++++++++++++ YOU LOST ++++++++++++++++++++++")   
}


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

    Crafty.sprite(200, 200, "sprites/heart_anim_01.png", {
        heart: [0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6],
    });
	
	Crafty.sprite(800, 600, "sprites/terrain_01.png", {
		back: [0, 0],
	});
	
	Crafty.sprite(8, 8, "sprites/infection.png", {
		infection: [0, 0],
	});	
	
	Crafty.scene("loading", function() {
		Crafty.load(["sprites/tile.png", "sprites/terrain_01.png", "sprites/infection.png", "sprites/small_city.png", "sprites/medium_city.png", "sprites/big_city.png", "sprites/heart_anim_01.png"], function() {
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
	
	city_selected_state = false;
	
	
	Crafty.scene("game", function() {

		Crafty.background(Crafty.e("2D, Canvas, back").attr({z:0}));		

		event_dispatcher = Crafty.e("EventDispatcher").EventDispatcher()
			.attr({x:0, y:0, w:SCREEN_WIDTH, h:SCREEN_HEIGHT});

        numberOfActiveCities = 0
		
		var numberOfCities = 3;
		for(i=0; i<numberOfCities; i++){
    		var city = Crafty.e("City")
        		.City(truncate(Math.random() * col_count), truncate(Math.random() * row_count), truncate(Math.random() * 14));
            var wall_builder = Crafty.e("WallBuilder").WallBuilder(city)
                .attr({x:0, y:0, w:SCREEN_WIDTH, h:SCREEN_HEIGHT});
            city.setWallBuilder(wall_builder);
            numberOfActiveCities +=1; 
        }
        
		var infection = Crafty.e("Infection")
			.Infection(50, 37);


	});
	
	Crafty.scene("loading");
}


function truncate(_value)
{
  if (_value<0) return Math.ceil(_value);
  else return Math.floor(_value);
}