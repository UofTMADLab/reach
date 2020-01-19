import {REACH_DEFAULT_NULL} from './utility.js';
import {getPassageTwinePosition, getPassageById, getPassageByName, getLinksInPassage, getBackgroundsInPassage, getSoundsInPassage, getTextInPassage, getPanelsInPassage, getImagePanelsInPassage, getMixPassages} from './parsing.js';
import {getPassageSky} from './sky.js';
import {getImagePanel} from './image.js';
import {createSoundElement} from './sound.js';
import {createPassageLink, createPassageText} from './link.js';
import {Passage} from './Passage.js';

AFRAME.registerComponent("reach_passage", {
	
	schema: {
		
		id: {type: "string", default: REACH_DEFAULT_NULL},
		name: {type: "string", default: REACH_DEFAULT_NULL},
		hideFromHistory: {type: "boolean", default: false},
		attachToWindow: {type: "boolean", default: true},
		// params: {
		// 	default: {},
		// 	parse: function(value) {
		// 		return JSON.parse(value);
		// 	},
		// 	stringify: function(value) {
		// 		return JSON.stringify(value);
		// 	}
		// }
		
		
	},
	// init: function() {
	//
	// },
	init: function() {
		
		if (!this.head) {
			this.head = document.createElement("a-entity");
			this.el.appendChild(this.head);
		}
		
		
		var scene = this.head;
		
		var twinePassageData = undefined;
		if (this.data.id !== REACH_DEFAULT_NULL) {
			twinePassageData = window.story.passage(this.data.id);
		} else if (this.data.name !== REACH_DEFAULT_NULL) {
			twinePassageData = window.story.passage(this.data.name);
		} 
		
		if (twinePassageData) {
			this.passage = new Passage(twinePassageData, this.head);			
		} else {
			var message = `reach: could not find passage with name or pid: ${this.data.id}`;
			console.log(message);
			throw message;
			
		}
		
		if (this.data.hideFromHistory === false) {
			window.story.history.push(this.passage.id);
		}
		
		if (this.data.attachToWindow === true) {
			window.passage = this.passage;
		}
		
		try {
		    var processed = window.story.render(this.passage.id);
		} catch (e) {
			window.story.showError(e, this.passage.name);
			return;
		}

	    this.passage.processedContent = processed;
		
	    var backgrounds = getBackgroundsInPassage(this.passage);
	    for (var i = 0; i < backgrounds.length; i++) {
	  	  var sky = getPassageSky(backgrounds[i], this.passage.name);
	  	  if (sky !== null) {
	  	  	scene.appendChild(sky);
	  	  }
    
	    }
 
	    var links = getLinksInPassage(this.passage);
	    for (var i = 0; i < links.length; i++) {
	      var link = links[i];
	      var linkElement = createPassageLink(link, i, this.passage.position);
	      scene.appendChild(linkElement);
	    }
  
	    var panels = getPanelsInPassage(this.passage);
	    for (var i = 0; i < panels.length; i++) {
	  	  var panel = panels[i];
	  	  var panelElement = createPassageText(panel, i, this.passage.position);
	  	  scene.appendChild(panelElement);
	    }
		
		var imagePanels = getImagePanelsInPassage(this.passage);
		for (var i = 0; i < imagePanels.length; i++) {
			var imagePanel = imagePanels[i];
			var panelElement = getImagePanel(imagePanel);
			scene.appendChild(panelElement);
		}

	    var sounds = getSoundsInPassage(this.passage);
	    for (var i = 0; i < sounds.length; i++) {
	      var sound = sounds[i];
	      var soundElement = createSoundElement(sound);
	      scene.appendChild(soundElement);
	    }
		

		
		if (this.data.attachToWindow === true) {
			// var allBackgrounds = scene.querySelectorAll("a-sky");
		    if (backgrounds.length === 0) {
		    	  // var textBlock = getTextInPassage(passage);
		    	  // var textElement = createPassageText(textBlock, 0, currentPassageTwinePosition);
		    	  // scene.appendChild(textElement);
		    	  var defaultSky = getPassageSky({options:{"transparent":false}}, this.passage.name);
		    	  scene.appendChild(defaultSky);
		    }
		}


		
	},
	update: function(oldData) {
		var mixPassages = getMixPassages(this.passage);
		for (var i = 0; i < mixPassages.length; i++) {
			var mixed = mixPassages[i];
			if (window.traversedPassages[mixed.name] === true) {
				continue;
			}
			window.traversedPassages[mixed.name] = true;
			var mixedElement = document.createElement("a-entity");
			this.head.appendChild(mixedElement);
			var localOptions = mixed.options;
			localOptions.name = mixed.name;
			localOptions.hideFromHistory = true;
			localOptions.attachToWindow = false;
			try {
				mixedElement.setAttribute("reach_passage", localOptions);				
			} catch (e) {
				window.story.showError(e, mixed.name);
				return;
			}
			
		}
	},
	remove: function () {
		if (this.head) {
			this.el.removeChild(this.head);
			this.head.destroy();
			this.head = undefined;
			this.passage.destroy();
			this.passage = undefined;
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