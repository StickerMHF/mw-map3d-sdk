const { Cesium } = DC.Namespace

import PolylineTrailLinkMaterial from '../Material/PolylineTrailLinkMaterial.js';

function ODLines(viewer, RayLineparams) {
    this.viewer = viewer;
    this.RayLineparams = RayLineparams;
}

ODLines.prototype.add = function() {
    var viewer = this.viewer;
    var RayLineparams = this.RayLineparams;
    var color = new Cesium.Color(1, 0, 0, 1);
    var outcolor = new Cesium.Color(1, 0.882, 0.678, 0.2);
    var toPoints = this.RayLineparams.toPonit;
    var material = new PolylineTrailLinkMaterial(color, RayLineparams.timeInterval);
    var pointArrOD = [];
    for (var i = 0; i < toPoints.length; i++) {
        pointArrOD.push(toPoints[i].lon, toPoints[i].lat);
    }
    viewer.entities.add({
        name:'ODlines',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(pointArrOD),
            width: 4,
            clampToGround: true,
            material: material
        }
    });
    viewer.entities.add({
        name:'ODlines',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(pointArrOD),
            width: 3,
            material: outcolor,
            clampToGround: true
        }
    });
};

ODLines.prototype.delete = function() {
    var viewer = this.viewer;
    var entitys = viewer.entities._entities._array;
    for (var i = 0; i < entitys.length; i++) {
        if (entitys[i]._name==='ODlines') {
            viewer.entities.remove(entitys[i]);
            i--;
        }
    }
};
export default ODLines;
