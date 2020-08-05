const { Cesium } = DC.Namespace

import Color from '../utils/Color.js';
import CesiumUtils from '../utils/CesiumUtils.js';
import PolylineTrailLinkMaterialProperty from '../Material/PolylineTrailLinkMaterial';

function FlyLineFactory(viewer, isClick, option) {
    this.viewer = viewer;
    this.isClick = isClick;
    this.option = {};
    this.id = CesiumUtils.getID(10);
    if (this.option) {
        if (!this.option.createCallBackEvent) {
            this.option.createCallBackEvent = function() { };
        }
        this.option.color = (this.option.color ? this.option.color : new Color(1, 1, 1, 1));
        this.option.duration = (this.option.duration ? this.option.duration : 1000);
        this.option.height = (this.option.height ? this.option.height : 300);
    }

    FlyLineFactory.prototype.add = function() {
        var viewer = this.viewer;
        var startPoint = null;
        var endPonit = null;
        var option = this.option;
        var id = this.id;
        this.leftClickAction = function(e) {
            if (startPoint === null) {
                var position1 = viewer.scene.camera.pickEllipsoid(e.position, viewer.scene.globe.ellipsoid);
                var ellipsoid1 = viewer.scene.globe.ellipsoid;
                var cartographic1 = ellipsoid1.cartesianToCartographic(position1);
                var lat1 = Cesium.Maths.toDegrees(cartographic1.latitude);
                var lng1 = Cesium.Maths.toDegrees(cartographic1.longitude);
                startPoint = [lng1, lat1];
            } else {
                console.log(option);
                var position2 = viewer.scene.camera.pickEllipsoid(e.position, viewer.scene.globe.ellipsoid);
                var ellipsoid2 = viewer.scene.globe.ellipsoid;
                var cartographic2 = ellipsoid2.cartesianToCartographic(position2);
                var lat2 = Cesium.Maths.toDegrees(cartographic2.latitude);
                var lng2 = Cesium.Maths.toDegrees(cartographic2.longitude);
                endPonit = [lng2, lat2];
                var material = new PolylineTrailLinkMaterialProperty(option.color, option.duration);
                var points = CesiumUtils.parabolaEquation(
                    {
                        pt1: {
                            lon: startPoint[0],
                            lat: startPoint[1]
                        },
                        pt2: {
                            lon: endPonit[0],
                            lat: endPonit[1]
                        },
                        height: option.height,
                        num: 100
                    }
                );
                var pointArr = [];
                for (var i = 0; i < points.length; i++) {
                    pointArr.push(points[i][0], points[i][1], points[i][2]);
                }
                viewer.entities.add({
                    name: 'Flyline' + id,
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointArr),
                        width: 4,
                        material: material
                    }
                });
                viewer.entities.add({
                    name: 'Flyline' + id,
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointArr),
                        width: 4,
                        material: new Color(0, 0, 1, 0.5)
                    }
                });
                startPoint = null;
            }
        };
        if (this.isClick) {
            // viewer.screenSpaceEventHandler.setInputAction(this.leftDownAction, ScreenSpaceEventType.LEFT_DOWN);
            // viewer.screenSpaceEventHandler.setInputAction(this.leftUpAction, ScreenSpaceEventType.LEFT_UP);
            // viewer.screenSpaceEventHandler.setInputAction(this.mouseMoveAction, ScreenSpaceEventType.MOUSE_MOVE);
            viewer.screenSpaceEventHandler.setInputAction(this.leftClickAction, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        } else {
            // viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
            // viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
            // viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
    };
}
export default FlyLineFactory;
