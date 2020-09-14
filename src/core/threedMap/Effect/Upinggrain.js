const { Cesium } = DC.Namespace


import PolylineTrailLinkMaterial from '../Material/PolylineTrailLinkMaterial.js';

import CesiumUtils from '../utils/CesiumUtils';

function Upinggrain(viewer, Upinggrainoption) {
    this.viewer = viewer;
    this.Upinggrainoption = Upinggrainoption;
}

Upinggrain.prototype.add = function() {
    var viewer = this.viewer;
    var upingGrainOption = this.Upinggrainoption;
    var color = new Cesium.Color(0.529, 0.807, 0.980, 1);
    var outcolor = new Cesium.Color(0.529, 0.807, 0.980, 0.1);
    var material = new PolylineTrailLinkMaterial(color, upingGrainOption.timeInterval);
    var Points = upingGrainOption.Points;
    for (var i = 0; i < Points.length; i++) {
        var pointArr = [];
        var pointHeight = (CesiumUtils.randomNum(1, i)) / i * 1000;
        pointArr.push(Points[i].lon, Points[i].lat, 0, Points[i].lon, Points[i].lat, pointHeight);
        viewer.entities.add({
            name: 'upgrain',
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointArr),
                width: 3,
                material: material
            }
        });
        viewer.entities.add({
            name: 'upgrain',
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointArr),
                width: 2,
                material: outcolor
            }
        });
    }
};

Upinggrain.prototype.delete = function() {
    var viewer = this.viewer;
    var entitys = viewer.entities._entities._array;
    for (var i = 0; i < entitys.length; i++) {
        if (entitys[i]._name === 'upgrain') {
            viewer.entities.remove(entitys[i]);
            i--;
        }
    }
};

export default Upinggrain;
