console.log("REACH-0.0.9,13");
function getDirectionBetweenPassages(a,b) {
	var nb = {x: b.x - a.x, y: b.y - a.y};
	var theta = 0;
	if (nb.x === 0) {
		if (nb.y >= 0){
			return 180.0
		} else {
			return 0.0;
		}
	} else if (nb.x > 0) {
		return -(Math.atan(nb.y / nb.x) * (180 / Math.PI) - 90) + 180;
	} else {
		return -(Math.atan(nb.y / nb.x) * (180 / Math.PI) - 90);
	}
}
function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
function loadScene(url) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var nodes = xhr.responseXML.body.childNodes;
    var scene = document.querySelector("#container");
    removeAllChildren(scene);
    for (var i = 0; i < nodes.length; i++) {
      scene.appendChild(nodes[i]);
    }
  };
  xhr.open("GET", url);
  xhr.responseType = "document";
  xhr.send();
}
var storyDocument;
var startnode;
var currentPassageName;
var currentPassageTwinePosition;

function loadStory(url, finished) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    storyDocument = xhr.responseXML;
    startnode = storyDocument
      .querySelector("tw-storydata")
      .getAttribute("startnode");
    finished(storyDocument);
  };
  xhr.addEventListener("error", function(evt) {
    console.log(evt);
  });
  xhr.open("GET", url);
  // xhr.responseType = "document";
  xhr.send();
}

function getSrc(resourceName) {
	if (window.reach_resource_prefix === undefined) {
		return resourceName;
	} 
	var normalizedName = resourceName.toLowerCase();
	if (normalizedName.startsWith("http://") || normalizedName.startsWith("https://")) {
		return resourceName;
	}
	return window.reach_resource_prefix.concat(resourceName);
}

function loadLocalStory() {
  storyDocument = document;
  startnode = storyDocument
    .querySelector("tw-storydata")
    .getAttribute("startnode");
	
	// run user scripts from story
	var userScripts = storyDocument.querySelector("tw-storydata").querySelectorAll('*[type="text/twine-javascript"]');

	for (i = 0; i < userScripts.length; i++) {
		var script = userScripts[i].innerHTML;
;
		try {
			eval(script);
		} catch(error) {
			console.log(error);
		}
		
	}
  var passage = getPassageById(startnode);

  loadPassage(passage);
}

function getPassageSky(background) {
  var skyElement = document.createElement("a-sky");

  if (background.src === undefined) {
	  skyElement.setAttribute("src", "#reach-default-360");
  } else {
  	skyElement.setAttribute("src", getSrc(background.src));
  }
  
  var transparent = "true";
  var radius = 5000;
  if (background.options.transparent === false) {
	  transparent = "false";
  }
  if (background.options.distance !== undefined) {
	  radius = background.options.distance;
  }
  
  skyElement.setAttribute("transparent", transparent);
  skyElement.setAttribute("radius", radius);

  return skyElement;
}



function createSoundElement(sound) {
	var head = document.createElement("a-entity");
	head.setAttribute("position", "0 1.6 0");
  var outer = document.createElement("a-entity");
  var direction = 0;
  var elevation = 0;
  if (sound.options.direction !== undefined) {
	  direction = (sound.options.direction % 12) * -30.0;
  }
  if (sound.options.elevation !== undefined) {
	  elevation = (sound.options.elevation % 12) * 30.0;
  }
  outer.setAttribute("rotation", `${elevation} ${direction} 0`);
    
  var distance = 0;
  if (sound.options.direction !== undefined) {
	  distance = -2;
  }
  if (sound.options.distance !== undefined) {
	  distance = sound.options.distance;
  }
  console.log("sound distance " + distance);
  var soundElement = document.createElement("a-sound");
  soundElement.setAttribute("src", getSrc(sound.src));
  soundElement.setAttribute("position", `0 0 ${distance}`);

  soundElement.setAttribute("autoplay", "true");
  soundElement.setAttribute("loop", "true");
  outer.appendChild(soundElement);
  head.appendChild(outer);
  return head;
}

