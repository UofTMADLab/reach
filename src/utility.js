function getDirectionBetweenPassages(a,b) {
	if (!a || !b) {
		return 0
	}
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

function getSrc(resourceName) {
	if (window.reach_resource_prefix === undefined) {
		return resourceName;
	} 
	var normalizedName = resourceName.toLowerCase();
	if (normalizedName.startsWith("http://") || normalizedName.startsWith("https://") || normalizedName.startsWith("#")) {
		return resourceName;
	}
	return window.reach_resource_prefix.concat(resourceName);
}

function sphericalToCartesian(r, theta, phi) {
	return {x: r * Math.sin(theta) * Math.cos(phi), y: r * Math.sin(theta) * Math.sin(phi), z: r * Math.cos(theta)};
}

function chordLength(r, dtheta) {
	return r * 2 * Math.sin(dtheta / 2.0);
}

function panelSizeFromCorners(distance, corner1, corner2) {
	var dAzimuth = reachDirectionToRadians(corner2.direction) - reachDirectionToRadians(corner1.direction);
	var dInclination = reachInclinationToRadians(corner2.inclination) - reachInclinationToRadians(corner1.inclination);
	return {width: chordLength(distance, dAzimuth), height:chordLength(distance, dInclination)};
}

function avg(a, b) {
	return (a + b) / 2.0;
}

function parseCornerString(str) {
	var splitString = str.split(" ");
	return {corner1: {direction: parseFloat(splitString[0]), inclination: parseFloat(splitString[1])}, corner2: {direction: parseFloat(splitString[2]), inclination: parseFloat(splitString[3])}};
}
function reachDirectionToRadians(direction) {
	return (direction % 12) / -12.0 * 2.0 * Math.PI;
}

function reachInclinationToRadians(inclination) {
	return (inclination % 12) / 12.0 * 2.0 * Math.PI;
}

function mergeMixins(mixins, local, defaultValues = {}) {
	var result = defaultValues;
	if (mixins) {
		var mixinsSplit = mixins.split(' ');
		for (var i in mixinsSplit) {
			var mixinName = mixinsSplit[i];
			var mixin = window.reachMixins[mixinName];
			if (!mixin) {
				console.log(`Reach Warning: mixin not found: ${mixinName}` );
				continue;
			}
			for (var a in mixin) {	
				if (mixin[a] !== undefined)	 {
					result[a] = mixin[a];
				}
				
			}
		}
	}

	for (var la in local) {
		if (local[la] !== undefined){
			result[la] = local[la];
		}		
	}
	result.mixin = undefined;
	return result;
}

const REACH_DEFAULT_NULL = "reach_default_null_754";
const REACH_DEFAULT_NULL_NUMBER = -9999;

export {getDirectionBetweenPassages, removeAllChildren, getSrc, panelSizeFromCorners, avg, parseCornerString, REACH_DEFAULT_NULL,REACH_DEFAULT_NULL_NUMBER, mergeMixins};