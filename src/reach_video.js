import {REACH_DEFAULT_NULL, getSrc} from './utility.js';

AFRAME.registerComponent("reach_video", {
	
	schema: {
		id: {type: "string", default: "REACH_DEFAULT_NULL"},
		autoplay: {type: "boolean", default: true},
		loop: {type: "boolean", default: true},
		videoId: {type: "string", default: "video"},
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
		
	    this.sky = document.createElement("a-videosphere");
		this.sky.setAttribute("src", `#${this.data.videoId}`);
		this.el.appendChild(this.sky);
		if (this.data.autoplay === true) {
			videoAsset.play();
		}
		
		
	},
	remove: function () {
		if (this.sky) {
			this.el.removeChild(this.sky);
			this.sky.destroy();
		}
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
	
});