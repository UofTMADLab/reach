import {getDirectionBetweenPassages} from './utility.js';

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
function createPassageLink(link, linkIndex, currentPassageTwinePosition) {
	if (link.options.floor === true) {
		return createFloorLink(link, linkIndex, currentPassageTwinePosition);
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

function createPassageText(text, textIndex, currentPassageTwinePosition) {
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

export {createPassageLink, createPassageText};
