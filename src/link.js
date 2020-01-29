import {
	getDirectionBetweenPassages,
	panelSizeFromCorners,
	avg,
	parseCornerString,
	mergeMixins
} from './utility.js';


function createPassageLink(link, linkIndex, currentPassageTwinePosition) {

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
	
	
	var el = document.createElement("a-entity");

	var localOptions =  {
		id: link.options.id,
		direction: direction,
		directionInDegrees: directionInDegrees,
		inclination: inclination,
		distance: distance,
		scale: link.options.scale,
		backgroundSize: backgroundSize,
		backgroundColor: link.options.backgroundColor,
		opacity: link.options.opacity,
		backgroundShape: link.options.backgroundShape,
		img: link.options.img,
		color: link.options.color,
		text: link.text,
		link: link.link,
		arrow: link.options.arrow,
		floor: link.options.floor,
		onMouseEnter: link.options.onMouseEnter,
		onMouseLeave: link.options.onMouseLeave,
		onClick: link.options.onClick,
	};
	
	var defaultOptions = {
		direction: linkIndex + 1,
		directionInDegrees: false,
		backgroundSize: {x: 1.0, y: 1.0},
		backgroundColor: "#0000AA",
		opacity: 0.7,
		color: "#FFFFFF",
		text: link.link
	};
	
	var mergedOptions = mergeMixins(link.options.mixin, localOptions, defaultOptions);
	
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
		id: text.options.id,
		direction: direction,
		directionInDegrees: directionInDegrees,
		inclination: inclination,
		distance: distance,
		scale: text.options.scale,
		backgroundSize: backgroundSize,
		backgroundColor: text.options.backgroundColor,
		opacity: text.options.opacity,
		backgroundShape: text.options.backgroundShape,
		img: text.options.img,
		color: text.options.color,
		text: text.text,
		arrow: text.options.arrow,
		onMouseEnter: text.options.onMouseEnter,
		onMouseLeave: text.options.onMouseLeave,
		onClick: text.options.onClick,
	};
	
	var defaultOptions = {
		direction:  (textIndex + 1) * 2.0,
		directionInDegrees: false
	};
	
	var mergedOptions = mergeMixins(text.options.mixin, localOptions, defaultOptions);

	el.setAttribute("reach_text_panel", mergedOptions);

	return el;
}

function createPassageHTML(text, textIndex, currentPassageTwinePosition) {

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
		id: text.options.id,
		direction: direction,
		directionInDegrees: directionInDegrees,
		inclination: inclination,
		distance: distance,
		scale: text.options.scale,
		backgroundSize: backgroundSize,
		backgroundColor: text.options.backgroundColor,
		opacity: text.options.opacity,
		backgroundShape: text.options.backgroundShape,
		img: text.options.img,
		text: text.text,
		link: text.options.link,
		debugCanvas: text.options.debugCanvas,
		onMouseEnter: text.options.onMouseEnter,
		onMouseLeave: text.options.onMouseLeave,
		onClick: text.options.onClick,
	};
	
	var defaultOptions = {
		direction:  (textIndex + 1) * 2.0,
		directionInDegrees: false
	};
	
	var mergedOptions = mergeMixins(text.options.mixin, localOptions, defaultOptions);

	el.setAttribute("reach_html_panel", mergedOptions);

	return el;
}


export {
	createPassageLink,
	createPassageText,
	createPassageHTML
};
