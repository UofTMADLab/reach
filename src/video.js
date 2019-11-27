import {getSrc} from './utility.js';

function createVideoSphere(background, currentPassageName) {
	var videoID = `video-${currentPassageName}`
	var videoAsset = document.querySelector(`#${videoID}`);
	if (videoAsset === null) {
		var assets = document.querySelector("a-assets");
		videoAsset = document.createElement("video");
		videoAsset.setAttribute("src", getSrc(background.src));
		videoAsset.setAttribute("autoplay", "true");
		videoAsset.setAttribute("loop", "true");
		videoAsset.setAttribute("id", videoID);
		assets.appendChild(videoAsset);
	}
	
	var videoElement = document.createElement("a-videosphere");
	videoElement.setAttribute("src", `#${videoID}`);
	videoAsset.play();
	// videoElement.components.material.material.map.image.play();
	return videoElement;
}

export {createVideoSphere};