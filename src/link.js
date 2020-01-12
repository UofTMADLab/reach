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
		arrow.setAttribute("vr-passage-link", `name: ${link.link}; event: click`);
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
	if (link.options.corners !== undefined) {
		var corners = parseCornerString(link.options.corners);
		var size = panelSizeFromCorners(distance * -1.0, corners.corner1, corners.corner2);
		direction = (avg(corners.corner1.direction, corners.corner2.direction) % 12) * -30.0;
		inclination = (avg(corners.corner1.inclination, corners.corner2.inclination) % 12) * 30.0;
		backgroundWidth = size.width;
		backgroundHeight = size.height;

	}
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
	if (link.options.shape !== undefined && link.options.shape !== "arrow") {
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
	if (link.options.shape === "arrow") {
		var arrow = document.createElement("a-entity");
		arrow.setAttribute("class", "clickable");
		arrow.setAttribute("vr-passage-link", `name: ${link.link}; event: click`);
		arrow.setAttribute("position", "0 -1.6 0");
		arrow.setAttribute("rotation", "-90 0 0");
		arrow.setAttribute("geometry", `primitive: arrow;`);
		arrow.setAttribute(
			"material",
			`color:  ${backgroundColor};  shader:  standard; opacity: ${backgroundOpacity};`
		);
		background.appendChild(arrow);
	}
	// text.setAttribute("position", "0 0 0.05");
	head.appendChild(outer);
	outer.appendChild(inner);
	inner.appendChild(background);
	// inner.appendChild(text);
	return head;
}

function createPassageText(text, textIndex, currentPassageTwinePosition) {

	var direction = (textIndex + 1) * 2.0;
	var directionInDegrees = false;
	if (text.twinePosition !== undefined) {
		directionInDegrees = true;
		direction = getDirectionBetweenPassages(currentPassageTwinePosition, text.twinePosition);
	}
	if (text.options.direction !== undefined) {
		directionInDegrees = false;
		direction = text.options.direction;
	}
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
		distance: text.options.distance,
		backgroundSize: backgroundSize,
		backgroundColor: text.options.backgroundColor,
		backgroundOpacity: text.options.backgroundOpacity,
		backgroundShape: text.options.backgroundShape,
		backgroundSrc: backgroundSrc,
		color: text.options.color,
		text: text.text
	}
	
	var mergedOptions = mergeMixins(text.options.mixin ? text.options.mixin : "", localOptions);
	
	el.setAttribute("reach-text-panel", mergedOptions);

	return el;
}

export {
	createPassageLink,
	createPassageText
};
