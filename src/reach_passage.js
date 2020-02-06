import {REACH_DEFAULT_NULL, getDirectionBetweenPassages} from './utility.js';
import {getPassageTwinePosition, getPassageById, getPassageByName, getLinksInPassage, getBackgroundsInPassage, getSoundsInPassage, getTextInPassage, getPanelsInPassage, getImagePanelsInPassage, getMixPassages, isCodePassage, isHTMLPassage, isTextPassage, getExternalFunctionsInPassage} from './parsing.js';
import {getPassageSky} from './sky.js';
import {getImagePanel} from './image.js';
import {createSoundElement} from './sound.js';
import {createPassageLink, createPassageText, createPassageHTML} from './link.js';
import {Passage} from './Passage.js';

AFRAME.registerComponent("reach_passage", {
	
	schema: {
		
		id: {type: "string", default: REACH_DEFAULT_NULL},
		name: {type: "string", default: REACH_DEFAULT_NULL},
		hideFromHistory: {type: "boolean", default: false},
		attachToWindow: {type: "boolean", default: true},
		params: {type: "string", default: "{}"},
		//private
		ready: {type: "boolean", default: false}
		
	},
	// init: function() {
	//
	// },
	init: function() {
		this.el.setAttribute("reach_component", "reach_passage");
		if (!this.head) {
			this.head = document.createElement("a-entity");
			this.el.appendChild(this.head);
		}
		
		this.codePassages = [];
		var scene = this.head;
		
		var twinePassageData = undefined;
		if (this.data.id !== REACH_DEFAULT_NULL) {
			this.el.setAttribute("id", this.data.id);
		}
		
		if (this.data.name !== REACH_DEFAULT_NULL) {
			twinePassageData = window.story.passage(this.data.name);
		} 
		
		if (twinePassageData !== undefined) {
			this.passage = new Passage(twinePassageData, this.head);			
		} else {
			var message = `reach: could not find passage with name or pid: ${this.data.name}`;
			window.story.showError(message, this.data.name);
			return;
			
		}
		
		if (this.data.hideFromHistory === false) {
			window.story.history.push(this.passage.name);
		}
	
		if (this.data.attachToWindow === true) {
			window.passage = this.passage;
		}
		
		// trick to ensure that scripts linked to this passage are run after it is loaded
		var self = this;
		this.passage.onReady(()=> {
			if (self.data.ready === false) {
				self.setOption("ready", true);
			}			
		})
		
		try {
		    var processed = window.story.render(this.passage.name, JSON.parse(this.data.params));
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
		  if (isCodePassage(link.link) === true) {
			  this.codePassages.push(link);
		  } else if (isHTMLPassage(link.link) === true) {
  	  		try {
  				link.text = window.story.render(link.link, link.options);
  				link.backgrounds = [];
  				var panelElement = createPassageHTML(link, i, this.passage.position);
  				scene.appendChild(panelElement);
  			} catch (e) {
  				window.story.showError(e, `${this.passage.name}(loading html passage named: ${link.link})`);
  				return;
  			}
		  } else if (isTextPassage(link.link) === true) {

	  		try {
				link.text = window.story.render(link.link, link.options);
				link.backgrounds = [];
				var panelElement = createPassageText(link, i, this.passage.position);
				scene.appendChild(panelElement);
			} catch (e) {
				window.story.showError(e, `${this.passage.name}(loading text passage named: ${link.link})`);
				return;
			}

		  } else {
		      var linkElement = createPassageLink(link, i, this.passage.position);
		      scene.appendChild(linkElement);
		  }

	    }
		
		// load custom codes from extension like [myCode[option1]option2]
		var extFunctions = getExternalFunctionsInPassage(this.passage);
		for (var i = 0; i < extFunctions.length; i++) {
			var ext = extFunctions[i];
			var extPassagePath = ext.nsPath;
			var twinePassageData = window.story.passage(extPassagePath, window.story, true);
			if (twinePassageData !== undefined) {
				try {
					if (twinePassageData.textContent === "Double-click this passage to edit it.") {
						throw "The passage does not contain JavaScript code.";
					}
					
					_.template(`<% ${twinePassageData.textContent} %>`)({
									s: twinePassageData.s,
									p: window.passage, params: ext
								});
				} catch (e) {
					window.story.showError(e, `${this.passage.name} (error in linked code passage named: ${extPassagePath})`)
				}

			} else {
				window.story.showError("", `${this.passage.name}(could not load code passage named: ${extPassagePath})`)
			}
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
		if (this.passage === undefined) {
			return;
		}
		if (this.data.ready === false) {
			return;
		}
		for (var i = 0; i < this.codePassages.length; i++) {
			var codePassageLink = this.codePassages[i];
			var twinePassageData = window.story.passage(codePassageLink.link);
			if (twinePassageData !== undefined) {
				try {
					if (twinePassageData.textContent === "Double-click this passage to edit it.") {
						throw "The passage does not contain JavaScript code.";
					}
					var codePassageParams = codePassageLink.options;
					codePassageParams.twineDirection =  getDirectionBetweenPassages(this.passage.position, codePassageLink.twinePosition) / 360.0 * -12.0;
					_.template(`<% ${twinePassageData.textContent} %>`)({
									s: twinePassageData.s,
									p: window.passage,
						params: codePassageParams
								});
				} catch (e) {
					window.story.showError(e, `${this.passage.name} (error in linked code passage named: ${codePassageLink.link})`)
				}

			} else {
				window.story.showError("", `${this.passage.name}(could not load code passage named: ${codePassageName})`)
			}
		}
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
			localOptions.params = JSON.stringify(mixed.options);
			try {
				mixedElement.setAttribute("reach_passage_name", mixed.name);
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
	setOption : function(name, value) {
		var options = {};
		options[name] = value;
		
		this.el.setAttribute("reach_passage", options);
	},
	
	getOption : function(name) {
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
	
});