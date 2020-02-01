import {
	REACH_DEFAULT_NULL,
	REACH_DEFAULT_NULL_NUMBER,
	getSrc
} from './utility.js';

AFRAME.registerComponent("reach_image_panel", {

	schema: {

		id: {
			type: "string",
			default: REACH_DEFAULT_NULL
		},
		direction: {
			type: "number",
			default: 0.0
		},
		directionInDegrees: {
			type: "boolean",
			default: false
		},
		inclination: {
			type: "number",
			default: 0.0
		},
		distance: {
			type: "number",
			default: 2.0
		},
		scale: {type: "vec2", default:{x: 1.0, y: 1.0}},
		yHeight: {
			type: "number",
			default: 1.6
		},
		width: {
			type: "number",
			default: REACH_DEFAULT_NULL_NUMBER
		},
		height: {
			type: "number",
			default: REACH_DEFAULT_NULL_NUMBER
		},
		opacity: {
			type: "number",
			default: 1.0
		},
		img: {
			type: "string",
			default: REACH_DEFAULT_NULL
		},
		link: {
			type: "string",
			default: REACH_DEFAULT_NULL
		},
		floor: {
			type: "boolean",
			default: false
		},
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
		this.imageLoadedHandler = function(evt) {
			if (evt.target !== self.background) {
				return;
			}

			var image = evt.target.getObject3D('mesh').material.map.image;
			var width = image.naturalWidth;
			var height = image.naturalHeight;
			if (width === 0 || height === 0) {
				return;
			}
			var aspect = height / width;
			if (aspect === 0) {
				return;
			}
			var localWidth = 1.0;
			var localHeight = aspect;
			if (self.data.width !== REACH_DEFAULT_NULL_NUMBER && self.data.height == REACH_DEFAULT_NULL_NUMBER) {
				localWidth = self.data.width;
				localHeight = aspect * localWidth;
			} else if (self.data.width == REACH_DEFAULT_NULL_NUMBER && self.data.height !== REACH_DEFAULT_NULL_NUMBER) {
				localHeight = self.data.height;
				localWidth = localHeight / aspect;
			} else if (self.data.width !== REACH_DEFAULT_NULL_NUMBER && self.data.height !== REACH_DEFAULT_NULL_NUMBER) {
				localWidth = self.data.width;
				localHeight = self.data.height;
			}

			self.background.setAttribute("geometry", `primitive: plane; width: ${localWidth}; height: ${localHeight}`);
		}
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
			
			this.background.addEventListener("materialtextureloaded", this.imageLoadedHandler);

			this.removeEventListeners = [];
			// new cursor events can't be registered on further updates to this component
			this.registerEvents("onClick", this.background, "click", "reach_image_panel");
			this.registerEvents("onMouseEnter", this.background, "mouseenter", "reach_image_panel");
			this.registerEvents("onMouseLeave", this.background, "mouseleave", "reach_image_panel");
			this.registerEvents("onLoaded", this.el, "loaded", "reach_image_panel", true);
			this.el.appendChild(this.head);
		}
		if (this.data.id !== REACH_DEFAULT_NULL) {
			this.el.setAttribute("id", this.data.id);
		}
		// override default yHeight & rotate to face up if floor-link
		var yHeight = this.data.floor === true ? 0 : this.data.yHeight;
		var innerRotation = (this.data.floor === true) ? -90.0 : 0.0;

		this.head.setAttribute("position", `0 ${yHeight} 0`);

		this.outer.setAttribute("rotation", `${(this.data.inclination) % 12 * 30.0} ${this.data.directionInDegrees === true ? this.data.direction : (this.data.direction % 12) * -30.0} 0`);

		this.inner.setAttribute("position", `0 0 ${-1.0 * this.data.distance}`);
		this.inner.setAttribute("rotation", `${innerRotation} 0 0`);

		this.background.setAttribute("id", "background");
		this.background.setAttribute("scale",  {x: this.data.scale.x, y: this.data.scale.y, z: 1.0});

		this.background.setAttribute("geometry", `primitive: plane;`);

		if (this.data.img !== REACH_DEFAULT_NULL) {
			
			this.background.setAttribute("material", `shader: flat; opacity: ${this.data.opacity}; src: ${getSrc(this.data.img)}; transparent: true`);

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




	},
	remove: function() {
		if (this.head) {
			for (var i in this.removeEventListners) {
				this.removeEventListners[i]();
			}
			this.removeEventListners = [];
			if (this.background) {
				console.log("removed");
				this.background.removeEventListener("materialtextureloaded", this.imageLoadedHandler);
			}
			this.el.removeChild(this.head);
			this.head.destroy();
			this.head = undefined;
			this.outer = undefined;
			this.inner = undefined;
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

	hide: function() {
		this.el.object3D.visible = false;
	},

	show: function() {
		this.el.object3D.visible = true;
	},

	setOption: function(name, value) {
		var options = {};
		options[name] = value;
		this.el.setAttribute("reach_image_panel", options);
	},

	getOption: function(name) {
		return this.data[name];
	},


	tick: function(time, timeDelta) {
		if (this.tickCallback !== undefined) {
			try {
				this.tickCallback(this, time, timeDelta);
			} catch (e) {
				this.tickCallback = undefined;
				window.story.showError(e, `${window.passage.name}(onTick: reach_image_panel, id: ${this.data.id})`);
				return;				
			}			
		}
	},
	
	eventTargetElement: function() {
		return this.head;
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

})
