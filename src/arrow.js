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