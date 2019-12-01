console.log("REACH-0.0.18,18");
import './underscore-min.js';
import {getSrc, removeAllChildren} from './utility.js';
import {getPassageSky} from './sky.js';
import {createSoundElement} from './sound.js';
import {createPassageLink, createPassageText} from './link.js';
import './arrow.js';

var storyDocument;
var startnode;

// var currentPassageTwinePosition;

function loadPassage(passage) {
	// videoElement.components.material.material.map.image.pause();

	// videoElement.getAttribute("src").pause();

    // currentPassageName = passage.getAttribute("name");
    // currentPassageTwinePosition = getPassageTwinePosition(passage);
	
    var videoElements = document.querySelectorAll("video");

	if (videoElements !== null){

		for (var i = 0; i < videoElements.length; i++) {
			
			videoElements[i].pause();
		}

	}
    
	
  var scene = document.querySelector("#container");
  removeAllChildren(scene);
  // currentPassageTwinePosition = getPassageTwinePosition(passage);

  
  document.querySelector("a-scene").setAttribute("background", "color: black");
  
  var processed = window.story.render(passage.getAttribute("pid"));
  passage.processedContent = processed;
  var backgrounds = getBackgroundsInPassage(passage);
  for (var i = 0; i < backgrounds.length; i++) {
	  var sky = getPassageSky(backgrounds[i], window.passage.name);
	  if (sky !== null) {
	  	scene.appendChild(sky);
	  }
    
  }

  var links = getLinksInPassage(passage);
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    var linkElement = createPassageLink(link, i, window.passage.position);
    scene.appendChild(linkElement);
  }
  
  var panels = getPanelsInPassage(passage);
  for (var i = 0; i < panels.length; i++) {
	  var panel = panels[i];
	  var panelElement = createPassageText(panel, i, window.passage.position);
	  scene.appendChild(panelElement);
  }

  var sounds = getSoundsInPassage(passage);
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


}
function getPassageById(passageId) {
	return window.story.passage(passageId);
}
function getPassageByName(name) {
	return window.story.passage(name);
}

function getPassageTwinePosition(passage) {
	if (passage === undefined){
		console.log(`could not find position of passage with name: ${name}`)
		return {x:0, y:0};
	}
	var coordString = passage.getAttribute("position");
	if (coordString === undefined) {
		return {x:0, y:0};
	}
	var coordA = coordString.split(",");
	console.log(coordA);
	return {x:coordA[0], y:coordA[1]};
}

