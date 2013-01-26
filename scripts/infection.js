Crafty.c("Infection", {
	
	ready: true,
	
	init: function() {
        this.requires("Canvas, 2D, Delay");

        this.bind("Draw", function(obj) {
            this._draw(obj.ctx, obj.pos);
        });
    },
    	
	Infection: function(start_x, start_y) {
		
		this.growth_cycle = 200;
		
		this.start_x = start_x; 
		this.start_y = start_y;
		
		this.back_image = Crafty.asset("sprites/grass.jpg");
		
		//this.current_pixels = [[this.start_x, this.start_y]];
		
		this.draw_queue = [
			[this.start_x, this.start_y - 1, 'N'],
			[this.start_x, this.start_y + 1, 'S'],
			[this.start_x + 1, this.start_y, 'E'],
			[this.start_x - 1, this.start_y, 'W'],
			[this.start_x - 1, this.start_y + 1, 'NE'],
			[this.start_x + 1, this.start_y + 1, 'SE'],
			[this.start_x + 1, this.start_y - 1, 'SW'],
			[this.start_x - 1, this.start_y - 1, 'NW']
		];
		
		this.border_pixels = [];
		this.just_drawn = [];

		this.delay(function() { this.grow(); }, this.growth_cycle);
		
		this.attr({
			x: this.start_x,
			y: this.start_y,
			w: 1, h: 1
		});
		
		return this;
	},
	
	grow: function() {
		console.log("growing");
				
		var small_x = SCREEN_WIDTH; var small_y = SCREEN_HEIGHT;
		var big_x = 0; var big_y = 0;
		
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
		
		this.attr({
			x: small_x,
			y: small_y,
			w: big_x - small_x, h: big_y - small_y
		});
		
		this.delay(function() { this.grow(); }, this.growth_cycle);
		return this;
	},
	
	_draw: function(ctx, pos) {
		console.log("drawing");
		
		if (this.image_data == undefined) {
			ctx.drawImage(this.back_image, 0, 0);
			this.image_data = ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		}
		
		var count = 0.8 * this.draw_queue.length;
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