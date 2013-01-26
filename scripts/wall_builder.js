BUILD_ORDER_COLOR = 'rgb(0,0,255)'
BUILD_ORDER_WIDTH = 3
BUILDING_COLOR = 'rgb(0,120,255)'
BUILDING_WIDTH = 5
BUILT_COLOR = 'rgb(255,255,255)'
BUILT_WIDTH = 5

Crafty.c("WallBuilder", {

    init: function() {
        this.requires("Canvas, 2D, Mouse");

		this.is_deploying_wall = false;
		this.walls = [];
		this.indicators = []
		
    },

    WallBuilder: function(city_source) {

		this.bind("DoubleClick", this.onDoubleClick);
		
		this.bind("MouseMove", this.onMouseMove);
			
		this.bind("Click", function(e) {
			var pos = Crafty.DOM.translate(e.clientX, e.clientY);
			
			if (this.is_deploying_wall) {
				this.wallRequestConfirmed(pos.x, pos.y);
			}
			
			this.is_deploying_wall = true;
			this.walls.push(Crafty.e("Line"));
			
			if (this.next_start) {
				this.ax = this.next_start[0]; this.ay = this.next_start[1];
			} else {
				this.ax = pos.x; this.ay = pos.y;
			}				
			
			
		});
	
		return this;
	},
	
	onMouseMove: function(e) {
		if (this.is_deploying_wall) {
			var pos = Crafty.DOM.translate(e.clientX, e.clientY);
			this.walls[this.walls.length-1].Line(this.ax, this.ay, pos.x, pos.y, BUILD_ORDER_COLOR, BUILD_ORDER_WIDTH);
		}
	},
	
	onDoubleClick: function(e) {
		var pos = Crafty.DOM.translate(e.clientX, e.clientY);
		if (this.is_deploying_wall) {
			this.is_deploying_wall = false;
			this.wallRequestConfirmed(pos.x, pos.y);
			
			for (var i=0; i<this.walls.length-2; i++) {
				var coords = this.walls[i].getCoords();
				var ind = Crafty.e("2D, Canvas, Text")
					.attr({ x: coords[0], y: coords[1] + 5, w: 20, h: 20, z: 10000 }).text("23")
					.textColor('#000000').textFont({ size: '20px', weight: 'bold' });
				this.indicators.push(ind);
			}
			
		}
	},
	
	wallRequestConfirmed: function(x, y) {
		this.next_start = [x, y]
	}
});