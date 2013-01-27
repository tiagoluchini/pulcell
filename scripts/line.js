Crafty.c("Line", {
    _aX: 0,
    _aY: 0,
    _bX: 0,
    _bY: 0,

    ready: function() { this._ready },

    _lines:[],
    init: function() {
        this.requires("Canvas, 2D");

		this._ready = true;

        this.bind("Draw", function(obj) {
            this._draw(obj.ctx, obj.pos);
        });
    },

    Line: function(ax, ay, bx, by, color, line_width) {
		this._color = (color == undefined) ? 'rgb(0,0,0)' : color;
		this._line_width = (line_width == undefined) ? 5 : line_width;
	
		this._aX = ax;
		this._aY = ay;
		this._bX = bx;
		this._bY = by;
		
		this.attr({
			x: ax < bx ? ax : bx,
			y: ay < by ? ay : by,
			w: Math.abs(bx - ax),
			h: Math.abs(by - ay)
		});
	},
	
	setColor: function(color) {
		this._color = color;
		this.draw();
	},

	setWidth: function(width) {
		this._line_width = width;
		this.draw();
	},

    _draw: function(ctx, pos) {
		//console.log(pos);
		ctx.beginPath();
		ctx.moveTo(this._aX, this._aY);
		ctx.lineTo(this._bX, this._bY);
        ctx.strokeStyle = this._color;
		ctx.lineWidth = this._line_width;
		ctx.stroke();
		this._ready = false;
    },

	getCoords: function() {
		return [this._aX, this._aY, this._bX, this._bY];
	}
});