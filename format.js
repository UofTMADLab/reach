window.storyFormat({
	"author": "Mike Spears",
	"description": "A new story format for VR walkthroughs.",
	"image": "icon.svg",
	"name": "reach",
	"version": "0.0.4",
	"proofing": false,
	"license": "MIT",
	"url": "https://samesimilar.com",
	"source": "<!DOCTYPE html>\n<html>\n  <head>\n    <script src=\"https://aframe.io/releases/0.9.2/aframe.min.js\"></script>\n    <script src=\"https://samesimilar.com/reach.js\"></script>\n    <title>{{STORY_NAME}}</title>\n  </head>\n  <body>\n    {{STORY_DATA}}\n    <a-scene>\n      <a-assets> </a-assets>\n      <a-entity id=\"container\"> </a-entity>\n      <a-entity laser-controls=\"hand: right\"></a-entity>\n      <a-camera id=\"main-camera\" wasd-controls=\"enabled: false\">\n        <a-cursor objects=\".clickable\"></a-cursor>\n      </a-camera>\n    </a-scene>\n\n    <script>\n      loadLocalStory();\n    </script>\n  </body>\n</html>\n\n"
});
