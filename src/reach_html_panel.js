import {REACH_DEFAULT_NULL, getSrc, CreateUUID} from './utility.js';



AFRAME.registerComponent("reach_html_panel", {
	
	schema: {
		
		id: {type: "string", default: REACH_DEFAULT_NULL},
		direction: {type: "number", default: 0.0},
		directionInDegrees: {type: "boolean", default: false},
		inclination: {type: "number", default: 0.0},
		distance: {type: "number", default: 2.0},
		scale: {type: "vec2", default:{x: 1.0, y: 1.0}},
		yHeight: {type: "number", default: 1.6},
		backgroundSize: {type: "vec2", default: {x:1.5, y:1.5 / 8.5 * 11.0}},
		text:{type: "string", default: ""},
		backgroundColor: {type: "color", default: "#ffffff"},
		opacity: {type: "number", default: 0.7},
		backgroundShape: {type: "string", default: "plane"},
		img: {type: "string", default: REACH_DEFAULT_NULL},
		debugCanvas: {type: "boolean", default: false},
		
		link: {type: "string", default: REACH_DEFAULT_NULL},
		
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
		this.el.setAttribute("reach_component", "reach_html_panel");
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
			this.registerEvents("onClick", this.background, "click", "reach_html_panel");
			this.registerEvents("onMouseEnter", this.background, "mouseenter", "reach_html_panel");
			this.registerEvents("onMouseLeave", this.background, "mouseleave", "reach_html_panel");
			this.registerEvents("onLoaded", this.el, "loaded", "reach_html_panel", true);
			
			this.outerTextureElement = document.createElement("div");
			


			
			
			this.outerTextureElement.setAttribute("style", "z-index:-1;");
			
			this.textureElement = document.createElement("div");
			this.textureID = "tex" + CreateUUID();
			this.textureElement.setAttribute("id", this.textureID);
			
			window.htmlTextureRendering.appendChild(this.outerTextureElement);
			this.outerTextureElement.appendChild(this.textureElement);
			
			this.el.appendChild(this.head);
			
			if (this.data.debugCanvas === true){
				this.debugElement = document.createElement("div");
				this.debugTextureID = this.textureID + "_debug";
				this.debugElement.setAttribute("id", this.debugTextureID);
				window.htmlTextureRendering.appendChild(this.debugElement);
			}
			

			
			// var self = this;

			// this.textureElement.addEventListener("onload", (e) => {
			// 	if (self.background === undefined) {
			// 		return;
			// 	}
			// 	console.log("loaded texture element");
			// 	self.background.setAttribute("material", `shader: html; target: #${this.textureID}; ratio: height; transparent: true;`);
			// });
			//
			// _.delay(() => {
			// 	self.background.setAttribute("material", `shader: html; target: #${this.textureID}; ratio: height; transparent: true;`);
			// }, 2000);
			
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
		this.background.setAttribute("geometry", `primitive: ${this.data.backgroundShape}; width: ${this.data.backgroundSize.x}; height: ${this.data.backgroundSize.y}`);
		this.background.setAttribute("scale", {x: this.data.scale.x, y: this.data.scale.y, z: 1.0});
		
		this.outerTextureElement.setAttribute("style", "width: 100%; height: 100%; position: fixed; left: 0; top: 0; overflow: hidden; z-index:-1;");
		this.textureElement.setAttribute("style", `width: 2000px; font-size: 128px; padding: 100px; color: #000000; text-align: left; background-color:${this.data.backgroundColor};`);
		
		this.textureElement.innerHTML = this.data.text;

		
		var textureID = this.textureID;
		var background = this.background;
		var debugTextureID = this.debugTextureID;
		if (this.debugTextureID !== undefined) {
			background.setAttribute("material", `shader: html; target: #${textureID}; ratio: height; transparent: true; debug: #${debugTextureID}; fps: 0.5;`);
			
		} else {
			background.setAttribute("material", `shader: html; target: #${textureID}; ratio: height; transparent: true; fps: 0.5; `);
		}


		
		
		// window.setTimeout(() => {
		// 	console.log("rendered");
		//
		// }, 3000);
		
		// if (this.data.floor === false) {
		// 	this.background.setAttribute("geometry", `primitive: ${this.data.backgroundShape}; width: ${this.data.backgroundSize.x}; height: ${this.data.backgroundSize.y}`);
		// 	if (this.data.img !== REACH_DEFAULT_NULL) {
		// 		if (this.data.img !== oldData.img || this.data.opacity !== oldData.opacity) {
		// 			this.background.setAttribute("material", `shader: flat; opacity: ${this.data.opacity}; src: ${getSrc(this.data.img)}; transparent: true`);
		// 		}
		//
		//
		// 	} else {
		// 		this.background.setAttribute("material", `color: ${this.data.backgroundColor}; shader: flat; opacity: ${this.data.opacity}`);
		// 	}
		// 	if (this.data.text !== oldData.text || this.data.color !== oldData.color) {
		// 		this.background.setAttribute("text", `align: center; color: ${this.data.color}; width: 0.85; wrapCount: 18; value: ${this.data.text};`);
		//
		// 	}
		// }

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
			this.outerTextureElement.remove();
			this.outerTextureElement = undefined;
			if (this.debugElement !== undefined) {
				this.debugElement.remove();
				this.debugElement = undefined;
			}
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
		
		this.el.setAttribute("reach_html_panel", options);
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
				window.story.showError(e, `${window.passage.name}(onTick: reach_html_panel, id: ${this.data.id})`);
				return;				
			}			
		}
	},
	
	render: function() {
		this.background.components.material.shader.__render();
	},
	
	eventTargetElement: function() {
		return this.head;
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