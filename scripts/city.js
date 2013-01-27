
Crafty.c("City", {
	
	init: function() {
        this.requires("Canvas, 2D");
    },
    	
    fromXYToGrid: function(x, y) {
        col = Math.floor(x / TILE_SIZE);
        row = Math.floor(y / TILE_SIZE);
        return [col, row];
    },
    
    fromGridToXY: function(col, row) {
        x = col * TILE_SIZE;
        y = row * TILE_SIZE;
        return [x, y];
    },
    	
    	
	City: function(start_col, start_row, power) {
		this.power = power;
		
		var size;
		if (power < 5) {
			size = 4;
		} else if (power < 10) {
			size = 6;
		} else {
			size = 8;
		}

		this.start_col = start_col; 
		this.start_row = start_row;

        var xy = this.fromGridToXY(this.start_col, this.start_row);
        var city_sprite = Crafty.e("2D, Canvas, citySprite")
                    .attr({x: xy[0], y: xy[1]});
        this.attr({x: xy[0], y: xy[1], w:size*TILE_SIZE, h:size*TILE_SIZE});
		
        for (i=0; i<size; i++) {
    		for (j=0; j<size; j++) {
    		    grid_state[start_col+i][start_row+j]=6;
    		}
        }

		event_dispatcher.addListener(this, "Click", function(e) { 
			console.log('click city');
			this.wall_builder.activate();
			return true;
		})

		return this;
	},
	
	setWallBuilder: function(wb) {
		this.wall_builder = wb;
	}
		
});