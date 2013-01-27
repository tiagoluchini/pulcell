Crafty.c("DashedLine", {
    _aX: 0,
    _aY: 0,
    _bX: 0,
    _bY: 0,

    ready: true,

    init: function() {
        this.requires("Canvas, 2D");

		this._ready = true;

        this.bind("Draw", function(obj) {
            this._draw(obj.ctx, obj.pos);
        });
    },

    DashedLine: function(ax, ay, bx, by, color, line_width) {
		this._color = (color == undefined) ? 'rgb(0,0,0)' : color;
		this._line_width = (line_width == undefined) ? 5 : line_width;

		this._aX = ax;
		this._aY = ay;
		this._bX = bx;
		this._bY = by;
		
		this.attr({
			x: ax < bx ? ax : bx,
			y: ay < by ? ay : by,
			w: Math.abs(bx - ax) + 1,
			h: Math.abs(by - ay) + 1
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

		var x1 = this._aX; var y1 = this._aY;
		var x2 = this._bX; var y2 = this._bY;

		var dashLen = 2;

		ctx.beginPath();
		ctx.moveTo(x1, y1);

		var dX = x2 - x1;
	    var dY = y2 - y1;
	    var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
	    var dashX = dX / dashes;
	    var dashY = dY / dashes;		

		var q = 0;
		while (q++ < dashes) {
			x1 += dashX;
			y1 += dashY;
			ctx[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
		}
		ctx[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);

        ctx.strokeStyle = this._color;
		ctx.lineWidth = this._line_width;

		ctx.stroke();
		ctx.closePath();
    },

	getCoords: function() {
		return [this._aX, this._aY, this._bX, this._bY];
	}
});