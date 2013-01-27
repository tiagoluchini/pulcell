Crafty.c("Infection", {
	
	ready: true,
	
	init: function() {
        this.requires("Canvas, 2D, Delay");
    },
    	
	Infection: function(start_col, start_row) {
		
		this.growth_cycle = 50;
		this.growth_rate = 0.2;
		
		this.start_col = start_col; 
		this.start_row = start_row;
		
		this.col_count = SCREEN_WIDTH/TILE_SIZE;
		this.row_count = SCREEN_HEIGHT/TILE_SIZE;
		this.volume_count = 0;
		
		this.draw_queue = [
			[this.start_col, this.start_row - 1],
			[this.start_col, this.start_row + 1],
			[this.start_col + 1, this.start_row],
			[this.start_col - 1, this.start_row],
			[this.start_col - 1, this.start_row + 1],
			[this.start_col + 1, this.start_row + 1],
			[this.start_col + 1, this.start_row - 1],
			[this.start_col - 1, this.start_row - 1]
		];
		
		this.just_drawn = [];

		this.delay(function() { this.grow(); }, this.growth_cycle);
		
		var xy = this.fromGridToXY(this.start_col, this.start_row);
		
		this.attr({
			x: xy[0],
			y: xy[1],
			w: xy[0]+TILE_SIZE, h: xy[1]+TILE_SIZE
		});
		
		return this;
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

    lost: function() {
        console.log("++++++++++++++++++++++ YOU LOST ++++++++++++++++++++++")	
    },

    won: function() {
        console.log("++++++++++++++++++++++ YOU WON ++++++++++++++++++++++")   
        console.log("++++++++++++++++++++++ SCORE "+this.getScore()+" ++++++++++++++++++++++")   
    },

    getScore: function() {
        return this.col_count*this.row_count - this.volume_count;
    },
    
	grow: function() {
		var how_many = 1 + this.volume_count/75;
		if (how_many < 1) {how_many = 1}
		
		for (j=0; j<how_many; j++) {
            //Check end of game LOST
            if( this.draw_queue.length == 0){
                this.won();    
                return;
            }

			var index = this.truncate(Math.random() * this.draw_queue.length);
			var tile_to_draw = this.draw_queue[index];

            //Check end of game LOST
            if( tile_to_draw[0]==0 ||
                tile_to_draw[0]==this.col_count ||
                tile_to_draw[1]==0 ||
                tile_to_draw[1]==this.row_count){
                this.lost();    
                return;
            }

			this.draw_queue.splice(index,1);

			var free_spots = this.freeGridSpots(tile_to_draw[0], tile_to_draw[1]);

			for (i = 0; i < free_spots.length; i++) {
				var tuplet = [free_spots[i][0], free_spots[i][1]];
				
				var contains = false;
				for(k=0; k<this.draw_queue.length; k++){
				    var queue_obj = this.draw_queue[k];
				    if(queue_obj[0]==tuplet[0] && queue_obj[1]==tuplet[1]){
				        contains = true;
				        break;
				    }
				}
				
                if (!contains) {
                    this.draw_queue.push(tuplet);
                }
			}

            var xy = this.fromGridToXY(tile_to_draw[0], tile_to_draw[1]);
            var tile = Crafty.e("2D, Canvas, infection")
                .attr({x: xy[0], y: xy[1]});
            grid_state[tile_to_draw[0]][tile_to_draw[1]] = 2;
            this.volume_count++;
		}
		


        this.attr({
            x: this.x - 1,
            y: this.y - 1,
            w: this.w + 1, h: this.h + 1
        });
		
		//if(this.volume_count<4000){
		    this.delay(function() { this.grow(); }, this.growth_cycle);
		//}
		//return this;
	},


    freeGridSpot: function(out, col, row) {
        if (grid_state[col][row] == 0) { 
            out.push([col, row]) 
        }else if(grid_state[col][row] == 6){ 
            grid_cities[col][row].invaded()
            out.push([col, row]); 
        }
    },
    	
	freeGridSpots: function(col, row) {
		var out = [];
		
		this.freeGridSpot(out, col, row+1);
        this.freeGridSpot(out, col, row-1);
        this.freeGridSpot(out, col+1, row+1);
        this.freeGridSpot(out, col+1, row);
        this.freeGridSpot(out, col+1, row-1);
        this.freeGridSpot(out, col-1, row+1);
        this.freeGridSpot(out, col-1, row);
        this.freeGridSpot(out, col-1, row-1);

		return out;
	},
	
	buildWall: function(ax, ay, bx, by) {

		if (ax == bx) { ax += -1 }
		if (ax > bx) { 
			var tx = ax; var ty = ay;
			ax = bx; ay = by;
			bx = tx; by = ty;
		}
		
		var alpha = (by-ay)/(bx-ax);
		var beta = ay - alpha * ax;

		for (var i = ax; i <= bx; i += (bx-ax)/200) {
			var pos = this.fromXYToGrid(i, alpha*i+beta);
			grid_state[pos[0]][pos[1]] = 5;
		}

	},

	truncate: function(_value)
	{
	  if (_value<0) return Math.ceil(_value);
	  else return Math.floor(_value);
	},
});