function createFloorLink(link, linkIndex) {

  var outer = document.createElement("a-entity");
  var direction = 0;

  if (link.options.direction !== undefined) {
	  direction = (link.options.direction % 12) * -30.0;
  }


  outer.setAttribute("rotation", `0 ${direction} 0`);

  var inner = document.createElement("a-entity");
  
  var distance = -2.0;
  if (link.options.distance !== undefined) {
	  distance = link.options.distance;
  }
  
  inner.setAttribute("position", `0 0 ${distance}`);
  inner.setAttribute("rotation", `-90 0 0`);
  
  var background = document.createElement("a-entity");
  background.setAttribute("class", "clickable");
  background.setAttribute("id", "background");
  background.setAttribute(
    "vr-passage-link",
    `name: ${link.link}; event: click`
  );
	var backgroundColor = "#0000ff";
	var backgroundOpacity = "0.7";
	var backgroundShape = "circle";
	if (link.options.backgroundColor !== undefined) {
		backgroundColor = link.options.backgroundColor;
	}
	if (link.options.backgroundOpacity !== undefined) {
		backgroundOpacity = link.options.backgroundOpacity;
	}
	if (link.options.shape !== undefined) {
		backgroundShape = link.options.shape;
	}
  background.setAttribute("geometry", `primitive: ${backgroundShape};`);
  background.setAttribute(
    "material",
    `color:  ${backgroundColor};  shader:  flat; opacity: ${backgroundOpacity};`
  );
  var text = document.createElement("a-entity");
	var textColor = "#FAFAFA";
	if (link.options.color !== undefined) {
		textColor = link.options.color;
	}
  text.setAttribute(
    "text",
    `align: center; color: ${textColor}; wrapCount: 18; width: 0.65; value: ${link.text};`
  );
  text.setAttribute("position", "0 0 0.05");

  outer.appendChild(inner);
  inner.appendChild(background);
  inner.appendChild(text);
  return outer;
}
function createPassageLink(link, linkIndex) {
	if (link.options.floor === true) {
		return createFloorLink(link, linkIndex);
	}
	var head = document.createElement("a-entity");
	head.setAttribute("position", "0 1.6 0");
  var outer = document.createElement("a-entity");
  var direction = ((linkIndex + 1) % 12) * -30.0;
  var elevation = 0;
  
  if (link.twinePosition !== undefined) {
	  direction = getDirectionBetweenPassages(currentPassageTwinePosition, link.twinePosition);
  }
  if (link.options.direction !== undefined) {
	  direction = (link.options.direction % 12) * -30.0;
  }
  if (link.options.elevation !== undefined) {
	  elevation = (link.options.elevation % 12) * 30.0;
  }
  outer.setAttribute("rotation", `${elevation} ${direction} 0`);

  var inner = document.createElement("a-entity");
  var distance = -2.0;
  if (link.options.distance !== undefined) {
	  distance = link.options.distance;
  }
  inner.setAttribute("position", `0 0 ${distance}`);
  var background = document.createElement("a-entity");
  background.setAttribute("class", "clickable");
  background.setAttribute("id", "background");
  background.setAttribute(
    "vr-passage-link",
    `name: ${link.link}; event: click`
  );
	var backgroundColor = "#0000ff";
	var backgroundOpacity = "0.7";
	var backgroundShape = "plane";
	if (link.options.backgroundColor !== undefined) {
		backgroundColor = link.options.backgroundColor;
	}
	if (link.options.backgroundOpacity !== undefined) {
		backgroundOpacity = link.options.backgroundOpacity;
	}
	if (link.options.shape !== undefined) {
		backgroundShape = link.options.shape;
	}
  background.setAttribute("geometry", `primitive: ${backgroundShape};`);
  background.setAttribute(
    "material",
    `color:  ${backgroundColor};  shader:  flat; opacity: ${backgroundOpacity};`
  );
  var text = document.createElement("a-entity");
	var textColor = "#FAFAFA";
	if (link.options.color !== undefined) {
		textColor = link.options.color;
	}
  text.setAttribute(
    "text",
    `align: center; color: ${textColor}; wrapCount: 18; width: 0.65; value: ${link.text};`
  );
  text.setAttribute("position", "0 0 0.05");
  head.appendChild(outer);
  outer.appendChild(inner);
  inner.appendChild(background);
  inner.appendChild(text);
  return head;
}

