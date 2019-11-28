import {getDirectionBetweenPassages, panelSizeFromCorners, avg, parseCornerString} from './utility.js';

function createFloorLink(link, linkIndex, currentPassageTwinePosition) {

  var outer = document.createElement("a-entity");
  var direction = 0;

  if (link.options.direction !== undefined) {
	  direction = (link.options.direction % 12) * -30.0;
  }


  outer.setAttribute("rotation", `0 ${direction} 0`);

  var inner = document.createElement("a-entity");
  
  var distance = -2.0;
  if (link.options.distance !== undefined) {
	  distance = -1.0 * link.options.distance;
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
function createPassageLink(link, linkIndex, currentPassageTwinePosition) {
	if (link.options.floor === true) {
		return createFloorLink(link, linkIndex, currentPassageTwinePosition);
	}
	var head = document.createElement("a-entity");
	head.setAttribute("position", "0 1.6 0");
  var outer = document.createElement("a-entity");
  var direction = ((linkIndex + 1) % 12) * -30.0;
  var inclination = 0;
  var distance = -2.0;
	var backgroundWidth = "1.0";
	var backgroundHeight = "1.0";
  if (link.twinePosition !== undefined) {
	  direction = getDirectionBetweenPassages(currentPassageTwinePosition, link.twinePosition);
  }
  if (link.options.direction !== undefined) {
	  direction = (link.options.direction % 12) * -30.0;
  }
  if (link.options.inclination !== undefined) {
	  inclination = (link.options.inclination % 12) * 30.0;
  }
  if (link.options.distance !== undefined) {
	  distance = -1.0 * link.options.distance;
  }
	if (link.options.width !== undefined) {
		backgroundWidth = link.options.width;
	}
	if (link.options.height !== undefined) {
		backgroundHeight = link.options.height;
	}
  if (link.options.corners !== undefined ) {
	  var corners = parseCornerString(link.options.corners);
	  var size = panelSizeFromCorners(distance * -1.0, corners.corner1, corners.corner2);
	  direction = (avg(corners.corner1.direction, corners.corner2.direction) % 12) * -30.0;	  
	  inclination = (avg(corners.corner1.inclination, corners.corner2.inclination) % 12) * 30.0;
	  backgroundWidth = size.width;
	  backgroundHeight = size.height;
	  
  }
  console.log(direction, inclination);
  outer.setAttribute("rotation", `${inclination} ${direction} 0`);

  var inner = document.createElement("a-entity");
  

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

  background.setAttribute("geometry", `primitive: ${backgroundShape}; width: ${backgroundWidth}; height: ${backgroundHeight};`);
  background.setAttribute(
    "material",
    `color:  ${backgroundColor};  shader:  flat; opacity: ${backgroundOpacity};`
  );

	var textColor = "#FAFAFA";
	if (link.options.color !== undefined) {
		textColor = link.options.color;
	}
  background.setAttribute(
    "text",
    `align: center; color: ${textColor}; wrapCount: 18; width: 0.65; value: ${link.text};`
  );
  // text.setAttribute("position", "0 0 0.05");
  head.appendChild(outer);
  outer.appendChild(inner);
  inner.appendChild(background);
  // inner.appendChild(text);
  return head;
}

function createPassageText(text, textIndex, currentPassageTwinePosition) {
	var head = document.createElement("a-entity");
	head.setAttribute("position", "0 1.6 0");
  var outer = document.createElement("a-entity");
  var direction = (((textIndex + 1) * 2.0) % 12) * 30.0;
  var inclination = 0;
  if (text.twinePosition !== undefined) {
	  direction = getDirectionBetweenPassages(currentPassageTwinePosition, text.twinePosition);
  }
  if (text.options.direction !== undefined) {
	  direction = (text.options.direction % 12) * -30.0;
  }
  if (text.options.inclination !== undefined) {
	  inclination = (text.options.inclination % 12) * 30.0;
  }

  outer.setAttribute("rotation", `${inclination} ${direction} 0`);

    var inner = document.createElement("a-entity");
    var distance = -2.0;
    if (text.options.distance) {
  	  distance = -1.0 * text.options.distance;
    }
    inner.setAttribute("position", `0 0 ${distance}`);
	
    var background = document.createElement("a-entity");
    
	var backgroundColor = "#ffffff";
	var backgroundOpacity = "0.7";
	var backgroundShape = "plane";
	var backgroundWidth = "1.5";
	var backgroundHeight = `${backgroundWidth/8.5 * 11}`;
	
	if (text.options.backgroundColor !== undefined) {
		backgroundColor = text.options.backgroundColor;
	}
	if (text.options.backgroundOpacity !== undefined) {
		backgroundOpacity = text.options.backgroundOpacity;
	}
	if (text.options.shape !== undefined) {
		backgroundShape = text.options.shape;
	}
	if (text.options.width !== undefined) {
		backgroundWidth = text.options.width;
	}
	if (text.options.height !== undefined) {
		backgroundHeight = text.options.height;
	}
	
    background.setAttribute("id", "background");
    background.setAttribute("geometry", `primitive: ${backgroundShape}; width:${backgroundWidth}; height:${backgroundHeight}`);
	if (text.backgrounds !== undefined && text.backgrounds[0] !== undefined) {
	    background.setAttribute(
	      "material",
	      `shader:  flat; opacity: ${backgroundOpacity}; src: ${text.backgrounds[0].src}; transparent: true;`
	    );
	} else {
	    background.setAttribute(
	      "material",
	      `color:  ${backgroundColor};  shader:  flat; opacity: ${backgroundOpacity};`
	    );
	}


	var textColor = "#000000";
	if (text.options.color !== undefined) {
		textColor = text.options.color;
	}
	
    background.setAttribute(
      "text",
      `align: center; color: ${textColor}; width: 0.85; wrapCount: 18; value: ${text.text};`
    );
	
    
	head.appendChild(outer);
    outer.appendChild(inner);
    inner.appendChild(background);

    return head;
}

export {createPassageLink, createPassageText};
