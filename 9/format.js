window.storyFormat({
	"author": "Mike Spears",
	"description": "A new story format for VR walkthroughs.",
	"image": "icon.svg",
	"name": "reach",
	"version": "0.0.9",
	"proofing": false,
	"license": "MIT",
	"url": "https://samesimilar.com",
	"source": "<!DOCTYPE html>\n<html>\n  <head>\n    <script src=\"https://aframe.io/releases/0.9.2/aframe.min.js\"></script>\n    <script src=\"http://localhost:8000/reach.js\"></script>\n    <title>{{STORY_NAME}}</title>\n  </head>\n  <body>\n    {{STORY_DATA}}\n    <a-scene reach-load-local>\n      <a-assets><img src=\"http://localhost:8000/reach-default-360.png\" id=\"reach-default-360\"/ crossorigin=\"anonymous\"> </a-assets>\n      <a-entity id=\"container\"> </a-entity>\n      <a-entity laser-controls=\"hand: right\"></a-entity>\n      <a-camera id=\"main-camera\" wasd-controls=\"enabled: false\">\n        <a-cursor objects=\".clickable\"></a-cursor>\n      </a-camera>\n    </a-scene>\n</body>\n</html>\n\n"
});
