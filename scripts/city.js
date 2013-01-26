
Crafty.c("City", {
	
	ready: true,
	
	init: function() {
        this.requires("Canvas, 2D, Delay");

        //this.bind("Draw", function(obj) {
        //    this._draw(obj.ctx, obj.pos);
        //});

        this.bind("Click", function(e) {
        } );
    
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
    	
    	
	City: function(start_col, start_row, size) {
		this.size = size;
		this.start_col = start_col; 
		this.start_row = start_row;
		//this.draw();

        var xy = this.fromGridToXY(this.start_col, this.start_row);
        var city_sprite = Crafty.e("2D, Canvas, citySprite")
                    .attr({x: xy[0], y: xy[1]});
        this.attr({x: xy[0], y: xy[1], w:size*TILE_SIZE, h:size*TILE_SIZE});
		
        for (i=0; i<size; i++) {
    		for (j=0; j<size; j++) {
    		    grid_state[start_col+i][start_row+j]=6;
    		}
        }
		return this;
	},

//    _draw: function(ctx, pos) {
//         var xy = this.fromGridToXY(this.start_col, this.start_row);
//         console.log("OPA ", xy[0], xy[1]);
//         var city = Crafty.e("2D, Canvas, citySprite")
//                    .attr({x: xy[0], y: xy[1]});
//    },
});