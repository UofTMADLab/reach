import {REACH_DEFAULT_NULL, getSrc} from './utility.js';
AFRAME.registerComponent("reach_sound", {
	
	schema: {
		
		direction: {type: "number", default: 0.0},
		directionInDegrees: {type: "boolean", default: false},
		inclination: {type: "number", default: 0.0},
		distance: {type: "number", default: 2.0},
		yHeight: {type: "number", default: 1.6},
		autoplay: {type: "boolean", default: true},
		loop: {type: "boolean", default: true},
		src: {type: "string", default: REACH_DEFAULT_NULL}
		
	},
	init: function() {
		
	},
	update: function(oldData) {
		
		if (this.head) {
			this.el.removeChild(this.head);
			this.head.destroy();
			this.head = undefined;
			this.outer = undefined;
			this.soundElement = undefined;
		}
		
		this.head = document.createElement("a-entity");
		this.head.setAttribute("position", `0 ${this.data.yHeight} 0`);
		this.outer = document.createElement("a-entity");		
		this.outer.setAttribute("rotation", `${(this.data.inclination) % 12 * 30.0} ${this.data.directionInDegrees === true ? this.data.direction : (this.data.direction % 12) * -30.0} 0`);
		
	    this.soundElement = document.createElement("a-sound");
	    this.soundElement.setAttribute("src", getSrc(this.data.src));
	    this.soundElement.setAttribute("position", `0 0 ${this.data.distance}`);

	    this.soundElement.setAttribute("autoplay", this.data.autoplay);
	    this.soundElement.setAttribute("loop", this.data.loop);
		

		this.head.appendChild(this.outer);
		this.outer.appendChild(this.soundElement);

		
		this.el.appendChild(this.head);
	},
	remove: function () {
		if (this.head) {
			this.el.removeChild(this.head);
			this.head.destroy();
			this.head = undefined;
			this.outer = undefined;
			this.soundElement= undefined;
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
	
});