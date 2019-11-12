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
  skyElement.setAttribute("src", background.name);
  if (background.distance) {
    skyElement.setAttribute("radius", background.distance);
    skyElement.setAttribute("transparent", "true");
  } else {
    skyElement.setAttribute("radius", 5000);
  }
  return skyElement;
}

function createSoundElement(sound) {
  var outer = document.createElement("a-entity");
  if (sound.options.direction) {
    outer.setAttribute(
      "rotation",
      `0 ${(sound.options.direction % 12) * -30.0} 0`
    );
  } else {
    outer.setAttribute("rotation", `0 0 0`);
  }

  var soundElement = document.createElement("a-sound");
  soundElement.setAttribute("src", sound.src);
  if (sound.options.direction) {
    soundElement.setAttribute("position", "0 1.6 -2");
  } else {
    soundElement.setAttribute("position", "0 1.6 0");
  }

  soundElement.setAttribute("autoplay", "true");
  soundElement.setAttribute("loop", "true");
  outer.appendChild(soundElement);
  return outer;
}

function createPassageLink(link, linkIndex) {
  var outer = document.createElement("a-entity");
  if (link.options.direction) {
    outer.setAttribute(
      "rotation",
      `0 ${(link.options.direction % 12) * -30.0} 0`
    );
  } else {
    outer.setAttribute("rotation", `0 ${(linkIndex % 12) * -30.0} 0`);
  }

  var inner = document.createElement("a-entity");
  inner.setAttribute("position", "0 1.6 -2");
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
    "color:  #000000;  shader:  flat; opacity: 0.7"
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
function loadPassage(passage) {
  var scene = document.querySelector("#container");
  removeAllChildren(scene);

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

  var sounds = getSoundsInPassage(passage);
  for (var i = 0; i < sounds.length; i++) {
    var sound = sounds[i];
    var soundElement = createSoundElement(sound);
    scene.appendChild(soundElement);
  }

  currentPassageName = passage.getAttribute("name");
}
function getPassageById(passageId) {
  //<tw-passagedata pid="1"
  return storyDocument.querySelector(`tw-passagedata[pid='${passageId}']`);
}
function getPassageByName(name) {
  var result = storyDocument.querySelector(`tw-passagedata[name='${name}']`);
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
  var rexp = /\(\((\s*(.+)\s*\|\s*distance:\s*(\d+)\s*\)\)|\s*(.+)\)\))/g;
  var passageText = passage.textContent;
  var backgrounds = [];
  var array1;
  while ((array1 = rexp.exec(passageText)) !== null) {
    if (array1[2] !== undefined && array1[3] !== undefined) {
      backgrounds.push({ name: array1[2], distance: array1[3] });
    } else {
      backgrounds.push({ name: array1[4] });
    }
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

