window.storyFormat({
	"author": "Mike Spears, mike.spears@utoronto.ca",
	"description": "A new story format for VR walkthroughs.",
	"image": "icon.svg",
	"name": "reach",
	"version": "1.0.57",
	"proofing": false,
	"license": "MIT",
	"url": "https://samesimilar.com",
	"source": "<!DOCTYPE html>\n<html>\n  <head>\n<script src=\"https://cdn.jsdelivr.net/gh/aframevr/aframe@e850be07c3a96fdfbafbd57c63cd2679fea0fcb1/dist/aframe-master.min.js\"></script>\n<script src=\"https://unpkg.com/aframe-html-shader@0.2.0/dist/aframe-html-shader.min.js\"></script>   <script src=\"http://localhost:8000/reach.js\" type=\"module\"></script>\n    <title>{{STORY_NAME}}</title>\n  </head>\n  <body>\n    {{STORY_DATA}}\n    <a-scene device-motion-permission>\n      <a-assets><img src=\"https://cdn.jsdelivr.net/gh/UofTMADLab/reach-dist/reachDefaultRoom.png\" id=\"reach-default-360\"/ crossorigin=\"anonymous\"> </a-assets>\n<a-entity id=\"container\"> </a-entity>\n      <a-entity laser-controls=\"hand: right\"></a-entity>\n      <a-camera id=\"main-camera\" wasd-controls=\"enabled: false\">\n</a-camera>\n    </a-scene>\n</body>\n</html>\n\n"
});