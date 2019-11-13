console.log("REACH-0.0.7");
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

function loadLocalStory() {
  storyDocument = document;
  startnode = storyDocument
    .querySelector("tw-storydata")
    .getAttribute("startnode");
  var passage = getPassageById(startnode);

  loadPassage(passage);
}

function getPassageSky(background) {
  var skyElement = document.createElement("a-sky");
  skyElement.setAttribute("src", background.src);
  if (background.options.distance !== undefined) {
    skyElement.setAttribute("radius", background.options.distance);
    skyElement.setAttribute("transparent", "true");
  } else {
    skyElement.setAttribute("radius", 5000);
	skyElement.setAttribute("transparent", "true");
  }
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
  soundElement.setAttribute("src", sound.src);
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
  background.setAttribute("geometry", "primitive: circle;");
  background.setAttribute(
    "material",
    "color:  #0000ff;  shader:  flat; opacity: 0.7"
  );
  var text = document.createElement("a-entity");
  text.setAttribute(
    "text",
    `align: center; color: #FAFAFA; wrapCount: 18; width: 0.65; value: ${link.text};`
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
  background.setAttribute("geometry", "primitive: plane;");
  background.setAttribute(
    "material",
    "color:  #0000ff;  shader:  flat; opacity: 0.7"
  );
  var text = document.createElement("a-entity");
  text.setAttribute(
    "text",
    `align: center; color: #FAFAFA; wrapCount: 18; width: 0.65; value: ${link.text};`
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
  var direction = ((textIndex + 1) % 4) * 90.0;
  var elevation = 0;
  if (text.options.direction !== undefined) {
	  direction = (text.options.direction % 4) * 90.0;
  }
  if (text.options.elevation !== undefined) {
	  elevation = (text.options.elevation % 4) * 90.0;
  }

  outer.setAttribute("rotation", `${elevation} ${direction} 0`);

    var inner = document.createElement("a-entity");
    var distance = -2.0;
    if (text.options.distance) {
  	  distance = text.options.distance;
    }
    inner.setAttribute("position", `0 0 ${distance}`);
	
    var background = document.createElement("a-entity");
    
    background.setAttribute("id", "background");
    background.setAttribute("geometry", `primitive: plane; width:1.5; height:${1.5/8.5 * 11}`);
    background.setAttribute(
      "material",
      "color:  #ffffff;  shader:  flat; opacity: 0.7"
    );
    var textEntity = document.createElement("a-entity");
    textEntity.setAttribute(
      "text",
      `align: center; color: #000000; wrapCount: 18; width: 0.65; value: ${text.text};`
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
	  var textBlock = getTextInPassage(passage);	  
	  var textElement = createPassageText(textBlock, 0);
	  scene.appendChild(textElement);
  	  var defaultSky = getPassageSky({src:"#reach-default-360", options:{}});
	  scene.appendChild(defaultSky);
  }

  currentPassageName = passage.getAttribute("name");  
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

function getLinksInPassage(passage) {
  var rexp = /({\s*(.+)\s*})?\[\[\s*((.+)\s*\|\s*(.+)\s*|(.+)\s*)\]\]/g;
  var passageText = passage.textContent;
  var links = [];
  var array1;
  while ((array1 = rexp.exec(passageText)) !== null) {
    var options = {};
    if (array1[1]) {
      options = JSON.parse(array1[1]);
    }
    if (array1[4]) {
      links.push({ text: array1[4], link: array1[5], options: options });
    } else {
      links.push({ text: array1[6], link: array1[6], options: options });
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
	var rexp = /({\s*.+\s*})?(\[\[\s*.+\s*\]\]|`([^`]+)`|~~\s*.+\s*~~|\(\(\s*.+\s*\)\))\s*\n?/g;
	var passageText = passage.textContent;
	return {text: passageText.replace(rexp, ""), options:{direction: 0}};
}

function getPanelsInPassage(passage) {
	var rexp = /({\s*(.+)\s*})?`([^`]+)`/g;
	var passageText = passage.textContent;
	var panels = [];
    while ((array1 = rexp.exec(passageText)) !== null) {
      var options = {};
      if (array1[1]) {
        options = JSON.parse(array1[1]);
      }
      panels.push({ text: array1[3], options });
    }
    return panels;	
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

