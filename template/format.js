window.storyFormat({
	"author": "Mike Spears, mike.spears@utoronto.ca",
	"description": "A new story format for VR walkthroughs.",
	"image": "icon.svg",
	"name": "reach",
	"version": "{{REACH_VERSION}}",
	"proofing": false,
	"license": "MIT",
	"url": "https://samesimilar.com",
	"source": "<!DOCTYPE html>\n<html>\n  <head>\n<script src=\"https://aframe.io/releases/0.9.2/aframe.min.js\"></script>\n   <script>{{REACH_CODE}}</script>\n    <title>{{STORY_NAME}}</title>\n  </head>\n  <body>\n    {{STORY_DATA}}\n    <a-scene reach-load-local>\n      <a-assets><img src=\"data:image/png;base64,{{REACH_DEFAULT_360}}\" id=\"reach-default-360\"/ crossorigin=\"anonymous\"> </a-assets>\n<a-entity id=\"container\"> </a-entity>\n      <a-entity laser-controls=\"hand: right\"></a-entity>\n      <a-camera id=\"main-camera\" wasd-controls=\"enabled: false\">\n        <a-entity cursor></a-entity>\n      </a-camera>\n    </a-scene>\n</body>\n</html>\n\n"
});

