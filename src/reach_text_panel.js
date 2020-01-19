import {REACH_DEFAULT_NULL, getSrc} from './utility.js';

AFRAME.registerComponent("reach_text_panel", {
	
	schema: {
		
		id: {type: "string", default: REACH_DEFAULT_NULL},
		direction: {type: "number", default: 0.0},
		directionInDegrees: {type: "boolean", default: false},
		inclination: {type: "number", default: 0.0},
		distance: {type: "number", default: 2.0},
		yHeight: {type: "number", default: 1.6},
		backgroundSize: {type: "vec2", default: {x:1.5, y:1.5 / 8.5 * 11.0}},
		text:{type: "string", default: ""},
		backgroundColor: {type: "color", default: "#ffffff"},
		opacity: {type: "number", default: 0.7},
		backgroundShape: {type: "string", default: "plane"},
		img: {type: "string", default: REACH_DEFAULT_NULL},
		color: {type: "color", default: "#000000"},
		link: {type: "string", default: REACH_DEFAULT_NULL},
		arrow: {type: "boolean", default: false},
		floor: {type: "boolean", default: false},
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
		}
		
		
	},
	init: function() {
		var self = this;
		// this.imageLoadedHandler = function(evt) {
		// 	if (evt.target !== self.background) {
		// 		return;
		// 	}
		// 	console.map = evt.target.getObject3D('mesh').material.map;
		// 	var image = evt.target.getObject3D('mesh').material.map.image;
		// 	var width = image.naturalWidth;
		// 	var height = image.naturalHeight;
		// 	if (width === 0) {
		// 		return;
		// 	}
		// 	var aspect = height / width;
		// 	var localWidth = self.data.backgroundSize.x;
		// 	var localHeight = aspect * localWidth;
		// 	console.log(`image: ${width}, ${height} ${localWidth}, ${localHeight}`);
		//
		// 	self.background.setAttribute("geometry", `primitive: ${self.data.backgroundShape}; width: ${localWidth}; height: ${localHeight}`);
		// }
	},
	update: function(oldData) {
		
		if (!this.head) {
			this.head = document.createElement("a-entity");
			this.outer = document.createElement("a-entity");		
			this.inner = document.createElement("a-entity");
			this.background = document.createElement("a-entity");
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

		if (this.data.id !== REACH_DEFAULT_NULL) {
			this.el.setAttribute("id", this.data.id);
		}
		// override default yHeight & rotate to face up if floor-link
		var yHeight = this.data.floor === true ? 0 : this.data.yHeight;
		var innerRotation = (this.data.floor === true && this.data.arrow === false) ? -90.0 : 0.0;
		
		this.head.setAttribute("position", `0 ${yHeight} 0`);
		
		this.outer.setAttribute("rotation", `${(this.data.inclination) % 12 * 30.0} ${this.data.directionInDegrees === true ? this.data.direction : (this.data.direction % 12) * -30.0} 0`);
		
		this.inner.setAttribute("position", `0 0 ${-1.0 * this.data.distance}`);
		this.inner.setAttribute("rotation", `${innerRotation} 0 0`);

		
		this.background.setAttribute("id", "background");
		
		if (this.data.floor === false || this.data.arrow === false) {
			this.background.setAttribute("geometry", `primitive: ${this.data.backgroundShape}; width: ${this.data.backgroundSize.x}; height: ${this.data.backgroundSize.y}`);
			if (this.data.img !== REACH_DEFAULT_NULL) {
				if (this.data.img !== oldData.img || this.data.opacity !== oldData.opacity) {
					this.background.setAttribute("material", `shader: flat; opacity: ${this.data.opacity}; src: ${getSrc(this.data.img)}; transparent: true`);
				}

								
			} else {
				this.background.setAttribute("material", `color: ${this.data.backgroundColor}; shader: flat; opacity: ${this.data.opacity}`);
			}
			if (this.data.text !== oldData.text || this.data.color !== oldData.color) {
				this.background.setAttribute("text", `align: center; color: ${this.data.color}; width: 0.85; wrapCount: 18; value: ${this.data.text};`);
				
			}
		}

		if (this.data.link !== REACH_DEFAULT_NULL ||
			this.data.onClick !== REACH_DEFAULT_NULL ||
			this.data.onMouseEnter !== REACH_DEFAULT_NULL ||
			this.data.onMouseLeave !== REACH_DEFAULT_NULL) {

			this.background.setAttribute("class", "clickable");
		}
		
		if (this.data.link !== REACH_DEFAULT_NULL) {
			
			this.background.setAttribute(
				"reach_passage_link",
				`name: ${this.data.link}; event: click`
			);
		}
		
		if (this.data.arrow === true) {
			if (this.arrow === undefined) {
				this.arrow = document.createElement("a-entity");	
				this.background.appendChild(this.arrow);			
			}

			this.arrow.setAttribute("reach_arrow", {
				distance: 0.0,
				yHeight: -1.0 * yHeight,
				opacity: this.data.opacity,
				color: this.data.backgroundColor,
				link: this.data.link
			});

		} else if (this.data.arrow === false && this.arrow !== undefined) {
			this.background.removeChild(this.arrow);
			this.arrow = undefined;
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
		
		this.el.setAttribute("reach_text_panel", options);
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
				window.story.showError(e, `${window.passage.name}(onTick: reach_text_panel, id: ${this.data.id})`);
				return;				
			}			
		}
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
	
})