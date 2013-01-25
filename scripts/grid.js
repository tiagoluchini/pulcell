Crafty.c("ObjectGrid", {
	
	ObjectGrid: function(tileSize, nCols, nRows) {
		this.grid = []
		for (col = 0; col < nCols; col++) {
			this.grid.push([])
			for (row = 0; row < nRows; row++) {
				this.grid[col].push(undefined)
			}
		}
		
		this.bind("Click", function(e) {
			tile = this.pointToTile(e.realX, e.realY);
			topleft = this.tileToTopleft(tile[0], tile[1])
			object = Crafty.e("2D, Canvas, tile")
				.attr({x: topleft[0], y: topleft[1]});
			this.setAt(object, tile[0], tile[1]);
			console.log(this.grid);
		} );
		
		return this;
	}, 
	
	setAt: function(object, col, row) {
		this.grid[col][row] = object;		
	},
	
	getAt: function(col, row) {
		return this.grid[col][row]
	},
	
	tileToTopleft: function(col, row) {
		x = Math.floor(GRID_LEFT_MARGIN + GRID_SIZE * col);
		y = Math.floor(GRID_TOP_MARGIN + GRID_SIZE * row);
		return [x, y]
	},
	
	pointToTile: function(x, y) {
		col = Math.floor((x - GRID_LEFT_MARGIN) / GRID_SIZE);
		row = Math.floor((y - GRID_TOP_MARGIN) / GRID_SIZE);
		return [col, row]
	},
});