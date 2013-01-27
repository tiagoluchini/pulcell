
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
		
		this.isInvaded=false;
		
        this.start_col = start_col; 
        this.start_row = start_row;

        var xy = this.fromGridToXY(this.start_col, this.start_row);

		var size;
		if (power < 5) {
			size = 4;
	        var city_sprite = Crafty.e("2D, Canvas, citySpriteSmall")
            .attr({x: xy[0], y: xy[1]});
		} else if (power < 10) {
			size = 6;
            var city_sprite = Crafty.e("2D, Canvas, citySpriteMedium")
            .attr({x: xy[0], y: xy[1]});
		} else {
			size = 8;
            var city_sprite = Crafty.e("2D, Canvas, citySpriteBig")
            .attr({x: xy[0], y: xy[1]});
		}

        this.attr({x: xy[0], y: xy[1], w:size*TILE_SIZE, h:size*TILE_SIZE});
		
        for (i=0; i<size; i++) {
    		for (j=0; j<size; j++) {
    		    grid_state[start_col+i][start_row+j]=6;
    		    grid_cities[start_col+i][start_row+j]=this;
    		}
        }

		event_dispatcher.addListener(this, "Click", function(e) {
			if (!city_selected_state) {
				this.wall_builder.activate();
				city_selected_state = true;
				return true;
			}
		})

		return this;
	},

    invaded: function() {
        //console.log("City invaded ############");
        if(this.isInvaded == false){
            numberOfActiveCities -= 1;
            
            if(numberOfActiveCities==0){
                gameOver();
            }
        }
        
        this.isInvaded=true;
        this.wall_builder.killOrders();
    },

	setWallBuilder: function(wb) {
		this.wall_builder = wb;
	}
		
});