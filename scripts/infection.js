INFECTION_TILE_SIZE = 8;

Crafty.c("Infection", {
	
	ready: true,
	
	init: function() {
        this.requires("Canvas, 2D, Delay");

        this.bind("Draw", function(obj) {
            this._draw(obj.ctx, obj.pos);
        });
    },
    	
	Infection: function(start_col, start_row) {
		
		this.growth_cycle = 50;
		this.growth_rate = 0.2;
		
		this.start_col = start_col; 
		this.start_row = start_row;
		
		this.col_count = SCREEN_WIDTH/INFECTION_TILE_SIZE;
		this.row_count = SCREEN_HEIGHT/INFECTION_TILE_SIZE;

		this.grid_state = new Array(this.col_count);
		for (var i = 0; i < this.col_count; i++) {
			this.grid_state[i] = new Array(this.row_count);
			for (var j = 0; j < this.row_count; j++) {
				this.grid_state[i][j] = 0;
			}
		}
		this.volume_count = 0;
		
		this.draw_queue = [
			[this.start_col, this.start_row - 1, 'N'],
			[this.start_col, this.start_row + 1, 'S'],
			[this.start_col + 1, this.start_row, 'E'],
			[this.start_col - 1, this.start_row, 'W'],
			[this.start_col - 1, this.start_row + 1, 'NE'],
			[this.start_col + 1, this.start_row + 1, 'SE'],
			[this.start_col + 1, this.start_row - 1, 'SW'],
			[this.start_col - 1, this.start_row - 1, 'NW']
		];
		
		this.just_drawn = [];

		this.delay(function() { this.grow(); }, this.growth_cycle);
		
		var xy = this.fromGridToXY(this.start_col, this.start_row);
		
		this.attr({
			x: xy[0],
			y: xy[1],
			w: xy[0]+INFECTION_TILE_SIZE, h: xy[1]+INFECTION_TILE_SIZE
		});
		
		return this;
	},
	
	fromXYToGrid: function(x, y) {
		col = Math.floor(x / INFECTION_TILE_SIZE);
		row = Math.floor(y / INFECTION_TILE_SIZE);
		return [col, row];
	},
	
	fromGridToXY: function(col, row) {
		x = col * INFECTION_TILE_SIZE;
		y = row * INFECTION_TILE_SIZE;
		return [x, y];
	},
	
	grow: function() {
		var how_many = 1 + this.volume_count/75;
		if (how_many < 1) {how_many = 1}
		
		for (j=0; j<how_many; j++) {
			var index = this.truncate(Math.random() * this.draw_queue.length);
			var tile_to_draw = this.draw_queue[index];

			this.draw_queue.splice(index,1);

			var free_spots = this.freeGridSpots(tile_to_draw[0], tile_to_draw[1]);
			for (i = 0; i < free_spots.length; i++) {
				var tuplet = [free_spots[i][0], free_spots[i][1]];
				if (this.draw_queue.indexOf(tuplet) == -1) {
					this.draw_queue.push(tuplet);
				}
			}

			this.grid_state[tile_to_draw[0]][tile_to_draw[1]] = 1;
		}
		
		this.draw();
		
		this.attr({
			x: this.x - 1,
			y: this.y - 1,
			w: this.w + 1, h: this.h + 1
		});
		
		this.delay(function() { this.grow(); }, this.growth_cycle);
		return this;
	},
	
	_draw: function(ctx, pos) {		
		for (col = 0; col < this.grid_state.length; col++) {
			for (row = 0; row < this.grid_state[col].length; row++) {
				var state = this.grid_state[col][row];
				if (state == 1) {
					var xy = this.fromGridToXY(col, row);
					var tile = Crafty.e("2D, Canvas, infection")
						.attr({x: xy[0], y: xy[1]});
					this.grid_state[col][row] = 2;
					this.volume_count++;
				}
				
			}
		}
		
    },

	freeGridSpots: function(col, row) {
		var out = [];
		if (this.grid_state[col-1][row] == 0) { out.push([col-1, row]) }
		if (this.grid_state[col+1][row] == 0) { out.push([col+1, row]) }
		if (this.grid_state[col][row-1] == 0) { out.push([col, row-1]) }
		if (this.grid_state[col][row+1] == 0) { out.push([col, row+1]) }
		if (this.grid_state[col-1][row-1] == 0) { out.push([col-1, row-1]) }
		if (this.grid_state[col-1][row+1] == 0) { out.push([col-1, row+1]) }
		if (this.grid_state[col+1][row+1] == 0) { out.push([col+1, row+1]) }
		if (this.grid_state[col+1][row-1] == 0) { out.push([col+1, row-1]) }
		return out;
	},
	
	buildWall: function(ax, ay, bx, by) {

		console.log("ax, ay, bx, by: ", ax, ay, bx, by);
		
		if (ax == bx) { ax += -1 }
		if (ax > bx) { 
			var tx = ax; var ty = ay;
			ax = bx; ay = by;
			bx = tx; by = ty;
		}
		
		var alpha = (by-ay)/(bx-ax);
		var beta = ay - alpha * ax;

		console.log("ax, ay, bx, by: ", ax, ay, bx, by);
		console.log(alpha, beta);
				
		for (var i = ax; i <= bx; i += (bx-ax)/200) {
			var pos = this.fromXYToGrid(i, alpha*i+beta);
			this.grid_state[pos[0]][pos[1]] = 5;
		}
		

/*		
		var small_x = (ax < bx) ? ax : bx;
		var big_x = (ax <= bx) ? bx : ax;
		var small_y = (ay < by) ? ay : by;
		var big_y = (ay <= by) ? by : ay;

		
		var len_x = big_x - small_x;
		var len_y = big_y - small_y;
		
		var biggest_len = (len_x > len_y) ? len_x : len_y;
		
		for (var ix = small_x; ix <= big_x; ix++) {
			for (var iy = )
		}
		
		if (biggest_len == len_x) {
			for(var i=small_x; i<)
		} 
		
		
		var end = (biggest_len == len_x) ? big_y; big_x;
		
		
		
		
		var vx = (end_x-start_x)/INFECTION_TILE_SIZE;
		var vy = (end_y-start_y)/INFECTION_TILE_SIZE;

		console.log("vx, vy: ", vx, vy);		
		
		var ix = start_x; var iy = start_y;
		console.log("start_x, start_y: ", start_x, start_y);
		
		while (ix >= start_x && ix <= end_x) {
			while (iy >= start_y && iy <= end_y) {
				var pos = this.fromXYToGrid(ix, iy);
				this.grid_state[pos[0]][pos[1]] = 5;
//				console.log(pos[0], pos[1]);
				console.log("ix, iy: ", ix, iy);
				iy += vy;
				ix += vx;
			}
		}
*/		
		
		
	},

	truncate: function(_value)
	{
	  if (_value<0) return Math.ceil(_value);
	  else return Math.floor(_value);
	},

	getPixel: function(imageData, x, y) {
		index = (x + y * imageData.width) * 4;
		r = imageData.data[index+0];
		g = imageData.data[index+1];
		b = imageData.data[index+2];
		a = imageData.data[index+3];
		return [r, g, b, a];
	},

	setPixel: function(imageData, x, y, r, g, b, a) {
	    index = (x + y * imageData.width) * 4;
	    imageData.data[index+0] = r;
	    imageData.data[index+1] = g;
	    imageData.data[index+2] = b;
	    imageData.data[index+3] = a;
	}
	
});