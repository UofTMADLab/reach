window.storyFormat({
	"author": "Mike Spears, mike.spears@utoronto.ca",
	"description": "reach is a twine story format for authoring immersive XR narratives, environments and prototypes.",
	"image": "icon.svg",
	"name": "reach",
	"version": "{{REACH_VERSION}}",
	"proofing": false,
	"license": "MIT",
	"url": "https://github.com/UofTMADLab/reach-dist",
	"source": "<!DOCTYPE html>\n<html>\n  <head>\n<script src=\"https://cdn.jsdelivr.net/gh/aframevr/aframe@e850be07c3a96fdfbafbd57c63cd2679fea0fcb1/dist/aframe-master.min.js\"></script>\n<script src=\"https://unpkg.com/aframe-html-shader@0.2.0/dist/aframe-html-shader.min.js\"></script>    <script>{{REACH_CODE}}</script>\n    <title>{{STORY_NAME}}</title>\n  </head>\n  <body>\n    {{STORY_DATA}}\n    <a-scene reach-load-local>\n      <a-assets><img src=\"https://cdn.jsdelivr.net/gh/UofTMADLab/reach-dist/reachDefaultRoom.png\" id=\"reach-default-360\"/ crossorigin=\"anonymous\"> </a-assets>\n<a-entity id=\"container\"> </a-entity>\n      <a-entity laser-controls=\"hand: right\"></a-entity>\n      <a-camera id=\"main-camera\" wasd-controls=\"enabled: false\">\n </a-camera>\n    </a-scene>\n</body>\n</html>\n\n"
});

