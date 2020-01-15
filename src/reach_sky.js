import {REACH_DEFAULT_NULL, getSrc} from './utility.js';

AFRAME.registerComponent("reach_sky", {
	
	schema: {
		id: {type: "string", default: REACH_DEFAULT_NULL},
		distance: {type: "number", default: 5000.0},
		transparent: {type: "boolean", default: true},
		src: {type: "string", default: "#reach-default-360"}
		
	},
	init: function() {
		
	},
	update: function(oldData) {
		
		if (this.sky) {
			this.el.removeChild(this.sky);
			this.sky.destroy();
		}
		
		if (this.data.id !== REACH_DEFAULT_NULL) {
			this.el.setAttribute("id", this.data.id);
		}
	    this.sky = document.createElement("a-sky");
		this.sky.setAttribute("src", getSrc(this.data.src));
	    this.sky.setAttribute("transparent", this.data.transparent);
	    this.sky.setAttribute("radius", this.data.distance);
	    this.sky.setAttribute("opacity", 0);

	    this.sky.setAttribute("animation", {
	    	  property: "opacity",
	    	  to: 1.0,
	    	  startEvents: "materialtextureloaded"
	    });
		
		this.el.appendChild(this.sky);
	},
	remove: function () {
		if (this.sky) {
			this.el.removeChild(this.sky);
			this.sky.destroy();
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
	}
	
});