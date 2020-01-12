import {REACH_DEFAULT_NULL} from './utility.js';
import {getPassageTwinePosition, getPassageById, getPassageByName, getLinksInPassage, getBackgroundsInPassage, getSoundsInPassage, getTextInPassage, getPanelsInPassage} from './parsing.js';
import {getPassageSky} from './sky.js';
import {createSoundElement} from './sound.js';
import {createPassageLink, createPassageText} from './link.js';


AFRAME.registerComponent("reach_passage", {
	
	schema: {
		
		id: {type: "string", default: REACH_DEFAULT_NULL},
		name: {type: "string", default: REACH_DEFAULT_NULL},
		hideFromHistory: {type: "boolean", default: false}
		
	},
	init: function() {
		
	},
	update: function(oldData) {
		
		if (this.head) {
			this.el.removeChild(this.head);
			this.head.destroy();
			this.head = undefined;
			this.passage = undefined;
		}
		

		if (this.data.id !== REACH_DEFAULT_NULL) {
			this.passage = window.story.passage(this.data.id);
		} else if (this.data.name !== REACH_DEFAULT_NULL) {
			this.passage = window.story.passage(this.data.name);
		} 
		
		if (this.passage === undefined) {
			console.log("reach warning: no passage provided to reach_passage component");
			return;
		}
		
		if (this.data.hideFromHistory === false) {
			window.story.history.push(this.passage.getAttribute("pid"));
		}
		
		window.passage = {
			id: this.passage.getAttribute("pid"),
			name: this.passage.getAttribute("name"),
			tags: this.passage.getAttribute("tags"),
			position: getPassageTwinePosition(this.passage),
			source: this.passage.textContent
		}
		
		
		this.head = document.createElement("a-entity");
		var scene = this.head;
		
	    var processed = window.story.render(this.passage.getAttribute("pid"));
	    this.passage.processedContent = processed;
	    var backgrounds = getBackgroundsInPassage(this.passage);
	    for (var i = 0; i < backgrounds.length; i++) {
	  	  var sky = getPassageSky(backgrounds[i], window.passage.name);
	  	  if (sky !== null) {
	  	  	scene.appendChild(sky);
	  	  }
    
	    }

	    var links = getLinksInPassage(this.passage);
	    for (var i = 0; i < links.length; i++) {
	      var link = links[i];
	      var linkElement = createPassageLink(link, i, window.passage.position);
	      scene.appendChild(linkElement);
	    }
  
	    var panels = getPanelsInPassage(this.passage);
	    for (var i = 0; i < panels.length; i++) {
	  	  var panel = panels[i];
	  	  var panelElement = createPassageText(panel, i, window.passage.position);
	  	  scene.appendChild(panelElement);
	    }

	    var sounds = getSoundsInPassage(this.passage);
	    for (var i = 0; i < sounds.length; i++) {
	      var sound = sounds[i];
	      var soundElement = createSoundElement(sound);
	      scene.appendChild(soundElement);
	    }

	    if (backgrounds.length === 0) {
	    	  // var textBlock = getTextInPassage(passage);
	    	  // var textElement = createPassageText(textBlock, 0, currentPassageTwinePosition);
	    	  // scene.appendChild(textElement);
	    	  var defaultSky = getPassageSky({options:{"transparent":false}}, window.passage.name);
	    	  scene.appendChild(defaultSky);
	    }

		
		this.el.appendChild(this.head);
	},
	remove: function () {
		if (this.head) {
			this.el.removeChild(this.head);
			this.head.destroy();
			this.head = undefined;
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