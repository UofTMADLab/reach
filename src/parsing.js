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
function getPassageById(passageId) {
	return window.story.passage(passageId);
}
function getPassageByName(name) {
	return window.story.passage(name);
}

function getLinksInPassage(passage) {
	// match beginning of text, or options JSON, or any character other than `, then [[text]] or [[text|link]], with optional spaces between
	// brackets and json/text
  var rexp = /(^|({\s*(.+)\s*})|[^`&])\[\[\s*((.+)\s*\|\s*(.+)\s*|(.+)\s*)\]\]/g;
  var passageText = passage.processedContent;
  var links = [];
  var array1;
  while ((array1 = rexp.exec(passageText)) !== null) {
    var options = {};
    if (array1[2]) {
      options = JSON.parse(array1[1]);
    };
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

function getImagePanelsInPassage(passage) {

  var rexp = /(^|({\s*(.+)\s*})|[^`&])\[img\[(\s*(.+)\s*)\](\s*\]|((.+))\])/g;
  var passageText = passage.processedContent;
  var images = [];
  var array1;
  while ((array1 = rexp.exec(passageText)) !== null) {
    var options = {};
    if (array1[2]) {
      options = JSON.parse(array1[2]);
    };
	images.push({ img: array1[5], link: array1[7], options: options});

  }
  return images;
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
	var rexp = /({\s*.+\s*})?`?&?(\[\[\s*.+\s*\]\]|`([^`]+)`|~~\s*.+\s*~~|\(\(\s*.+\s*\)\))\s*\n?/g;
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

function getMixPassages(passage) {
    var rexp = /({\s*(.+)\s*})?&\[\[\s*((.+)\s*\|\s*(.+)\s*|(.+)\s*)\]\]/g;
    var passageText = passage.processedContent;
    var links = [];
    var array1;
    while ((array1 = rexp.exec(passageText)) !== null) {
      var options = {};
      if (array1[1]) {
        options = JSON.parse(array1[1]);
      }
      if (array1[4]) {
		  var newPassageName = array1[5];
		  var newPassage = getPassageByName(newPassageName);
		links.push({ name: newPassageName,  options: options, twinePosition: getPassageTwinePosition(newPassage) });
      } else {
		  var newPassageName = array1[6];
		  var newPassage = getPassageByName(newPassageName);
        links.push({ name: newPassageName,  options: options, twinePosition: getPassageTwinePosition(newPassage) });
      }
    }
    return links;
}

export {getPassageTwinePosition, getPassageById, getPassageByName, getLinksInPassage, getBackgroundsInPassage, getSoundsInPassage, getTextInPassage, getPanelsInPassage, getImagePanelsInPassage, getMixPassages};