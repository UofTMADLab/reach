import {getSrc} from './utility.js';

function createSoundElement(sound) {
	var head = document.createElement("a-entity");
	head.setAttribute("position", "0 1.6 0");
  var outer = document.createElement("a-entity");
  var direction = 0;
  var elevation = 0;
  if (sound.options.direction !== undefined) {
	  direction = (sound.options.direction % 12) * -30.0;
  }
  if (sound.options.elevation !== undefined) {
	  elevation = (sound.options.elevation % 12) * 30.0;
  }
  outer.setAttribute("rotation", `${elevation} ${direction} 0`);
    
  var distance = 0;
  if (sound.options.direction !== undefined) {
	  distance = -2;
  }
  if (sound.options.distance !== undefined) {
	  distance = -1.0 * sound.options.distance;
  }
  console.log("sound distance " + distance);
  var soundElement = document.createElement("a-sound");
  soundElement.setAttribute("src", getSrc(sound.src));
  soundElement.setAttribute("position", `0 0 ${distance}`);

  soundElement.setAttribute("autoplay", "true");
  soundElement.setAttribute("loop", "true");
  outer.appendChild(soundElement);
  head.appendChild(outer);
  return head;
}

export {createSoundElement};