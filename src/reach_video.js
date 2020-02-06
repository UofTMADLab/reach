import {REACH_DEFAULT_NULL, getSrc} from './utility.js';

AFRAME.registerComponent("reach_video", {
	
	schema: {
		id: {type: "string", default: "REACH_DEFAULT_NULL"},
		distance: {type: "number", default: 5000.0},
		direction: {type: "number", default: 0.0},
		directionInDegrees: {type: "boolean", default: false},
		inclination: {type: "number", default: 0.0},
		
		autoplay: {type: "boolean", default: true},
		loop: {type: "boolean", default: true},
		videoId: {type: "string", default: "video"},
		src: {type: "string", default: "#reach-default-360"},
		onLoaded: {type: "string", default: REACH_DEFAULT_NULL}
		
	},
	init: function() {
		this.el.setAttribute("reach_component", "reach_video");
	},
	update: function(oldData) {
		
		if (!this.sky) {
		    this.sky = document.createElement("a-videosphere");
			this.el.appendChild(this.sky);
			
			this.removeEventListeners = [];
			this.registerEvents("onLoaded", this.el, "loaded", "reach_video", true);
			
		}
		
		if (this.data.id !== REACH_DEFAULT_NULL) {
			this.el.setAttribute("id", this.data.id);
		}
		
		if (this.data.src != oldData.src) {
			var videoAsset = document.querySelector(`#${this.data.videoId}`);

			if (!videoAsset) {
				var assets = document.querySelector("a-assets");
				videoAsset = document.createElement("video");
				videoAsset.setAttribute("src", getSrc(this.data.src));
				videoAsset.setAttribute("autoplay", this.data.autoplay);
				videoAsset.setAttribute("loop", this.data.loop);
				videoAsset.setAttribute("id", this.data.videoId);
				assets.appendChild(videoAsset);
			}
		
			this.sky.setAttribute("src", `#${this.data.videoId}`);
			if (this.data.autoplay === true) {
				videoAsset.play();
			}
		
		}
		
	    this.sky.setAttribute("radius", this.data.distance);
		this.sky.setAttribute("rotation", `${(this.data.inclination) % 12 * 30.0} ${this.data.directionInDegrees === true ? this.data.direction : (this.data.direction % 12) * -30.0} 0`);
		

	
		
	},
	remove: function () {
		if (this.sky) {
			for (var i in this.removeEventListners) {
				this.removeEventListners[i]();
			}
			this.el.removeChild(this.sky);
			this.sky.destroy();
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
				window.story.showError(e, `${window.passage.name}(onTick: reach_video, id: ${this.data.id})`);
				return;				
			}			
		}
	},
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
		
		this.el.setAttribute("reach_video", options);
	},
	
	getOption : function(name) {
		return this.data[name];
	},
	eventTargetElement: function() {
		return this.sky;
	},
	
	
	// tick: function(time, timeDelta) {
	//
	// },
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
	
});