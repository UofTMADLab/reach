import {
	getDirectionBetweenPassages,
	panelSizeFromCorners,
	avg,
	parseCornerString,
	mergeMixins
} from './utility.js';

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
		"reach_passage_link",
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
	if (link.options.shape !== undefined && link.options.shape !== "arrow") {
		backgroundShape = link.options.shape;
	}
	if (link.options.shape != "arrow") {
		background.setAttribute("geometry", `primitive: ${backgroundShape};`);
		background.setAttribute(
			"material",
			`color:  ${backgroundColor};  shader:  flat; opacity: ${backgroundOpacity};`
		);
	}


	if (link.options.shape === "arrow") {
		var arrow = document.createElement("a-entity");
		arrow.setAttribute("class", "clickable");
		arrow.setAttribute("reach_passage_link", `name: ${link.link}; event: click`);
		// arrow.setAttribute("rotation", "90 0 0");
		arrow.setAttribute("geometry", `primitive: arrow;`);
		arrow.setAttribute(
			"material",
			`color:  ${backgroundColor};  shader:  standard; opacity: ${backgroundOpacity};`
		);
		background.appendChild(arrow);
	}
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
	var direction = undefined;
	var directionInDegrees = undefined;
	if (link.twinePosition !== undefined) {
		directionInDegrees = true;
		direction = getDirectionBetweenPassages(currentPassageTwinePosition, link.twinePosition);
	}
	if (link.options.direction !== undefined) {
		directionInDegrees = false;
		direction = link.options.direction;
	}

	var distance = link.options.distance;
	var inclination = link.options.inclination;
	
	var backgroundSize = undefined;
	if (link.options.width && !link.options.height) {
		backgroundSize = {
			x: link.options.width,
			y: link.options.width
		};
	} else if (!link.options.width && link.options.height) {
		backgroundSize = {
			x: link.options.height,
			y: link.options.height
		};
	} else if (link.options.width && link.options.height) {
		backgroundSize = {
			x: link.options.width,
			y: link.options.height
		};
	}
	if (link.options.corners !== undefined) {
		var corners = parseCornerString(link.options.corners);
		var size = panelSizeFromCorners((distance ? distance : 2.0) * -1.0, corners.corner1, corners.corner2);
		directionInDegrees = false;
		direction = avg(corners.corner1.direction, corners.corner2.direction);
		inclination = avg(corners.corner1.inclination, corners.corner2.inclination);
		backgroundSize = {
			x: size.width,
			y: size.height
		};
		console.log(size);
	}
	
	var backgroundSrc = undefined;
	if (link.backgrounds && link.backgrounds[0]) {
		backgroundSrc = link.backgrounds[0].src;
	}
	
	var el = document.createElement("a-entity");

	var localOptions =  {
		direction: direction,
		directionInDegrees: directionInDegrees,
		inclination: inclination,
		distance: distance,
		backgroundSize: backgroundSize,
		backgroundColor: link.options.backgroundColor,
		backgroundOpacity: link.options.backgroundOpacity,
		backgroundShape: link.options.backgroundShape,
		backgroundSrc: backgroundSrc,
		color: link.options.color,
		text: link.text,
		link: link.link,
		arrow: link.options.arrow
	}
	
	var mergedOptions = mergeMixins(link.options.mixin, localOptions);
	
	if (!mergedOptions.direction) {
		mergedOptions.direction = linkIndex + 1;
		mergedOptions.directionInDegrees = false;
	}
	
	if (!mergedOptions.directionInDegrees) {
		mergedOptions.directionInDegrees = false;
	}
	
	if (!mergedOptions.backgroundSize) {
		mergedOptions.backgroundSize = {x: 1.0, y: 1.0};
	}
	
	if (!mergedOptions.backgroundColor) {
		mergedOptions.backgroundColor = "#0000AA";
	}
	
	if (!mergedOptions.backgroundOpacity) {
		mergedOptions.backgroundOpacity = 0.7;
	}
	
	if (!mergedOptions.color) {
		mergedOptions.color = "#FFFFFF";
	}
	
	if (!mergedOptions.text) {
		mergedOptions.text = mergedOptions.link;
	}
	el.setAttribute("reach_text_panel", mergedOptions);
	


	return el;

}

function createPassageText(text, textIndex, currentPassageTwinePosition) {

	var direction = undefined;
	var directionInDegrees = undefined;
	if (text.twinePosition !== undefined) {
		directionInDegrees = true;
		direction = getDirectionBetweenPassages(currentPassageTwinePosition, text.twinePosition);
	}
	if (text.options.direction !== undefined) {
		directionInDegrees = false;
		direction = text.options.direction;
	}
	var distance = text.options.distance;
	var inclination = text.options.inclination;

	var backgroundSize = undefined;
	if (text.options.width && !text.options.height) {
		backgroundSize = {
			x: text.options.width,
			y: text.options.width / 8.5 * 11.0
		};
	} else if (!text.options.width && text.options.height) {
		backgroundSize = {
			x: text.options.height / 11.0 * 8.5,
			y: text.options.height
		};
	} else if (text.options.width && text.options.height) {
		backgroundSize = {
			x: text.options.width,
			y: text.options.height
		};
	}

	if (text.options.corners !== undefined) {
		var corners = parseCornerString(text.options.corners);
		var size = panelSizeFromCorners((distance ? distance : 2.0) * -1.0, corners.corner1, corners.corner2);
		directionInDegrees = false;
		direction = avg(corners.corner1.direction, corners.corner2.direction);
		inclination = avg(corners.corner1.inclination, corners.corner2.inclination);
		backgroundSize = {
			x: size.width,
			y: size.height
		};
		console.log(size);
	}

	var backgroundSrc = undefined;
	if (text.backgrounds && text.backgrounds[0]) {
		backgroundSrc = text.backgrounds[0].src;
	}

	var el = document.createElement("a-entity");

	var localOptions =  {
		direction: direction,
		directionInDegrees: directionInDegrees,
		inclination: inclination,
		distance: distance,
		backgroundSize: backgroundSize,
		backgroundColor: text.options.backgroundColor,
		backgroundOpacity: text.options.backgroundOpacity,
		backgroundShape: text.options.backgroundShape,
		backgroundSrc: backgroundSrc,
		color: text.options.color,
		text: text.text,
		arrow: text.options.arrow
	}
	
	var mergedOptions = mergeMixins(text.options.mixin, localOptions);
	
	if (mergedOptions.direction === undefined) {
		mergedOptions.direction =  (textIndex + 1) * 2.0;
		mergedOptions.directionInDegrees = false;
	}
	
	if (mergedOptions.directionInDegrees === undefined) {
		mergedOptions.directionInDegrees = false;
	}
	
	el.setAttribute("reach_text_panel", mergedOptions);

	return el;
}

export {
	createPassageLink,
	createPassageText
};
