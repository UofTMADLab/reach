import {getSrc, mergeMixins} from './utility.js';

function createSoundElement(sound) {
	
	var el = document.createElement("a-entity");

	var localOptions = sound.options;
	localOptions.src = sound.src;
	
	var mergedOptions = mergeMixins(sound.options.mixin, localOptions);
	
	el.setAttribute("reach_sound", mergedOptions);
	return el;
	
}


export {createSoundElement};