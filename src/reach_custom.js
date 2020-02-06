import {
	REACH_DEFAULT_NULL,
	REACH_DEFAULT_NULL_NUMBER,
} from './utility.js';

AFRAME.registerComponent("reach_custom", {

	schema: {

		id: {
			type: "string",
			default: REACH_DEFAULT_NULL
		},
		name: {
			type: "string",
		default: "custom"
		}

	},
	init: function() {
		this.el.setAttribute("reach_component", "reach_custom");
		if (this.data.id !== undefined) {
			this.el.setAttribute("id", this.data.id);
		}
		
		if (this.initCallback !== undefined) {
			this.initCallback(this);
		}
	},
	update: function(oldData) {




	},
	remove: function() {

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
		this.el.setAttribute("reach_custom", options);
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
				window.story.showError(e, `${window.passage.name}(onTick: reach_custom, id: ${this.data.id})`);
				return;				
			}			
		}
	},
	
	eventTargetElement: function() {
		return this.el;
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
