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

    WallBuilder: function(parent_city) {
		this.parent_city = parent_city;

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
				var ax = coords[0]; var ay = coords[1];
				var bx = coords[2]; var by = coords[3];
				
				var distance_to_a_x = Math.abs(ax - this.parent_city.x);
				var distance_to_a_y = Math.abs(ay - this.parent_city.y);
				var distance_to_b_x = Math.abs(bx - this.parent_city.x);
				var distance_to_b_y = Math.abs(by - this.parent_city.y);

				var distance_to_a = Math.sqrt(distance_to_a_x^2 + distance_to_a_y^2);
				var distance_to_b = Math.sqrt(distance_to_b_x^2 + distance_to_b_y^2);
				
				var wall_lenght = Math.sqrt(Math.abs(ax-bx)^2 + Math.abs(ay-by)^2);
				
				var power = this.parent_city.power;
				
				console.log(i, distance_to_a, distance_to_b, wall_lenght, power);
				
				var time_cost = Math.ceil(wall_lenght/power + (distance_to_a + distance_to_b)/power);
				
				var ind = Crafty.e("2D, Canvas, Text")
					.attr({ x: coords[0], y: coords[1] + 5, w: 20, h: 20, z: 10000 }).text(time_cost)
					.textColor('#000000').textFont({ size: '20px', weight: 'bold' });
				this.indicators.push(ind);
			}
			
		}
	},
	
	wallRequestConfirmed: function(x, y) {
		this.next_start = [x, y]
	}
});