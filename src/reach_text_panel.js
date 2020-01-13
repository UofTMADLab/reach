import {REACH_DEFAULT_NULL} from './utility.js';

AFRAME.registerComponent("reach_text_panel", {
	
	schema: {
		
		
		direction: {type: "number", default: 0.0},
		directionInDegrees: {type: "boolean", default: false},
		inclination: {type: "number", default: 0.0},
		distance: {type: "number", default: 2.0},
		yHeight: {type: "number", default: 1.6},
		backgroundSize: {type: "vec2", default: {x:1.5, y:1.5 / 8.5 * 11.0}},
		text:{type: "string", default: ""},
		backgroundColor: {type: "color", default: "#ffffff"},
		backgroundOpacity: {type: "number", default: 0.7},
		backgroundShape: {type: "string", default: "plane"},
		backgroundSrc: {type: "string", default: REACH_DEFAULT_NULL},
		color: {type: "color", default: "#000000"},
		link: {type: "string", default: REACH_DEFAULT_NULL},
		arrow: {type: "boolean", default: false},
		floor: {type: "boolean", default: false}
		
	},
	init: function() {
		
	},
	update: function(oldData) {
		
		if (this.head) {
			this.el.removeChild(this.head);
			this.head.destroy();
			this.head = undefined;
			this.outer = undefined;
			this.inner= undefined;
			this.background = undefined;
		}
		// override default yHeight & rotate to face up if floor-link
		var yHeight = this.data.floor === true ? 0 : this.data.yHeight;
		var innerRotation = (this.data.floor === true && this.data.arrow === false) ? -90.0 : 0.0;
		this.head = document.createElement("a-entity");
		this.head.setAttribute("position", `0 ${yHeight} 0`);
		this.outer = document.createElement("a-entity");		
		this.outer.setAttribute("rotation", `${(this.data.inclination) % 12 * 30.0} ${this.data.directionInDegrees === true ? this.data.direction : (this.data.direction % 12) * -30.0} 0`);
		this.inner = document.createElement("a-entity");
		this.inner.setAttribute("position", `0 0 ${-1.0 * this.data.distance}`);
		this.inner.setAttribute("rotation", `${innerRotation} 0 0`);

		this.background = document.createElement("a-entity");
		this.background.setAttribute("id", "background");
		
		if (this.data.floor === false || this.data.arrow === false) {
			this.background.setAttribute("geometry", `primitive: ${this.data.backgroundShape}; width: ${this.data.backgroundSize.x}; height: ${this.data.backgroundSize.y}`);
			if (this.data.backgroundSrc !== REACH_DEFAULT_NULL) {
				this.background.setAttribute("material", `shader: flat; opacity: ${this.data.backgroundOpacity}; src: ${this.data.backgroundSrc}; transparent: true`);
			} else {
				this.background.setAttribute("material", `color: ${this.data.backgroundColor}; shader: flat; opacity: ${this.data.backgroundOpacity}`);
			}
			this.background.setAttribute("text", `align: center; color: ${this.data.color}; width: 0.85; wrapCount: 18; value: ${this.data.text};`);
		}

		
		if (this.data.link !== REACH_DEFAULT_NULL) {
			this.background.setAttribute("class", "clickable");
			this.background.setAttribute(
				"reach_passage_link",
				`name: ${this.data.link}; event: click`
			);
		}
		
		if (this.data.arrow === true) {
			var arrow = document.createElement("a-entity");
			arrow.setAttribute("reach_arrow", {
				distance: 0.0,
				yHeight: -1.0 * yHeight,
				opacity: this.data.backgroundOpacity,
				color: this.data.backgroundColor,
				link: this.data.link
			});
			this.background.appendChild(arrow);
		}
		
		this.head.appendChild(this.outer);
		this.outer.appendChild(this.inner);
		this.inner.appendChild(this.background);
		
		this.el.appendChild(this.head);
	},
	remove: function () {
		if (this.head) {
			this.el.removeChild(this.head);
			this.head.destroy();
			this.head = undefined;
			this.outer = undefined;
			this.inner= undefined;
			this.background = undefined;
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