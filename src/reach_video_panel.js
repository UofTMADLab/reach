import {REACH_DEFAULT_NULL, getSrc, getVideoId} from './utility.js';

AFRAME.registerComponent("reach_video_panel", {
	
	schema: {
		
		id: {type: "string", default: REACH_DEFAULT_NULL},
		direction: {type: "number", default: 0.0},
		directionInDegrees: {type: "boolean", default: false},
		inclination: {type: "number", default: 0.0},
		distance: {type: "number", default: 2.0},
		yHeight: {type: "number", default: 1.6},
		opacity: {type: "number", default: 0.7},
		width: {type: "number", default: 1.0},
		height: {type: "number", default: 1.0},
		onClick: {
			type: "string",
			default: REACH_DEFAULT_NULL
		},
		onMouseEnter: {
			type: "string",
			default: REACH_DEFAULT_NULL
		},
		onMouseLeave: {
			type: "string",
			default: REACH_DEFAULT_NULL
		},
		onLoaded: {
			type: "string",
			default: REACH_DEFAULT_NULL
		},
		autoplay: {type: "boolean", default: true},
		loop: {type: "boolean", default: true},
		src: {type: "string", default: "#reach-default-360"},
		onLoaded: {type: "string", default: REACH_DEFAULT_NULL}
		
		
	},
	init: function() {
		this.el.setAttribute("reach_component", "reach_video_panel");
		var self = this;
	},
	update: function(oldData) {
		
		if (!this.head) {
			this.head = document.createElement("a-entity");
			this.outer = document.createElement("a-entity");		
			this.inner = document.createElement("a-entity");
			this.background = document.createElement("a-video");
			this.head.appendChild(this.outer);
			this.outer.appendChild(this.inner);
			this.inner.appendChild(this.background);
		
			this.removeEventListeners = [];
			// new cursor events can't be registered on further updates to this component
			this.registerEvents("onClick", this.background, "click", "reach_text_panel");
			this.registerEvents("onMouseEnter", this.background, "mouseenter", "reach_text_panel");
			this.registerEvents("onMouseLeave", this.background, "mouseleave", "reach_text_panel");
			this.registerEvents("onLoaded", this.el, "loaded", "reach_text_panel", true);
			
		
			
			this.el.appendChild(this.head);
			
		}
		
		if (this.data.src != oldData.src) {
			if (this.data.src !== undefined && this.data.src !== "") {
				this.videoId = getVideoId(this.data.src);
				var assets = document.querySelector("a-assets");
				this.videoAsset = assets.querySelector(`#${this.videoId}`);
				if (this.videoAsset === null) {
					this.videoAsset = document.createElement("video");
					assets.appendChild(this.videoAsset);
					this.videoAsset.setAttribute("src", getSrc(this.data.src));
					this.videoAsset.setAttribute("autoplay", this.data.autoplay);
					this.videoAsset.setAttribute("loop", this.data.loop);
					this.videoAsset.setAttribute("id", this.videoId);
				
				}
				
				this.background.setAttribute("src", `#${this.videoId}`);
				if (this.data.autoplay === true) {
					this.videoAsset.play();
				}
			}
			
		
		}

		if (this.data.id !== REACH_DEFAULT_NULL) {
			this.el.setAttribute("id", this.data.id);
		}
		
		this.head.setAttribute("position", `0 ${this.data.yHeight} 0`);
		
		this.outer.setAttribute("rotation", `${(this.data.inclination) % 12 * 30.0} ${this.data.directionInDegrees === true ? this.data.direction : (this.data.direction % 12) * -30.0} 0`);
		
		this.inner.setAttribute("position", `0 0 ${-1.0 * this.data.distance}`);
		this.inner.setAttribute("rotation", `0 0 0`);

		
		this.background.setAttribute("id", "background");

		this.background.setAttribute("width", this.data.width);
		this.background.setAttribute("height", this.data.height);


		if (
			this.data.onClick !== REACH_DEFAULT_NULL ||
			this.data.onMouseEnter !== REACH_DEFAULT_NULL ||
			this.data.onMouseLeave !== REACH_DEFAULT_NULL) {

			this.background.setAttribute("class", "clickable");
		}

		
		

	},
	remove: function () {
		if (this.head) {
			for (var i in this.removeEventListners) {
				this.removeEventListners[i]();
			}
			this.removeEventListners = [];
			// if (this.background) {
			// 	this.background.removeEventListener("materialtextureloaded", this.imageLoadedHandler);
			// }		
			this.el.removeChild(this.head);
			this.head.destroy();
			this.head = undefined;
			this.outer = undefined;
			this.inner= undefined;
			this.background = undefined;
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
		
		this.el.setAttribute("reach_video_panel", options);
	},
	
	getOption : function(name) {
		return this.data[name];
	},
	
	tick: function(time, timeDelta) {
		if (this.tickCallback !== undefined) {
			try {
				this.tickCallback(this, time, timeDelta);
			} catch (e) {
				this.tickCallback = undefined;
				window.story.showError(e, `${window.passage.name}(onTick: reach_video_panel, id: ${this.data.id})`);
				return;				
			}			
		}
	},

	
	eventTargetElement: function() {
		return this.head;
	},
	
	playVideo: function() {
		this.videoAsset.play();
	},
	
	stopVideo: function() {
		this.videoAsset.stop();
	},
	
	pauseVideo: function() {
		this.videoAsset.pause();
	}
	

	
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
	
})