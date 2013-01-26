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
		//var small_x = SCREEN_WIDTH; var small_y = SCREEN_HEIGHT;
		//var big_x = 0; var big_y = 0;
		
		//var how_many = this.growth_rate * this.volume_count;
		var how_many = 1 + this.volume_count/75;
		if (how_many < 1) {how_many = 1}
		
		for (j=0; j<how_many; j++) {
			var index = this.truncate(Math.random() * this.draw_queue.length);
			var tile_to_draw = this.draw_queue[index];
			//var pos = this.fromXYToGrid(tile_to_draw[0], tile_to_draw[1]);

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
		
		/*
		
		var count = this.just_drawn.length;
		for (i = 0; i < count; i++) {
			var item = this.just_drawn.pop()
			var ix = item[0]; 
			var iy = item[1];
			var dir = item[2];
			//console.log("growing to ", ix, iy);
			
			if (ix < small_x) { small_x = ix }
			if (iy < small_y) { small_y = iy }
			if (ix > big_x) { big_x = ix }
			if (iy > big_y) { big_y = iy }
			
			if (dir == 'N') { this.draw_queue.push([ix, iy-1, 'N']) }
			if (dir == 'S') { this.draw_queue.push([ix, iy+1, 'S']) }
			if (dir == 'E') { this.draw_queue.push([ix+1, iy, 'E']) }
			if (dir == 'W') { this.draw_queue.push([ix-1, iy, 'W']) }
			
			if (dir == 'NE') { 
				this.draw_queue.push([ix+1, iy-1, 'NE']);
				this.draw_queue.push([ix+1, iy, 'E']);
				this.draw_queue.push([ix, iy-1, 'N']);
			}
			
			if (dir == 'SE') { 
				this.draw_queue.push([ix+1, iy+1, 'SE']);
				this.draw_queue.push([ix+1, iy, 'E']);
				this.draw_queue.push([ix, iy+1, 'S']);
			}

			if (dir == 'SW') { 
				this.draw_queue.push([ix-1, iy+1, 'SW']);
				this.draw_queue.push([ix-1, iy, 'W']);
				this.draw_queue.push([ix, iy+1, 'S']);
			}

			if (dir == 'NW') { 
				this.draw_queue.push([ix-1, iy-1, 'NW']);
				this.draw_queue.push([ix-1, iy, 'W']);
				this.draw_queue.push([ix, iy-1, 'N']);
			}

			
		}
		//this.border_pixels = new_border;
		*/
		
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
//			console.log(col, this.grid_state[col]);
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
		
/*		
		var count = 1.0 * this.draw_queue.length;
		for (i = 0; i < count; i++) {
			var index = this.truncate(Math.random() * this.draw_queue.length);
			console.log(index);
			var item = this.draw_queue[index];
			var ix = item[0]; var iy = item[1];
			this.just_drawn.push(item);
			this.draw_queue.splice(index, 1);
			//console.log("pixeling ", ix, iy);
			var cur_pix = this.getPixel(this.image_data, ix, iy);
			//this.setPixel(this.image_data, ix, iy, 161, 0, 226, 0);
			this.setPixel(this.image_data, ix, iy, cur_pix[0]*4, cur_pix[1]/3, cur_pix[2]*3, cur_pix[3]);
			
		}		
		ctx.putImageData(this.image_data, 0, 0);
		
*/
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

/*
var volume = 8 * 8;
var border_pixels = [];

var _infection_start_x = 400;
var _infection_start_y = 300;

Crafty.e("2D, Canvas, infection").attr({x: })
*/