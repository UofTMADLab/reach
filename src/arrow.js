AFRAME.registerGeometry('arrow', {
  schema: {
    vertices: {
      default: ['0.4932 0.1454 0', '0.2432 0.1454 0', '0.4932 0.1454 0.1', '0.2432 0.1454 0.1', '0.2432 -0.7615 0', '0.2432 -0.7615 0.1', '-0.2568 0.1454 0', '-0.5068 0.1454 0', '-0.5068 0.1454 0.1', '-0.2568 0.1454 0.1', '-0.2568 -0.7615 0', '-0.2568 -0.7615 0.1', '-0.0068 0.9011 0.1', '-0.0068 0.9011 0'],
    },
	faces: {
	default: ['1 3 4', '1 4 2', '5 2 4', '5 4 6', '7 10 9', '7 9 8', '7 11 12', '7 12 10', '6 12 11', '6 11 5', '8 14 7', '1 2 14', '2 7 14', '9 10 13', '10 4 13', '3 13 4', '10 12 6', '10 6 4', '14 13 3', '14 3 1', '2 5 11', '2 11 7', '14 8 9', '14 9 13']
	}
  },

  init: function (data) {
    var geometry = new THREE.Geometry();
    geometry.vertices = data.vertices.map(function (vertex) {
        var points = vertex.split(' ').map(function(x){return parseFloat(x);});
        return new THREE.Vector3(points[0], points[1], points[2]);
    });
	console.log(geometry.vertices);
	
    geometry.computeBoundingBox();
	data.faces.forEach(function(face) {
		var points = face.split(' ').map(function(x){return parseInt(x);});
		geometry.faces.push(new THREE.Face3(points[0] - 1, points[1] - 1, points[2] - 1));
	});
	
    geometry.mergeVertices();
	console.log(geometry.faces);
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    this.geometry = geometry;
  }
});

import {REACH_DEFAULT_NULL} from './utility.js';

AFRAME.registerComponent("reach_arrow", {
	
	schema: {
		
		
		direction: {type: "number", default: 0.0},
		directionInDegrees: {type: "boolean", default: false},
		inclination: {type: "number", default: 0.0},
		distance: {type: "number", default: 2.0},
		yHeight: {type: "number", default: 0.0},
		opacity: {type: "number", default: 1.0},
		color: {type: "color", default: "#000000"},
		link: {type: "string", default: REACH_DEFAULT_NULL}
		
	},
	init: function() {
		
	},
	update: function(oldData) {
		
		if (this.head) {
			this.el.removeChild(this.head);
			this.head.destroy();
			this.head = undefined;
			this.outer = undefined;
			this.inner= undefined;
			this.background = undefined;
		}
		
		this.head = document.createElement("a-entity");
		this.head.setAttribute("position", `0 ${this.data.yHeight} 0`);
		this.outer = document.createElement("a-entity");		
		this.outer.setAttribute("rotation", `${(this.data.inclination) % 12 * 30.0} ${this.data.directionInDegrees === true ? this.data.direction : (this.data.direction % 12) * -30.0} 0`);
		this.inner = document.createElement("a-entity");
		this.inner.setAttribute("position", `0 0 ${-1.0 * this.data.distance}`);
		this.background = document.createElement("a-entity");
		this.background.setAttribute("id", "arrow");
		this.background.setAttribute("geometry", `primitive: arrow;`);
		this.background.setAttribute("rotation", `-90 0 0`);
		this.background.setAttribute("material", `color: ${this.data.color}; opacity: ${this.data.opacity}`);
		
		
		if (this.data.link !== REACH_DEFAULT_NULL) {
			this.background.setAttribute("class", "clickable");
			this.background.setAttribute(
				"reach_passage_link",
				`name: ${this.data.link}; event: click`
			);
		}
		this.head.appendChild(this.outer);
		this.outer.appendChild(this.inner);
		this.inner.appendChild(this.background);
		
		this.el.appendChild(this.head);
	},
	remove: function () {
		if (this.head) {
			this.el.removeChild(this.head);
			this.head.destroy();
			this.head = undefined;
			this.outer = undefined;
			this.inner= undefined;
			this.background = undefined;
		}
	},
	
	// tick: function(time, timeDelta) {
	//
	// },
	// tock: function(time, timeDelta, camera) {
	//
	// },
	
	// pause: function() {
	//
	// },
	// play: function() {
	//
	// },
	// updateSchema: function(newData) {
	//
	// },
	// events: {
	// 	click: function(evt) {
	// 		console.log(`This entity was clicked: ${this.el.getAttribute('id')}`);
	// 	}
	// }
	
})