import {getSrc} from './utility.js';
import {createVideoSphere} from './video.js';

function getPassageSky(background, currentPassageName) {
	if (background.options.video === true) {
		return createVideoSphere(background, currentPassageName);
	}
  var skyElement = document.createElement("a-sky");

  if (background.src === undefined) {
	  skyElement.setAttribute("src", "#reach-default-360");
  } else {
  	skyElement.setAttribute("src", getSrc(background.src));
  }
  
  var transparent = "true";
  var radius = 5000;
  if (background.options.transparent === false) {
	  transparent = "false";
  }
  if (background.options.distance !== undefined) {
	  radius = background.options.distance;
  }
  
  skyElement.setAttribute("transparent", transparent);
  skyElement.setAttribute("radius", radius);

  return skyElement;
}

export {getPassageSky};