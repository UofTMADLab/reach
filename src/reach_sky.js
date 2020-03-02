import {REACH_DEFAULT_NULL, REACH_DEFAULT_NULL_NUMBER, getSrc} from './utility.js';

AFRAME.registerComponent("reach_sky", {
	
	schema: {
		id: {type: "string", default: REACH_DEFAULT_NULL},
		distance: {type: "number", default: REACH_DEFAULT_NULL_NUMBER},
		direction: {type: "number", default: 0.0},
		directionInDegrees: {type: "boolean", default: false},
		inclination: {type: "number", default: 0.0},
		transparent: {type: "boolean", default: true},
		opacity: {type: "number", default: 1.0},
		src: {type: "string", default: REACH_DEFAULT_NULL},
		onLoaded: {type: "string", default: REACH_DEFAULT_NULL}
		
	},
	init: function() {
		this.el.setAttribute("reach_component", "reach_sky");
	},
	update: function(oldData) {
		
		if (!this.sky) {
			this.sky = document.createElement("a-sky");
			this.el.appendChild(this.sky);
			
			this.removeEventListeners = [];
			this.registerEvents("onLoaded", this.el, "loaded", "reach_sky", true);
		}
		
		if (this.data.id !== REACH_DEFAULT_NULL) {
			this.el.setAttribute("id", this.data.id);
		}
		
	
	
		if (oldData.src !== this.data.src) {
			this.sky.setAttribute("src", this.data.src === REACH_DEFAULT_NULL ? window.story.defaultSkySrc : getSrc(this.data.src));
		}
		
	    this.sky.setAttribute("transparent", this.data.transparent);
	    this.sky.setAttribute("radius", this.data.distance === REACH_DEFAULT_NULL_NUMBER ? window.story.defaultFarClipping - 10 : this.data.distance);
	    this.sky.setAttribute("opacity", this.data.opacity);
		this.sky.setAttribute("rotation", `${(this.data.inclination) % 12 * 30.0} ${this.data.directionInDegrees === true ? this.data.direction : (this.data.direction % 12) * -30.0} 0`);

				    this.sky.setAttribute("animation", {
				    	  property: "opacity",
				    	  to: 1.0,
			from: 0.0,
				    	  startEvents: "materialtextureloaded"
				    });
		
		
	},
	
	remove: function () {
		if (this.sky) {
			for (var i in this.removeEventListners) {
				this.removeEventListners[i]();
			}
			this.removeEventListeners = [];
			this.el.removeChild(this.sky);
			// calling destroy here was deleting the sky geometry globally sometimes
			// this.sky.destroy();
			this.sky = undefined;
		}
	},
	
	registerEvents: function(eventNamesKey, sourceEntity, sourceEvent, componentName, once = false) {
		if (this.data.eventNames === REACH_DEFAULT_NULL) {
			return;
		}
		if (!sourceEvent) {
			return;
		}
		var emitter = this.el;
		var self = this;
		var callback = function(evt) {
			if (once === true) {
				sourceEntity.removeEventListener(sourceEvent, callback);
			}
			// get most recent events assigned to this object
			var eventNames = self.data[eventNamesKey];
			if (eventNames === REACH_DEFAULT_NULL) {
				return;
			}
			var events = eventNames.split(" ");

			for (var i in events) {
				var eventName = events[i];
				emitter.emit(eventName, {
					source: emitter.components[componentName]
				});
			}
		}
		sourceEntity.addEventListener(sourceEvent, callback);
		if (once === false) {
			this.removeEventListeners.push(function() {
				sourceEntity.removeEventListener(sourceEvent, callback);
			})
		}

	},
	tick: function(time, timeDelta) {
		if (this.tickCallback !== undefined) {
			try {
				this.tickCallback(this, time, timeDelta);
			} catch (e) {
				this.tickCallback = undefined;
				window.story.showError(e, `${window.passage.name}(onTick: reach_sky, id: ${this.data.id})`);
				return;				
			}			
		}
	},
	// tock: function(time, timeDelta, camera) {
	//
	// },
	
	// pause: function() {
	//
	// },
	// play: function() {
	//
	// },
	// updateSchema: function(newData) {
	//
	// },
	// events: {
	// 	click: function(evt) {
	// 		console.log(`This entity was clicked: ${this.el.getAttribute('id')}`);
	// 	}
	// }
	
	onTick: function(callback) {
		this.tickCallback = callback;
	},
	
	hide : function() {
		this.el.object3D.visible = false;
	},

	show : function() {
		this.el.object3D.visible = true;
	},
	setOption : function(name, value) {
		var options = {};
		options[name] = value;
		this.el.setAttribute("reach_sky", options);
	},
	
	getOption : function(name) {
		return this.data[name];
	},
	eventTargetElement: function() {
		return this.sky;
	},
	
});