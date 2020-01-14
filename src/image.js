import {mergeMixins} from './utility.js';

function getImagePanel(image) {

	var el = document.createElement("a-entity");

	var localOptions = image.options;
	
	localOptions.link = image.link;
	
	var mergedOptions = mergeMixins(image.options.mixin, localOptions, {img: image.img});
	
	el.setAttribute("reach_image_panel", mergedOptions);
	return el;

}

export {getImagePanel};