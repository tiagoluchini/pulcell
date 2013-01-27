BUILD_ORDER_COLOR = 'rgb(0,0,255)'
BUILD_ORDER_WIDTH = 3
BUILDING_COLOR = ['rgb(255,0,0)', 'rgb(255,0,255)']
BUILDING_WIDTH = [4, 4]
BUILT_COLOR = 'rgb(0,0,0)'
BUILT_WIDTH = 5

Crafty.c("WallBuilder", {

    init: function() {
        this.requires("Canvas, 2D, Delay");

		this.is_deploying_wall = false;
		this.is_building = false;
		this.walls = [];
		this.orders = [];
		this.indicators = [];
		this.time_costs = [];
    },

    WallBuilder: function(parent_city) {
		this.parent_city = parent_city;
		return this;
	},
	
	activate: function() {
		document.body.style.cursor = 'crosshair';
	
		if (this.next_start != undefined) {
			this.is_deploying_wall = true;
			this.orders.push(Crafty.e("Line"));
		}
		
		if (this.is_building) {
			console.log("kill orders");

			var count = this.orders.length;
			for (var i=0; i < count; i++) {
				this.orders[i].destroy();
				if (this.indicators[i] != undefined) {
					this.indicators[i].destroy();
				}
			}
			this.orders = [];
			this.indicators = [];
			this.time_costs = [];
			this.is_building = false;

		}
		
		event_dispatcher.addListener(this, "MouseMove", this.onMouseMove);
	
		event_dispatcher.addListener(this, "DoubleClick", this.onDoubleClick);
		
		event_dispatcher.addListener(this, "Click", function(e) {
			var pos = Crafty.DOM.translate(e.clientX, e.clientY);

			if (this.is_deploying_wall) {
				this.next_start = [pos.x, pos.y]
			}
			
			this.is_deploying_wall = true;
			this.orders.push(Crafty.e("Line"));
			
			if (this.next_start) {
				this.ax = this.next_start[0]; this.ay = this.next_start[1];
			} else {
				this.ax = pos.x; this.ay = pos.y;
			}
			
		});
	},
	
	deactivate: function() {
		document.body.style.cursor = 'default';
		event_dispatcher.removeListener(this, "MouseMove");
		event_dispatcher.removeListener(this, "DoubleClick");
		event_dispatcher.removeListener(this, "Click");
	},
		
	onMouseMove: function(e) {
		var pos = Crafty.DOM.translate(e.clientX, e.clientY);
		if (this.is_deploying_wall || this.next_start != undefined) {
			this.orders[this.orders.length-1].Line(this.ax, this.ay, pos.x, pos.y, BUILD_ORDER_COLOR, BUILD_ORDER_WIDTH);
		}
		
	},
	
	startBuilding: function() {
		this.is_building = true;
		this.index_building = 0
		var wall = this.orders[this.index_building];
		wall.setColor(BUILDING_COLOR[0]);
		wall.setWidth(BUILDING_WIDTH[0]);
		this.curr_color_index = 0;
		this.delay(function() { this.buildingTick(); }, 1000);
	},
	
	buildingTick: function() {
		
		var wall = this.orders[this.index_building];
		var ind = this.indicators[this.index_building];

		if (wall == undefined || ind == undefined) return;
				
		this.time_costs[this.index_building]--;
		ind.text(this.time_costs[this.index_building]);
		
		this.curr_color_index++;
		if (this.curr_color_index > 1) this.curr_color_index = 0;
		wall.setColor(BUILDING_COLOR[this.curr_color_index]);
		wall.setWidth(BUILDING_WIDTH[this.curr_color_index]);
		
		var current_cost = this.time_costs[this.index_building];
		
		if (current_cost == 0) {
			wall.setColor(BUILT_COLOR);
			wall.setWidth(BUILT_WIDTH);
			ind.destroy();
			
			this.walls.push(wall);
			this.orders.splice(this.index_building, 1)
			
			this.index_building++;

			if (this.index_building < this.orders.length-2) {
				// still has orders
				var new_wall = this.orders[this.index_building];
				new_wall = this.orders[this.index_building];
				new_wall.setColor(BUILDING_COLOR[0]);
				new_wall.setWidth(BUILDING_WIDTH[0]);
				
				this.curr_color_index = 0;				
				this.delay(function() { this.buildingTick(); }, 1000);
				
			} else {
				// finished order stack
				var coords = wall.getCoords()
				this.next_start = [coords[2], coords[3]]
				this.orders = [];
				this.indicators = [];
				this.time_costs = [];
				this.is_building = false;
			}

		} else {
			this.delay(function() { this.buildingTick(); }, 1000);
		}
	},
	
	onDoubleClick: function(e) {
		var pos = Crafty.DOM.translate(e.clientX, e.clientY);
		if (this.is_deploying_wall) {
			this.is_deploying_wall = false;
			event_dispatcher.removeListener(this, "MouseMove");
			event_dispatcher.removeListener(this, "DoubleClick");
			
			this.next_start = this.last_built_point
			
			for (var i=0; i<this.orders.length-2; i++) {
				var coords = this.orders[i].getCoords();
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
				
				//console.log(i, distance_to_a, distance_to_b, wall_lenght, power);
				
				var time_cost = Math.ceil(wall_lenght/power + (distance_to_a + distance_to_b)/power);
				this.time_costs.push(time_cost);
				
				var ind = Crafty.e("2D, Canvas, Text")
					.attr({ x: coords[0], y: coords[1] + 5, w: 20, h: 20, z: 10000 }).text(time_cost)
					.textColor('#000000').textFont({ size: '20px', weight: 'bold' });
				this.indicators.push(ind);
			}

			this.deactivate();
			this.startBuilding();
		}
	},
	
});