function createPassageText(text, textIndex) {
	var head = document.createElement("a-entity");
	head.setAttribute("position", "0 1.6 0");
  var outer = document.createElement("a-entity");
  var direction = (((textIndex + 1) * 2.0) % 12) * 30.0;
  var elevation = 0;
  if (text.twinePosition !== undefined) {
	  direction = getDirectionBetweenPassages(currentPassageTwinePosition, text.twinePosition);
  }
  if (text.options.direction !== undefined) {
	  direction = (text.options.direction % 12) * -30.0;
  }
  if (text.options.elevation !== undefined) {
	  elevation = (text.options.elevation % 12) * 30.0;
  }

  outer.setAttribute("rotation", `${elevation} ${direction} 0`);

    var inner = document.createElement("a-entity");
    var distance = -2.0;
    if (text.options.distance) {
  	  distance = text.options.distance;
    }
    inner.setAttribute("position", `0 0 ${distance}`);
	
    var background = document.createElement("a-entity");
    
	var backgroundColor = "#ffffff";
	var backgroundOpacity = "0.7";
	var backgroundShape = "plane";
	if (text.options.backgroundColor !== undefined) {
		backgroundColor = text.options.backgroundColor;
	}
	if (text.options.backgroundOpacity !== undefined) {
		backgroundOpacity = text.options.backgroundOpacity;
	}
	if (text.options.shape !== undefined) {
		backgroundShape = text.options.shape;
	}
	
    background.setAttribute("id", "background");
    background.setAttribute("geometry", `primitive: ${backgroundShape}; width:1.5; height:${1.5/8.5 * 11}`);
    background.setAttribute(
      "material",
      `color:  ${backgroundColor};  shader:  flat; opacity: ${backgroundOpacity};`
    );
    var textEntity = document.createElement("a-entity");
	
	var textColor = "#000000";
	if (text.options.color !== undefined) {
		textColor = text.options.color;
	}
	
    textEntity.setAttribute(
      "text",
      `align: center; color: ${textColor}; wrapCount: 18; width: 0.65; value: ${text.text};`
    );
	
    textEntity.setAttribute("position", "0 0 0.05");
	head.appendChild(outer);
    outer.appendChild(inner);
    inner.appendChild(background);
    inner.appendChild(textEntity);
    return head;
}

function loadPassage(passage) {
  var scene = document.querySelector("#container");
  removeAllChildren(scene);
  currentPassageTwinePosition = getPassageTwinePosition(passage);
  
  document.querySelector("a-scene").setAttribute("background", "color: black");
  var backgrounds = getBackgroundsInPassage(passage);
  for (var i = 0; i < backgrounds.length; i++) {
    var sky = getPassageSky(backgrounds[i]);
    scene.appendChild(sky);
  }

  var links = getLinksInPassage(passage);
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    var linkElement = createPassageLink(link, i);
    scene.appendChild(linkElement);
  }
  
  var panels = getPanelsInPassage(passage);
  for (var i = 0; i < panels.length; i++) {
	  var panel = panels[i];
	  var panelElement = createPassageText(panel, i);
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
  	  // var textElement = createPassageText(textBlock, 0);
  	  // scene.appendChild(textElement);
  	  var defaultSky = getPassageSky({options:{"transparent":false}});
  	  scene.appendChild(defaultSky);
  }

  currentPassageName = passage.getAttribute("name");  
  currentPassageTwinePosition = getPassageTwinePosition(passage);
}
function getPassageById(passageId) {
  //<tw-passagedata pid="1"
	
  return storyDocument.querySelector(`tw-passagedata[pid='${passageId}']`);
}
function getPassageByName(name) {
  var result = storyDocument.querySelector(`tw-passagedata[name='${name.replace("'", "\\'")}']`);
  if (result === null) {
    console.log(`Could not find passage with name: ${name}`);
  }
  return result;
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
  var passageText = passage.textContent;
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
  var passageText = passage.textContent;
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
  var passageText = passage.textContent;
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
	var passageText = passage.textContent;
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
    var passageText = passage.textContent;
    var links = [];
    var array1;
    while ((array1 = rexp.exec(passageText)) !== null) {
      var options = {};
      if (array1[1]) {
        options = JSON.parse(array1[1]);
      }
      if (array1[4]) {
  		var newPassage = getPassageByName(array1[5]);
		
        links.push({ text: newPassage.textContent,  options: options, twinePosition: getPassageTwinePosition(newPassage) });
      } else {
  		var newPassage = getPassageByName(array1[6]);
        links.push({ text: newPassage.textContent,  options: options, twinePosition: getPassageTwinePosition(newPassage) });
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
      var passage = getPassageByName(self.data.name);
      loadPassage(passage);
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

AFRAME.registerComponent("vr-link", {
  schema: {
    event: { type: "string", default: "" },
    url: { type: "string", default: "" }
  },
  init: function() {
    var self = this;
    this.eventHandlerFn = function() {
      loadScene(self.data.url);
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

AFRAME.registerComponent("reach-load-local", {
	init: function() {
	    storyDocument = document;
	    startnode = storyDocument
	      .querySelector("tw-storydata")
	      .getAttribute("startnode");
	
	  	// run user scripts from story
	  	var userScripts = storyDocument.querySelector("tw-storydata").querySelectorAll('*[type="text/twine-javascript"]');

	  	for (i = 0; i < userScripts.length; i++) {
	  		var script = userScripts[i].innerHTML;
	  ;
	  		try {
	  			eval(script);
	  		} catch(error) {
	  			console.log(error);
	  		}
		
	  	}
	    var passage = getPassageById(startnode);

	    loadPassage(passage);
	}
});
