import {mergeMixins} from './utility.js';
import {createVideoSphere} from './video.js';

function getPassageSky(background) {
	if (background.options.video === true) {
		return createVideoSphere(background);
	}
	
	var el = document.createElement("a-entity");

	var localOptions = background.options;
	localOptions.src = background.src;
	
	var mergedOptions = mergeMixins(background.options.mixin, localOptions);
	
	el.setAttribute("reach_sky", mergedOptions);
	return el;

}

export {getPassageSky};