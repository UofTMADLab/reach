import {mergeMixins, getVideoId} from './utility.js';

function createVideoSphere(background, currentPassageName) {

	var el = document.createElement("a-entity");

	var localOptions = background.options;
	localOptions.src = background.src;
	localOptions.videoId = getVideoId(localOptions.src);
	localOptions.video = undefined;
	
	var mergedOptions = mergeMixins(background.options.mixin, localOptions);
	
	el.setAttribute("reach_video", mergedOptions);
	return el;
	
}

export {createVideoSphere};