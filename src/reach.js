console.log("REACH-1.0.62,62");
import './underscore-min.js';
import './reach_passage.js';
import './reach_text_panel.js';
import './reach_html_panel.js';
import './reach_image_panel.js';
import './reach_video_panel.js';
import './reach_sound.js';
import './reach_sky.js';
import './reach_video.js';
import './reach_custom.js';
import './arrow.js';
import {
	getSrc,
	CreateUUID
} from './utility.js';
import {getPassageSky} from './sky.js';

var storyDocument;
var startnode;

AFRAME.registerComponent("reach_passage_link", {
	schema: {
		event: {
			type: "string",
			default: ""
		},
		name: {
			type: "string",
			default: ""
		}
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

AFRAME.registerComponent('reach_rotation_reader', {
	init: function() {
		this.hudtext = document.querySelector("#hudtext");
	},
	tick: function() {
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


		window.htmlTextureRendering = document.createElement("div");
		document.body.appendChild(htmlTextureRendering);


		// cursor.setAttribute("cursor", "fuse: true;");
		var storyData = storyDocument.querySelector("tw-storydata");
		startnode = storyData.getAttribute("startnode");

		// run user scripts from story
		var userScripts = storyDocument.querySelector("tw-storydata").querySelectorAll('*[type="text/twine-javascript"]');
		var passagesByID = {};
		var passagesByName = {};
		var passagesArray = storyData.querySelectorAll("tw-passagedata");
		for (var i = 0; i < passagesArray.length; i++) {
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
			hud: undefined,
			defaultFarClipping: 1000,
			defaultSkySrc: "#reach-default-360",
			extensions: {}

		}

		window.passage = {};
		window.reachMixins = {};


		window.story.showError = function(error, location) {
			var message = `reach error (on loading passage named ${location})\n${error}`;
			console.log(message);
		}

		window.story.registerMixin = function(id, attributes) {
			window.reachMixins[id] = attributes;
		}

		window.story.passage = function(idOrName, module, search) {
			if (idOrName === undefined) {
				return;
			}
			var story = module !== undefined ? module : window.story;

			// only parse out '.' characters if we are searching for a custom external code name, otherwise treat them as part of the passage name

			var parsedName = search === true ? window.story.parsePassageName(idOrName) : {
				parts: [idOrName],
				name: idOrName
			};

			// if namespace not specified
			if (parsedName.parts.length === 1) {
				if (story.passages[parsedName.name] != undefined) {
					var passage = story.passages[parsedName.name];
					// provide local state
					passage.s = story;
					return passage;
				}
				if (story.passagesByName[parsedName.name] !== undefined) {
					var passage = story.passagesByName[parsedName.name];
					passage.s = story;
					return passage;
				}
				// recursively search imported extensions
				for (var i in story.extensions) {
					var extensionStory = story.extensions[i];
					var result = window.story.passage(parsedName.name, extensionStory);
					if (result !== undefined) {
						return result;
					}
				}
			} else {
				var parts = parsedName.parts;
				var extensionName = parts.shift();
				var subStory = story.extensions[extensionName];
				if (subStory === undefined) {
					console.log(`Couldn't find extension named ${extensionName} in ${story.name}.'`)
					return;
				}
				return window.story.passage(parts.join('.'), story);

			}
		}

		window.story.parsePassageName = function(path) {
			console.log(`path: ${typeof path}`);
			var nameParts = path.split('.');
			return {
				parts: nameParts,
				name: nameParts[nameParts.length - 1]
			};
		}
		window.story.render = function(idOrName, params) {
			if (idOrName === undefined) {
				return;
			}

			//todo: if this is called from an imported module, it should start looking within that module
			var passage = window.story.passage(idOrName);
			if (passage === undefined) {
				window.story.showError("", "Error: passage was not found: " + idOrName);
				return;
			}
			return _.template(passage.textContent)({
				s: passage.s,
				p: window.passage,
				params: params
			});
		}
		
		window.story.renderCode = function(code, params) {
			return _.template(`<% ${code} %>`)(params);
		}
		window.story.show = function(idOrName, hideFromHistory) {
			var videoElements = document.querySelectorAll("video");

			if (videoElements !== null) {

				for (var i = 0; i < videoElements.length; i++) {
					console.log(`pausing video ${i}`);
					videoElements[i].pause();
				}

			}


			var scene = document.querySelector("#container");
			var passagesToEnd = scene.querySelectorAll("[reach_passage]");
			while (scene.firstChild) {
				var r = scene.firstChild;
				if (r.removeAttribute) {
					r.removeAttribute("reach_passage");
				}

				r.remove();

				if (r.destroy) {
					r.destroy();
				}
			}
			// for (var i = 0; i < passagesToEnd.length; i++) {
			// 						  var p = passagesToEnd[i];
			// 						  p.removeAttribute("reach_passage");
			// 						  p.remove();
			// 						  // if (p.destroy) {
			// 						  // 							  p.destroy();
			// 						  // }
			// }

			window.traversedPassages = {};
			var passage = window.story.passage(idOrName);
			if (passage !== undefined) {
				var name = passage.getAttribute("name");
				if (name !== undefined) {
					window.traversedPassages[name] = true;
				}
			}


			var passageElement = document.createElement("a-entity");
			scene.appendChild(passageElement);

			passageElement.setAttribute("reach_passage", {
				id: idOrName,
				name: idOrName,
				hideFromHistory: hideFromHistory
			});

			document.querySelector("a-scene").setAttribute("background", "color: black");
		}

		window.story.start = function() {
			window.story.defaultSky = getPassageSky({options:{"transparent":false, distance: window.story.defaultFarClipping - 1}}).components.reach_sky;
			document.querySelector("a-scene").appendChild(window.story.defaultSky.el);
			window.story.show(window.story.startnode);
		}

		window.story.on = function(eventName, callback) {
			var superCallback = function(e) {
				callback(e.detail.source, e);
			}
			var scene = document.querySelector("#container");
			scene.addEventListener(eventName, superCallback);
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
					camera.setAttribute("reach_rotation_reader", "");
				}
			} else {
				if (window.story.hud !== undefined) {
					document.querySelector("a-camera").removeChild(window.story.hud);
					document.querySelector("a-camera").removeAttribute("reach_rotation_reader");
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

		// only call import from the "Story Javscript" code (not passage javascript code)
		window.story.import = function(src, moduleName) {
				var context = this;
				if (window.story.pendingImports === undefined) {
					window.story.pendingImports = {};
				}
				var key = CreateUUID();
				window.story.pendingImports[key] = function() {
					window.story.doImport(src, moduleName, context, key);
				};
				
		}
		window.story.jsImport = function(src) {
			if (window.story.pendingImports === undefined) {
				window.story.pendingImports = {};
			}
			var key = CreateUUID();
			window.story.pedingImports[key] = function() {
				window.story.doJSImport(src, key);
			}
		}
		window.story.finishedImport = function(uuidKey) {
			delete window.story.pendingImports[uuidKey];
			if (Object.keys(window.story.pendingImports).length === 0) {
				window.story.start();
			}
		}
		window.story.doJSImport = function(src, uuidKey) {
			if (src === undefined) {
				return;
			}
			var request = new XMLHttpRequest;
			request.open('GET', src);
			request.responseType = "text";
			request.onload = function() {
				if (request.readyState === request.DONE && request.status === 200) {
					var jsData = request.response;
					try {
						eval(jsData);
						console.log(`Imported script from ${src}`);
					} catch (error) {
						console.log(`Error loading from JS source ${src}`);
						console.log(error)
					}
					window.story.finishedImport(uuidKey);
				}
			};
			request.send();
		}
		window.story.doImport = function(src, moduleName, context, uuidKey) {
			if (src === undefined || moduleName === undefined) {
				return;
			}
			var request = new XMLHttpRequest;
			request.open('GET', src);
			request.responseType = "document";
			request.overrideMimeType('text/html');

			var self = context;
			request.onload = function() {
				if (request.readyState === request.DONE && request.status === 200) {
					var importedDocument = request.responseXML;
					var storyData = importedDocument.querySelector("tw-storydata");
					var userScripts = importedDocument.querySelector("tw-storydata").querySelectorAll('*[type="text/twine-javascript"]');
					var passagesByID = {};
					var passagesByName = {};
					var passagesArray = storyData.querySelectorAll("tw-passagedata");
					for (var i = 0; i < passagesArray.length; i++) {
						var id = passagesArray[i].getAttribute("pid");
						var name = passagesArray[i].getAttribute("name");
						if (id != undefined) {
							passagesByID[id] = passagesArray[i];
						}
						if (name !== undefined) {
							passagesByName[name] = passagesArray[i];
						}
					}

					self.extensions[moduleName] = {
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
						hud: undefined,
						defaultFarClipping: 1000,
						extensions: {},
						import: window.story.import

					}
					var importedStorySpace = self.extensions[moduleName];
					for (var i = 0; i < userScripts.length; i++) {
						var script = userScripts[i].innerHTML;;
						try {
							_.template("<%" + script + "%>")({
								s: importedStorySpace.state,
								story: self
							});

						} catch (error) {
							console.log(error);
						}

					}

					if (window.passage !== undefined && window.passage.container !== undefined) {
						window.passage.container.emit("reachImportLoaded", {
							source: importedStorySpace
						});
					}
					console.log(`Imported extension ${importedStorySpace.name} as ${moduleName}.`);

					window.story.finishedImport(uuidKey);

				} else {
					console.log(`Error loading extension from ${src}.`);
				}

			};
			request.send();


		}

		window.story.preloadImages = function(imageIdsAndSrc) {
			var count = 0;
			var loadedCount = 0;
			for (var i in imageIdsAndSrc) {
				count += 1;
				var idTag = i;
				var src = getSrc(imageIdsAndSrc[i]);
				var img = document.createElement("img");
				//note must set crossorigin first before src otherwise it will start downloading without the crossorigin header
				img.setAttribute("crossorigin", "anonymous");
				img.setAttribute("id", idTag);
				img.setAttribute("src", src);
				img.addEventListener("load", function(evt) {
					loadedCount = loadedCount + 1;
					window.passage.container.emit("reach_imagePreLoaded", {
						source: {
							src: evt.target.getAttribute("src"),
							count: loadedCount,
							total: count
						}
					});
				});

				storyDocument.querySelector("a-assets").appendChild(img);

			}
		}

		for (var i = 0; i < userScripts.length; i++) {
			var script = userScripts[i].innerHTML;;
			try {
				_.template("<%" + script + "%>")({
					s: window.story
				});
			} catch (error) {
				console.log(error);
			}
		}

		if (window.reach_preload_images !== null) {
			window.story.preloadImages(window.reach_preload_images);
		}


		if (window.story.isMobile() === true) {
			window.story.cursor(true);
		}

		document.addEventListener('keydown', (event) => {
			// filter for ctrl+alt
			if (!(event.ctrlKey === true && event.altKey === true)) {
				return;
			}

			if (event.code === "KeyD") {
				if (window.story.hud === undefined) {
					window.story.lookPosition(true);
					window.story.cursor(true);
				} else {
					window.story.lookPosition(false);
					window.story.cursor(false);
				}
			} else if (event.code === "KeyP") {
				if (document.querySelector("a-scene").components.stats === undefined) {
					window.story.stats(true);
				} else {
					window.story.stats(false);
				}
			} else if (event.code === "KeyC") {
				if (window.story.currentCursor === undefined) {
					window.story.cursor(true);
				} else {
					window.story.cursor(false);
				}
			}
		});

		if (window.story.pendingImports === undefined) {
			window.story.start();
		} else {
			for (var key in window.story.pendingImports) {
				var pending = window.story.pendingImports[key];
				pending();
			}
		}


	}
});

// causes our AFRAME component to initialize if this is loaded as a dev module (which may load in a different order than in the integrated production version)
var loadedScene = document.querySelector("a-scene");
if (loadedScene != undefined) {
	loadedScene.setAttribute("reach-load-local", true);
}
