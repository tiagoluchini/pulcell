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
	Crafty.scene("victory");
}

function gameOver() {
	Crafty.scene("game_over");
}


window.onload = function() {
	Crafty.init(SCREEN_WIDTH, SCREEN_HEIGHT);
	Crafty.canvas.init();
	
	Crafty.sprite(50, 50, "sprites/tile.png", {
		tile: [0, 0],
	});

    Crafty.sprite(32, 32, "sprites/citymarker_32.png", {
        citySpriteSmall: [0, 0],
    });

    Crafty.sprite(48, 48, "sprites/citymarker_48.png", {
        citySpriteMedium: [0, 0],
    });

    Crafty.sprite(64, 64, "sprites/citymarker_64.png", {
        citySpriteBig: [0, 0],
    });

    Crafty.sprite(400, 400, "sprites/heart_anim_01.png", {
        heart: [0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6],
    });
	
	Crafty.sprite(800, 600, "sprites/terrain_03.png", {
		back: [0, 0],
	});

	Crafty.sprite(800, 600, "sprites/menu.png", {
		menu_back: [0, 0],
	});

	Crafty.sprite(146, 51, "sprites/play.png", {
		play: [0, 0],
	});

	Crafty.sprite(800, 600, "sprites/game_over.png", {
		end_game: [0, 0],
	});

	Crafty.sprite(468, 75, "sprites/game_over.png", {
		game_over: [0, 0],
	});

	Crafty.sprite(437, 76, "sprites/loading.png", {
		loading: [0, 0],
	});

	Crafty.sprite(359, 76, "sprites/victory.png", {
		victory: [0, 0],
	});

	Crafty.sprite(497, 86, "sprites/play_again.png", {
		play_again: [0, 0],
	});

	
	Crafty.sprite(8, 8, "sprites/infection.png", {
		infection: [0, 0],
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
	
	
	Crafty.scene("loading", function() {
		Crafty.load([
			"sprites/tile.png", "sprites/terrain_03.png", 
			"sprites/infection.png", "sprites/citymarker_32.png", 
			"sprites/citymarker_48", "sprites/citymarker_64.png", 
			"sprites/heart_anim_01.png", "sprites/menu.png",
			"sprites/play.png", "sprites/play_again.png",
			"sprites/end_game.png", "sprites/game_over.png",
			"sprites/victory.png", "sprites/loading.png"
			], 
			function() {
				Crafty.scene("menu");
			}
		);
	});
	
	Crafty.scene("menu", function() {
		Crafty.background(Crafty.e("2D, Canvas, menu_back").attr({z:0}));
		
		//sounds.mood_loop.play();
		
		var play = Crafty.e("2D, Canvas, play, Mouse").attr({x:80, y:290});
		
		var credits = Crafty.e("2D, Canvas, Text")
				.attr({ x: 20, y: 500, z: 10000 }).text("Tiago Luchini, Eduardo Schnel")
				.textColor('#FFFFFF').textFont({ size: '16px', weight: 'normal', family: 'Arial', type: '' });

		var credits2 = Crafty.e("2D, Canvas, Text")
				.attr({ x: 20, y: 530, z: 10000 }).text("Risto Ihalainen, Paulo Zambarda")
				.textColor('#FFFFFF').textFont({ size: '16px', weight: 'normal', family: 'Arial', type: '' });
		
		play.bind("Click", function() {
			Crafty.scene("game");
		});
		
	});
	
	Crafty.scene("game_over", function() {
		Crafty.background(Crafty.e("2D, Canvas, end_game").attr({z:0}));

		var game_over = Crafty.e("2D, Canvas, game_over").attr({x:180, y:220});
		
		var play_again = Crafty.e("2D, Canvas, play_again, Mouse").attr({x:150, y:420});
		
		play_again.bind("Click", function() {
			window.location.reload();
		});
	});

	Crafty.scene("victory", function() {
		Crafty.background(Crafty.e("2D, Canvas, end_game").attr({z:0}));

		var victory = Crafty.e("2D, Canvas, victory").attr({x:200, y:220});
		
		var play_again = Crafty.e("2D, Canvas, play_again, Mouse").attr({x:150, y:420});
		
		play_again.bind("Click", function() {
			window.location.reload();
		});
	});

	
	Crafty.scene("game", function() {

		sounds.heartbeat.play({loops: 9999999});
	    
		Crafty.background(Crafty.e("2D, Canvas, back").attr({z:0}));

		event_dispatcher = Crafty.e("EventDispatcher").EventDispatcher()
			.attr({x:0, y:0, w:SCREEN_WIDTH, h:SCREEN_HEIGHT});

        numberOfActiveCities = 0
		
		
		
		var numberOfCities = 3;
		for(i=0; i<numberOfCities; i++){
		    var found=false;
		    while(found==false){
    		    var tile = generate_random_tile();
    		    var col = tile[0];
    		    var row = tile[1];
    		    var distance=Math.sqrt( (col-col_count/2)*(col-col_count/2)+(row-row_count/2)*(row-row_count/2) );
    		    console.log(distance);
    		    if(distance > 22){found = true}
		    }
		    
    		var city = Crafty.e("City")
        		.City(col, row, truncate(Math.random() * 9)+3);
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

function generate_random_tile(){
    var col = truncate(Math.random() * (col_count-20))+10;
    var row = truncate(Math.random() * (row_count-20))+10;
    return [col,row];
}

function truncate(_value)
{
  if (_value<0) return Math.ceil(_value);
  else return Math.floor(_value);
}
