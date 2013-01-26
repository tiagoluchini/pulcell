Crafty.c("Line", {
    _aX: 0,
    _aY: 0,
    _bX: 0,
    _bY: 0,

    ready: true,
    _lines:[],
    init: function() {
        this.requires("Canvas, 2D");

        this.bind("Draw", function(obj) {
            this._draw(obj.ctx, obj.pos);
        });
    },

    Line: function(ax, ay, bx, by) {
		this._aX = ax;
		this._aY = ay;
		this._bX = bx;
		this._bY = by;
		
		this.attr({
			x: ax < bx ? ax : bx,
			y: ay < by ? ay : by,
			w: Math.abs(bx - ax) + 1,  //Need to add 1 or veritical lines won't draw
			h: Math.abs(by - ay) + 1   //Need to add 1 or horizontal lines won't draw
		});
		
	},

    _draw: function(ctx, pos) {
		//console.log(pos);
		ctx.beginPath();
		ctx.moveTo(this._aX, this._aY);
		ctx.lineTo(this._bX, this._bY);
        ctx.strokeStyle = "rgb(0,0,0)";
		ctx.lineWidth = 5;
		ctx.stroke();
    }
});