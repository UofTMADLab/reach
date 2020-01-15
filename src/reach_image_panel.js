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

	},
	init: function() {
		var self = this;
		this.imageLoadedHandler = function(evt) {

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

		if (this.head) {

			this.el.removeChild(this.head);
			this.head.destroy();
			this.head = undefined;
			this.outer = undefined;
			this.inner = undefined;
			this.background = undefined;
		}
		if (this.data.id !== REACH_DEFAULT_NULL) {
			this.el.setAttribute("id", this.data.id);
		}
		// override default yHeight & rotate to face up if floor-link
		var yHeight = this.data.floor === true ? 0 : this.data.yHeight;
		var innerRotation = (this.data.floor === true) ? -90.0 : 0.0;
		this.head = document.createElement("a-entity");
		this.head.setAttribute("position", `0 ${yHeight} 0`);
		this.outer = document.createElement("a-entity");
		this.outer.setAttribute("rotation", `${(this.data.inclination) % 12 * 30.0} ${this.data.directionInDegrees === true ? this.data.direction : (this.data.direction % 12) * -30.0} 0`);
		this.inner = document.createElement("a-entity");
		this.inner.setAttribute("position", `0 0 ${-1.0 * this.data.distance}`);
		this.inner.setAttribute("rotation", `${innerRotation} 0 0`);

		this.background = document.createElement("a-entity");
		this.background.setAttribute("id", "background");


		this.background.setAttribute("geometry", `primitive: plane;`);

		if (this.data.img !== REACH_DEFAULT_NULL) {
			this.background.addEventListener("materialtextureloaded", this.imageLoadedHandler);
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

		this.registerEvents(this.data.onClick, this.background, "click", "reach_image_panel");
		this.registerEvents(this.data.onMouseEnter, this.background, "mouseenter", "reach_image_panel");
		this.registerEvents(this.data.onMouseLeave, this.background, "mouseleave", "reach_image_panel");

		this.head.appendChild(this.outer);
		this.outer.appendChild(this.inner);
		this.inner.appendChild(this.background);

		this.el.appendChild(this.head);
	},
	remove: function() {
		if (this.head) {
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

	registerEvents: function(eventNames, sourceEntity, sourceEvent, componentName) {
		if (this.data.eventNames === REACH_DEFAULT_NULL) {
			return;
		}
		if (!sourceEvent) {
			return;
		}
		var events = eventNames.split(" ");
		var emitter = this.el;
		sourceEntity.addEventListener(sourceEvent, function(evt) {
			for (var i in events) {
				var eventName = events[i];
				emitter.emit(eventName, {
					source: emitter.components[componentName]
				});
			}
		})
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