function getLinksInPassage(passage) {
	// match beginning of text, or options JSON, or any character other than `, then [[text]] or [[text|link]], with optional spaces between
	// brackets and json/text
  var rexp = /(^|({\s*(.+)\s*})|[^`])\[\[\s*((.+)\s*\|\s*(.+)\s*|(.+)\s*)\]\]/g;
  var passageText = passage.processedContent;
  var links = [];
  var array1;
  while ((array1 = rexp.exec(passageText)) !== null) {
    var options = {};
    if (array1[2]) {
      options = JSON.parse(array1[1]);
    }
    if (array1[5]) {
		var newPassage = getPassageByName(array1[6]);
		
      links.push({ text: array1[5], link: array1[6], options: options, twinePosition: getPassageTwinePosition(newPassage) });
    } else {
		var newPassage = getPassageByName(array1[7]);
      links.push({ text: array1[7], link: array1[7], options: options, twinePosition: getPassageTwinePosition(newPassage)  });
    }
  }
  return links;
}

function getBackgroundsInPassage(passage) {
  // var rexp = /\(\((.+)\)\)/g;
  var rexp = /({\s*(.+)\s*})?\(\(\s*(.+)\s*\)\)/g;
  var passageText = passage.processedContent;
  var backgrounds = [];
  var array1;
  while ((array1 = rexp.exec(passageText)) !== null) {
	  var options = {};
	  if (array1[1]) {
		  options = JSON.parse(array1[1]);
	  }
	  backgrounds.push({src:array1[3], options});
  }
  return backgrounds;
}
function getSoundsInPassage(passage) {
  var rexp = /({\s*(.+)\s*})?~~\s*(.+)\s*~~/g;
  var passageText = passage.processedContent;
  var sounds = [];
  var array1;
  while ((array1 = rexp.exec(passageText)) !== null) {
    var options = {};
    if (array1[1]) {
      options = JSON.parse(array1[1]);
    }
    sounds.push({ src: array1[3], options });
  }
  return sounds;
}

function getTextInPassage(passage) {
	var rexp = /({\s*.+\s*})?`?(\[\[\s*.+\s*\]\]|`([^`]+)`|~~\s*.+\s*~~|\(\(\s*.+\s*\)\))\s*\n?/g;
	var passageText = passage.processedContent;
	return {text: passageText.replace(rexp, ""), options:{direction: 0}};
}

function getPanelsInPassage(passage) {
	// var rexp = /({\s*(.+)\s*})?`([^`]+)`/g;
	//
	// var passageText = passage.textContent;
	// var panels = [];
	//     while ((array1 = rexp.exec(passageText)) !== null) {
	//       var options = {};
	//       if (array1[1]) {
	//         options = JSON.parse(array1[1]);
	//       }
	//       panels.push({ text: array1[3], options });
	//     }
	//     return panels;
    var rexp = /({\s*(.+)\s*})?`\[\[\s*((.+)\s*\|\s*(.+)\s*|(.+)\s*)\]\]/g;
    var passageText = passage.processedContent;
    var links = [];
    var array1;
    while ((array1 = rexp.exec(passageText)) !== null) {
      var options = {};
      if (array1[1]) {
        options = JSON.parse(array1[1]);
      }
      if (array1[4]) {
  		var newPassage = getPassageByName(array1[5]);
		newPassage.processedContent = window.story.render(newPassage.getAttribute("pid"));
		var backgrounds = getBackgroundsInPassage(newPassage);
        links.push({ text: getTextInPassage(newPassage).text,  options: options, backgrounds: backgrounds, twinePosition: getPassageTwinePosition(newPassage) });
      } else {
  		var newPassage = getPassageByName(array1[6]);
		newPassage.processedContent = window.story.render(newPassage.getAttribute("pid"));
		var backgrounds = getBackgroundsInPassage(newPassage);
        links.push({ text: getTextInPassage(newPassage).text,  options: options, backgrounds: backgrounds, twinePosition: getPassageTwinePosition(newPassage) });
      }
    }
    return links;
}

AFRAME.registerComponent("vr-passage-link", {
  schema: {
    event: { type: "string", default: "" },
    name: { type: "string", default: "" }
  },
  init: function() {
    var self = this;
    this.eventHandlerFn = function() {
	  window.story.show(self.data.name);
    };
  },

  update: function(oldData) {
    var data = this.data;
    var el = this.el;

    // `event` updated. Remove the previous event listener if it exists.
    if (oldData.event && data.event !== oldData.event) {
      el.removeEventListener(oldData.event, this.eventHandlerFn);
    }

    if (data.event) {
      el.addEventListener(data.event, this.eventHandlerFn);
    }
  },

  remove: function() {
    var data = this.data;
    var el = this.el;

    // Remove event listener.
    if (data.event) {
      el.removeEventListener(data.event, this.eventHandlerFn);
    }
  }
});

AFRAME.registerComponent('rotation-reader', {
	init:function() {
		this.hudtext = document.querySelector("#hudtext");
	},
  tick: function () {
    // `this.el` is the element.
    // `object3D` is the three.js object.

    // `rotation` is a three.js Euler using radians. `quaternion` also available.
	  this.hudtext.setAttribute("text", `value: dir:${((this.el.object3D.rotation.y / (2.0 * Math.PI) * -12.0) % 12).toFixed(2)} ele:${((this.el.object3D.rotation.x / (2.0 * Math.PI) * 12.0) % 12).toFixed(2)}`);

    // `position` is a three.js Vector3.
    // console.log(this.el.object3D.position);
  }
});

AFRAME.registerComponent("reach-load-local", {
	init: function() {
	    storyDocument = document;
		console.log("here");
		document.querySelector("a-scene").setAttribute("cursor", "rayOrigin: mouse");
		document.querySelector("a-scene").setAttribute("raycaster", "objects: .clickable");
		

		
		
		// cursor.setAttribute("cursor", "fuse: true;");
		var storyData = storyDocument.querySelector("tw-storydata");
	    startnode = storyData.getAttribute("startnode");
		  
	  	// run user scripts from story
	  	var userScripts = storyDocument.querySelector("tw-storydata").querySelectorAll('*[type="text/twine-javascript"]');
		var passagesByID = {};
		var passagesByName = {};
		var passagesArray = storyData.querySelectorAll("tw-passagedata");
		for (var i = 0; i < passagesArray.length; i++){
			var id = passagesArray[i].getAttribute("pid");
			var name = passagesArray[i].getAttribute("name");
			if (id != undefined) {
				passagesByID[id] = passagesArray[i];								
			}
			if (name != undefined) {
				passagesByName[name] = passagesArray[i];
			}
		}
		window.story = {
			name: storyData.getAttribute("name"),
			startnode: storyData.getAttribute("startnode"),
			creator: storyData.getAttribute("creator"),
			creatorVersion: storyData.getAttribute("creator-version"),
			ifid: storyData.getAttribute("ifid"),
			zoom: storyData.getAttribute("zoom"),
			format: storyData.getAttribute("format"),
			formatVersion: storyData.getAttribute("format-version"),
			options: storyData.getAttribute("options"),
			history: [],
			state: {},
			userScripts: userScripts,
			checkpointName: "",
			atCheckpoing: false,
			passages: passagesByID,
			passagesByName: passagesByName,
			currentCursor: undefined,
			hud: undefined
			
		}
		
		window.passage = {};
		
		window.story.passage = function(idOrName) {

			if (window.story.passages[idOrName] != undefined) {
				return window.story.passages[idOrName];
			}
			return window.story.passagesByName[idOrName];
		}
		
		window.story.render = function(idOrName) {
			var passage = window.story.passage(idOrName);
			if (passage === undefined) {
				console.log("Error: passage was not found: " + idOrName);
				return;
			}
			return _.template(passage.textContent)();
		}
		window.story.show = function(idOrName, hideFromHistory) {
			var passage = window.story.passage(idOrName);
			if (passage === undefined) {
				console.log("Error: passage not found: " + idOrName);
				return;
			}
			if (hideFromHistory !== true) {
				window.story.history.push(passage.getAttribute("pid"));
			}
			window.passage = {
				id: passage.getAttribute("pid"),
				name: passage.getAttribute("name"),
				tags: passage.getAttribute("tags"),
				position: getPassageTwinePosition(passage),
				source: passage.textContent
			}
			loadPassage(passage);
		}
		
		window.story.start = function() {
			window.story.show(window.story.startnode);
		}
		
		window.story.stats = function(show) {
			if (show === true) {
				document.querySelector("a-scene").setAttribute("stats", true);
			} else {
				document.querySelector("a-scene").removeAttribute("stats");
			}
		}
		window.story.cursor = function(show) {			
			if (show === true) {
				if (window.story.currentCursor === undefined) {
					var newCursor = document.createElement("a-entity");
					newCursor.setAttribute("cursor", '');
					window.story.currentCursor = newCursor;

					newCursor.setAttribute("raycaster", "objects: .clickable");
					newCursor.setAttribute("animation__click", "property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.1 0.1 0.1; to: 1 1 1");
					newCursor.setAttribute("animation__mouseenter", "property: scale; startEvents: mouseenter; easing: easeInCubic; dur: 100; from: 1 1 1; to: 1.2 1.2 1.2");
					newCursor.setAttribute("animation__mouseleave", "property: scale; startEvents: mouseleave; easing: easeInCubic; dur: 100; to: 1 1 1");
					newCursor.setAttribute("material", "color: black; shader: flat");
					newCursor.setAttribute("position", "0 0 -1");
					newCursor.setAttribute("geometry", "primitive: ring; radiusInner: 0.01; radiusOuter: 0.02;");
					document.querySelector("#main-camera").appendChild(newCursor);
				}
			} else {
				if (window.story.currentCursor != undefined) {
					document.querySelector("#main-camera").removeChild(window.story.currentCursor);
					window.story.currentCursor = undefined;
				}
			}
		}
		
		window.story.lookPosition = function(show) {
			if (show === true) {
				if (window.story.hud === undefined) {
					var hudtext = document.createElement("a-entity");
					hudtext.setAttribute("position", "0 0 -1");
					hudtext.setAttribute("text", "value: 0 0");
					hudtext.setAttribute('id', "hudtext");
					hudtext.setAttribute("geometry", `primitive: plane; width:auto; height:auto};`);
					hudtext.setAttribute(
					    "material",
					    `color:  #000000;  shader:  flat; opacity: 0.3;`
					  );
					  window.story.hud = hudtext;
					  
					var camera = document.querySelector("a-camera");
					camera.appendChild(hudtext);
					camera.setAttribute("rotation-reader", "");
				}
			} else {
				if (window.story.hud !== undefined) {
					document.querySelector("a-camera").removeChild(window.story.hud);
					document.querySelector("a-camera").removeAttribute("rotation-reader");
					window.story.hud = undefined;
				}
			}
		}
		window.story.isMobile = function() {
			return AFRAME.utils.device.isMobile();
		}

		window.story.headsetConnected = function() {
			return AFRAME.utils.device.checkHeadsetConnected();
		}
	  	for (var i = 0; i < userScripts.length; i++) {
	  		var script = userScripts[i].innerHTML;
	  ;
	  		try {
	  			eval(script);
	  		} catch(error) {
	  			console.log(error);
	  		}
		
	  	}
		
		if (window.reach_preload_images !== null) {
			for (var i in window.reach_preload_images) {
				var idTag = i;
				var src = getSrc(window.reach_preload_images[i]);
				var img = document.createElement("img");
				//note must set crossorigin first before src otherwise it will start downloading without the crossorigin header
				img.setAttribute("crossorigin", "anonymous");
				img.setAttribute("id", idTag);
				img.setAttribute("src", src);
				
				storyDocument.querySelector("a-assets").appendChild(img);

			}
		}
		
		
		if (window.story.isMobile() === true) {
			window.story.cursor(true);
		}
		
		window.story.start();
		
		if (window.reach_show_position === true) {
			var hudtext = document.createElement("a-entity");
			hudtext.setAttribute("position", "0 0 -1");
			hudtext.setAttribute("text", "value: 0 0");
			hudtext.setAttribute('id', "hudtext");
			hudtext.setAttribute("geometry", `primitive: plane; width:auto; height:auto};`);
			hudtext.setAttribute(
			    "material",
			    `color:  #000000;  shader:  flat; opacity: 0.3;`
			  );
			var camera = storyDocument.querySelector("a-camera");
			camera.appendChild(hudtext);
			camera.setAttribute("rotation-reader", "");
		}
	}
});

// causes our AFRAME component to initialize if this is loaded as a dev module (which may load in a different order than in the integrated production version)
document.querySelector("a-scene").setAttribute("reach-load-local", true);
