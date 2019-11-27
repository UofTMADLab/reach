function getDirectionBetweenPassages(a,b) {
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

export {getDirectionBetweenPassages, removeAllChildren, getSrc};