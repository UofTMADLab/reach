import {getPassageTwinePosition} from './parsing.js';
import {createPassageLink, createPassageText} from './link.js';
import {getPassageSky} from './sky.js';
import {getImagePanel} from './image.js';
import {createSoundElement} from './sound.js';
import {createVideoSphere} from './video.js';


// methods and properties that are exposed to code in the story/passage via the 'p' variable or 'window.passage'
function Passage(twinePassageData, passageContainer) {
	
	this.id = twinePassageData.getAttribute("pid");
	this.name = twinePassageData.getAttribute("name");
	this.tags = twinePassageData.getAttribute("tags");
	this.position = getPassageTwinePosition(twinePassageData);
	this.source = twinePassageData.textContent;
	this.passageData = twinePassageData;
	this.container = passageContainer;
	this.onReadyCallback = undefined;
	this.deferredCallbacks = [];
	
	
	var self = this;
	this.onReady(function() {
		for (var i in self.deferredCallbacks) {
			self.deferredCallbacks[i]();
		}
		self.deferredCallbacks = undefined;
	});
}

Passage.prototype.destroy = function() {
	this.id = undefined;
	this.name = undefined;
	this.tags = undefined;
	this.position = undefined;
	this.source = undefined;
	this.passageData = undefined;
	this.container = undefined;
	this.onReadyCallback = undefined;
	this.deferredCallbacks = undefined;
}

Passage.prototype.onReady = function(callback) {
	this.container.addEventListener("loaded", callback);
}

// private: when passage code is rendered, the static scene elements in the passage have not been loaded yet
// we'll defer loading any dynamic objects created in code until the passage is finished initializing
Passage.prototype.deferIfNecessary = function(callback) {	
	if (this.deferredCallbacks) {
		var self = this;
		this.deferredCallbacks.push(function(){callback.apply(self)});
	} else {
		callback.apply(this);
	}
}

Passage.prototype.hide = function() {
	this.container.object3D.visible = false;
}

Passage.prototype.show = function() {
	this.container.object3D.visible = true;
}

Passage.prototype.textPanel = function(text, options) {
	var newPanel = createPassageText({text: text, options: (options ? options : {})}, -1);
	this.deferIfNecessary(function() {this.container.appendChild(newPanel);});
	return newPanel.components.reach_text_panel;
}

Passage.prototype.linkPanel = function(text, link, options) {
	var newPanel = createPassageLink({text: text, link: link, options: (options ? options : {})}, -1);
	this.deferIfNecessary(function() {this.container.appendChild(newPanel);});
	return newPanel.components.reach_text_panel;
}

Passage.prototype.imagePanel = function(img, link, options) {
	var newPanel = getImagePanel({img: img, link: link, options: (options ? options : {})});
	this.deferIfNecessary(function() {this.container.appendChild(newPanel);});
	return newPanel.components.reach_image_panel;
}

Passage.prototype.sky = function(img, options) {
	var newSky = getPassageSky({src: img, options: (options ? options : {})}, this.name);
	this.deferIfNecessary(function() {this.container.appendChild(newSky);});
	return newSky.components.reach_sky;
}

Passage.prototype.video = function(src, options) {

	var newSky = createVideoSphere({src: src, options:  (options ? options : {})}, this.name);
	this.deferIfNecessary(function() {this.container.appendChild(newSky);});
	return newSky.components.reach_video;
}

Passage.prototype.sound = function(src, options) {
	var newSound = createSoundElement({src: src, options: (options ? options : {})});
	this.deferIfNecessary(function() {this.container.appendChild(newSound);});
	return newSound.components.reach_sound;
}

Passage.prototype.getComponentWithId = function(id, componentType) {
	var el = this.container.querySelector(`[${componentType}]#${id}`);
	if (el) {
		return el.components[componentType];
	} else {
		return undefined;
	}
}

Passage.prototype.getAllComponentsOfType = function(componentType) {
	var els = this.container.querySelectorAll(`[${componentType}]`);
	if (els) {
		return Array.prototype.map.call(els, function(el) {return el.components[componentType];});
	} else {
		return [];
	}
}

Passage.prototype.getSky = function(id){
	return this.getComponentWithId(id, "reach_sky");
}

Passage.prototype.skies = function() {
	return this.getAllComponentsOfType("reach_sky");
}

Passage.prototype.getImagePanel = function(id) {
	return this.getComponentWithId(id, "reach_image_panel");
}

Passage.prototype.imagePanels = function() {
	return this.getAllComponentsOfType("reach_image_panel");
}

Passage.prototype.getSound = function(id) {
	return this.getComponentWithId(id, "reach_sound");
}

Passage.prototype.sounds = function() {
	return this.getAllComponentsOfType("reach_sound");
}

Passage.prototype.getTextPanel = function(id) {
	return this.getComponentWithId(id, "reach_text_panel");
}

Passage.prototype.textPanels = function() {
	return this.getAllComponentsOfType("reach_text_panel");
}

Passage.prototype.getLinkPanel = function(id) {
	return this.getComponentWithId(id, "reach_text_panel");
}

Passage.prototype.linkPanels = function() {
	return this.getAllComponentsOfType("reach_text_panel");
}

Passage.prototype.getVideo = function(id) {
	return this.getComponentWithId(id, "reach_video");
}

Passage.prototype.videos = function() {
	return this.getAllComponentsOfType("reach_video");
}

Passage.prototype.on = function(eventName, callback) {
	var superCallback = function (e) {
		callback(e.detail.source, e);
	}
	this.container.addEventListener(eventName, superCallback);
}

// Passage.prototype.fireOnReady = function() {
// 	if (this.onReadyCallback) {
// 		this.onReadyCallback(this);
// 	}
// }
export {Passage};