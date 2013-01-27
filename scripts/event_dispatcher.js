Crafty.c("EventDispatcher", {

    init: function() {
        this.requires("Canvas, 2D, Mouse");

		this.listeners = [];
    },

    EventDispatcher: function() {
			
		this.bind("Click", function(e) {
			this.triggerEvent("Click", e);
		});

		this.bind("DoubleClick", function(e) {
			this.triggerEvent("DoubleClick", e);
		});

		this.bind("MouseMove", function(e) {
			this.triggerEvent("MouseMove", e);
		});
		
		return this;
	},
	
	addListener: function(obj, event_name, callback) {
		this.listeners.push({obj: obj, event_name: event_name, callback: callback});
	},
	
	removeListener: function(obj, event_name) {
		var new_listeners = this.listeners;
		for (var i=0; i<this.listeners.length; i++) {
			var listener = this.listeners[i];
			if (listener.obj == obj && listener.event_name == event_name) {
				new_listeners.splice(i,1);
			}
		}
		this.listeners = new_listeners;
	},
	
	triggerEvent: function(event_name, e) {
		var pos = Crafty.DOM.translate(e.clientX, e.clientY);
		for(var i=0; i<this.listeners.length; i++) {
			var ievent = this.listeners[i];
			if (event_name == ievent.event_name) {
				if (pos.x >= ievent.obj.x && pos.y >= ievent.obj.y && 
					pos.x <= ievent.obj.x + ievent.obj.w && 
					pos.y <= ievent.obj.y + ievent.obj.h) {
						var dealt_with = ievent.callback.call(ievent.obj, e);
						if (dealt_with) break;
				}
			}
		}
	},

});