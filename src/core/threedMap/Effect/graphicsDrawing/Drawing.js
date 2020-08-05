const { Cesium } = DC.Namespace

import Color from '../../utils/Color';
import defined from '../../utils/defined';
import CesiumUtils from '../../utils/CesiumUtils';
import PolylineTrailLinkMaterialProperty from '../../Material/PolylineTrailLinkMaterial';



function Drawing(viewer) {
    this.viewer = viewer;
}

//设置实体的材质
var drawGraphicMaterial = {
    //normal类型
    normal: new Color(1.0, 1.0, 0.0, 0.5),
    //高亮显示类型
    heightLight: new Color(1.0, 0.0, 0.0, 0.5),
    //ODline类型
    ODline: new PolylineTrailLinkMaterialProperty(Color.BLUE, 6000),
    //网格类型
    grid: new Cesium.GridMaterialProperty({
        color: Color.YELLOW,
        cellAlpha: 0.2,
        lineCount: new Cesium.Cartesian2(8, 8),
        lineThickness: new Cesium.Cartesian2(2.0, 2.0)
    })
};

var pickEntityCollection = [];
var handlers;

// //恢复方法
Drawing.prototype.reDrawGraphic = function(featureCollection) {
    var that = this;
    featureCollection.features.forEach(function(feature) {
        var radius = feature.properties.otherproperties;
        var coordinates = feature.geometry.coordinates;
        var drawingMode = feature.geometry.type;
        var id = feature.properties.id;
        var style = feature.properties.style;
        var material = that.exportMaterial(style, coordinates.length);
        var redrawoptions = {
            id: id,
            coordinates: coordinates,
            drawingMode: drawingMode,
            style: style,
            material: material,
            radius: radius
        };
        //调用绘制的方法
        if (drawingMode === 'point') {
            if (defined(redrawoptions.coordinates)) {
                var pointShape = that.createPoint(coordinates, redrawoptions);
                pickEntityCollection.push(pointShape);
            }
        } else {
            var shape = that.drawShape(drawingMode, coordinates, null, redrawoptions);
            pickEntityCollection.push(shape);
        }
    });
};

//自定义绘制
Drawing.prototype.drawGraphic = function(options) {
    var drawingMode = Cesium.defaultValue(options.mode, 'point');
    var callback = Cesium.defaultValue(options.callback, function() { });
    var that = this;
    var viewer = this.viewer;
    var boundaryPoints = new Array();
    var handler;
    var activeShapePoints = new Array();
    var activeShape;
    var floatingPoint;
    var returnGraphic;
    if (handler) {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    if (activeShapePoints || activeShape || floatingPoint || boundaryPoints.length > 0 || returnGraphic) {
        if (floatingPoint) {
            viewer.entities.remove(floatingPoint);
            floatingPoint = undefined;
        }
        if (activeShape) {
            viewer.entities.remove(activeShape);
            activeShape = undefined;
        }
        activeShapePoints = [];
        if (boundaryPoints.length > 0) {
            for (var i = 0; i < boundaryPoints.length; i++) {
                viewer.entities.remove(boundaryPoints[i]);
            }
        }
    }

    function listenClick(viewer, callback) {
        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(movement) {
            var position = viewer.scene.pickPosition(movement.position);
            var screenPosition = movement.position;
            var callbackObj = {};
            callbackObj.cartesian3 = position;
            callbackObj.movement = movement;
            callbackObj.screenPosition = screenPosition;
            callback(callbackObj, handler);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    if (drawingMode === 'point') {
        listenClick(viewer, function(callbackObj, handler) {
            var position = callbackObj.cartesian3;
            var Point = viewer.entities.add({
                id: 'customEntity' + CesiumUtils.getID(10),
                type: 'point',
                position: position,
                point: {
                    color: new Color(1, 1, 0, 0.5),
                    pixelSize: 10,
                    outline: true,
                    outlineColor: Color.BLACK,
                    outlineWidth: 0,
                    show: true
                },
                description: { style: 'normal' }
            });
            pickEntityCollection.push(Point);
            //用于恢复操作
            var pickEntityCollectionToGeojson = Cesium.CesiumEntityToGeojson.entityCollectionToGeojson(pickEntityCollection);
            var callbackProperty = {
                entityId: Point.id,
                jsonObj: pickEntityCollectionToGeojson
            };
            callback(callbackProperty);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        });
    } else {
        handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        handler.setInputAction(function(event) {
            var earthPosition = viewer.scene.pickPosition(event.position);
            if (defined(earthPosition)) {
                if (activeShapePoints.length === 0) {
                    floatingPoint = that.createPoint(earthPosition);
                    activeShapePoints.push(earthPosition);
                    var dynamicPositions = new Cesium.CallbackProperty(function() {
                        if (drawingMode === 'polygon') {
                            return new Cesium.PolygonHierarchy(activeShapePoints);
                        }
                        return activeShapePoints;
                    }, false);
                    activeShape = that.drawShape(drawingMode, dynamicPositions, activeShapePoints);
                }
                activeShapePoints.push(earthPosition);
                var boundaryPoint = that.createPoint(earthPosition);
                boundaryPoints.push(boundaryPoint);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function(event) {
            if (defined(floatingPoint)) {
                var newPosition = viewer.scene.pickPosition(event.endPosition);
                if (defined(newPosition)) {
                    floatingPoint.position.setValue(newPosition);
                    activeShapePoints.pop();
                    activeShapePoints.push(newPosition);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        this.terminateShape = function() {
            activeShapePoints.pop();
            var final_Entity;
            if (activeShapePoints.length) {
                final_Entity = that.drawShape(drawingMode, activeShapePoints, activeShapePoints);
            }
            viewer.entities.remove(floatingPoint);
            viewer.entities.remove(activeShape);
            floatingPoint = undefined;
            activeShape = undefined;
            activeShapePoints = [];
            for (var i = 0; i < boundaryPoints.length; i++) {
                viewer.entities.remove(boundaryPoints[i]);
            }
            return final_Entity;
        };

        handler.setInputAction(function(event) {
            returnGraphic = that.terminateShape();
            pickEntityCollection.push(returnGraphic);
            var pickEntityCollectionToGeojson = Cesium.CesiumEntityToGeojson.entityCollectionToGeojson(pickEntityCollection);
            var callbackProperty = {
                entityId: returnGraphic.id,
                jsonObj: pickEntityCollectionToGeojson
            };
            callback(callbackProperty);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
};

//创建悬浮点和重新绘制的
Drawing.prototype.createPoint = function(worldPosition, redrawoptions) {
    redrawoptions = Cesium.defaultValue(redrawoptions, {});
    var description = typeof redrawoptions.style === 'undefined' ? { style: 'normal' } : { style: redrawoptions.style };
    var id = Cesium.defaultValue(redrawoptions.id, 'customEntity' + CesiumUtils.getID(10));
    var point = this.viewer.entities.add({
        type: 'point',
        id: id,
        position: redrawoptions.coordinates || worldPosition,
        point: {
            color: new Color(1, 1, 0, 0.5),
            pixelSize: 10,
            outline: true,
            outlineColor: Color.BLACK,
            outlineWidth: 0,
            show: true
        },
        description: description
    });
    return point;
};

//画图的方法
Drawing.prototype.drawShape = function(drawingMode, positionData, activeShapePoints, redrawoptions) {
    var viewer = this.viewer;
    //如果重绘调用的类型为空时,说明是创建模式
    redrawoptions = Cesium.defaultValue(redrawoptions, {});
    drawingMode = typeof redrawoptions.mode === 'undefined' ? drawingMode : redrawoptions.mode;
    var id = Cesium.defaultValue(redrawoptions.id, 'customEntity' + CesiumUtils.getID(10));
    var description = typeof redrawoptions.style === 'undefined' ? { style: 'normal' } : { style: redrawoptions.style };
    var shape;
    if (drawingMode === 'polyline') {
        shape = viewer.entities.add({
            id: id,
            type: 'polyline',
            polyline: {
                material: redrawoptions.material || new Color(1, 1, 0, 0.5),
                positions: redrawoptions.coordinates || positionData,
                width: 3,
                clampToGround: true
            },
            description: description
        });
    }
    else if (drawingMode === 'polygon') {
        shape = viewer.entities.add({
            id: id,
            type: 'polygon',
            polygon: {
                hierarchy: redrawoptions.coordinates || positionData,
                outline: true,
                material: redrawoptions.material || new Color(1.0, 1.0, 0.0, 0.5),
                perPositionHeight: true
            },
            description: description
        });
    }
    else if (drawingMode === 'circle') {
        var height = 0;
        if (activeShapePoints !== null) {
            var xyz = new Cesium.Cartesian3(activeShapePoints[0].x, activeShapePoints[0].y, activeShapePoints[0].z);
            var wgs84 = viewer.scene.globe.ellipsoid.cartesianToCartographic(xyz);
            height = wgs84.height;
        }
        var value = typeof positionData.getValue !== 'undefined' ? positionData.getValue(0) : positionData;
        shape = viewer.entities.add({
            id: id,
            type: 'circle',
            position: typeof redrawoptions.coordinates !== 'undefined' ? new Cesium.Cartesian3(redrawoptions.coordinates.x, redrawoptions.coordinates.y, redrawoptions.coordinates.z) : activeShapePoints[0],
            ellipse: {
                outline: true,
                semiMinorAxis: redrawoptions.radius || new Cesium.CallbackProperty(function() {
                    var r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math.pow(value[0].y - value[value.length - 1].y, 2));
                    return r ? r : r + 1;
                }, false),
                semiMajorAxis: redrawoptions.radius || new Cesium.CallbackProperty(function() {
                    var r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math.pow(value[0].y - value[value.length - 1].y, 2));
                    return r ? r : r + 1;
                }, false),
                material: redrawoptions.material || new Color(1.0, 1.0, 0.0, 0.5),
                height: height + 25
            },
            description: description
        });
    }
    else if (drawingMode === 'rectangle') {
        var height1 = 0;
        if (activeShapePoints !== null) {
            var xyz1 = new Cesium.Cartesian3(activeShapePoints[0].x, activeShapePoints[0].y, activeShapePoints[0].z);
            var wgs841 = viewer.scene.globe.ellipsoid.cartesianToCartographic(xyz1);
            height1 = wgs841.height;
        }
        var arr = typeof positionData.getValue === 'function' ? positionData.getValue(0) : positionData;
        shape = viewer.entities.add({
            id: id,
            type: 'rectangle',
            rectangle: {
                outline: true,
                coordinates: typeof redrawoptions.coordinates !== 'undefined' ? new Cesium.Rectangle(redrawoptions.coordinates.west, redrawoptions.coordinates.south, redrawoptions.coordinates.east, redrawoptions.coordinates.north) : new Cesium.CallbackProperty(function() {
                    return Cesium.Rectangle.fromCartesianArray(arr);
                }, false),
                material: redrawoptions.material || new Color(1.0, 1.0, 0.0, 0.5),
                height: height1 + 25
            },
            description: description
        });
    }
    return shape;
};

//获取当前选中的实体
var pickEntity;
Drawing.prototype.Select = function(callback) {
    var that = this;
    handlers = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    if (handlers) {
        handlers.setInputAction(function(event) {
            pickEntity = that.viewer.scene.pick(event.position);
            if (pickEntity) {
                if (defined(pickEntity.id) && defined(pickEntity.id.type)) {
                    pickEntity = pickEntity.id;
                    if (callback) {
                        callback(pickEntity.type);
                    }
                    pickEntityCollection.forEach(function(ele) {
                        that.renderByStatus(ele, false);
                    });
                    that.renderByStatus(pickEntity, true);
                }
            } else {
                pickEntity = null;
                pickEntityCollection.forEach(function(ele) {
                    that.renderByStatus(ele, false);
                });
                handlers.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
};

//根据高亮的状态,修改实体的材质
//当为高亮状态,统一默认设置为高亮显示
//当非高亮状态时,会从实体的描述信息中获取实体当前的材质
Drawing.prototype.renderByStatus = function(ele, status) {
    var that = this;
    if (status !== null) {
        if (status) {
            that.renderByType(ele, 'heightLight');
        } else {
            switch (ele.description.getValue().style) {
                case 'normal':
                    that.renderByType(ele, ele.description.getValue().style);
                    break;
                case 'ODline':
                    that.renderByType(ele, ele.description.getValue().style);
                    break;
                case 'grid':
                    that.renderByType(ele, ele.description.getValue().style);
                    break;
            }
        }
    }
};

//通过不同的类型修改实体的材质
Drawing.prototype.renderByType = function(ele, material) {
    var that = this;
    that.isEqualMaterial(ele, material);
    switch (ele.type) {
        case 'polygon':
            ele.polygon.material = that.exportMaterial(material);
            break;
        case 'polyline':
            var lineNum = ele.polyline.positions.getValue(0).length;
            ele.polyline.material = that.exportMaterial(material, lineNum);
            break;
        case 'circle':
            ele.ellipse.material = that.exportMaterial(material);
            break;
        case 'rectangle':
            ele.rectangle.material = that.exportMaterial(material);
            break;
    }
};

//判断设置的材质是否与实体中的描述的材质是否相同
//如果不相同,将新的material类型填写到实体的描述信息中
Drawing.prototype.isEqualMaterial = function(ele, material) {
    if (ele.description.getValue().style !== material) {
        if (material !== 'heightLight') {
            ele.description.getValue().style = material;
        }
    }
};

//根据传入的id对实体进行材质的修改
Drawing.prototype.modifyMaterialById = function(id, callback) {
    var that = this;
    callback = Cesium.defaultValue(callback, function() { });
    id = Cesium.defaultValue(id, CesiumUtils.getID(10));
    var entity = this.viewer.entities.getById(id);
    if (defined(entity)) {
        pickEntityCollection.forEach(function(ele) {
            that.renderByStatus(ele, false);
        });
        pickEntity = entity;
        that.renderByStatus(pickEntity, true);
        callback(entity.type);
    }
};

//删除选中的实体
Drawing.prototype.deleteGraphic = function(callback) {
    if (defined(pickEntity)) {
        Cesium.defaultValue(callback, function() { });
        this.viewer.entities.remove(pickEntity);
        pickEntityCollection.forEach(function(ele, index) {
            if (pickEntity.id === ele.id) {
                pickEntityCollection.splice(index, 1);
            }
        });
        var pickEntityCollectionToGeojson = Cesium.CesiumEntityToGeojson.entityCollectionToGeojson(pickEntityCollection);
        callback(pickEntityCollectionToGeojson);
    }
};

//修改选中实体的材质
Drawing.prototype.modifyMaterial = function(material, callback) {
    var that = this;
    //判断选中的实体是否被删除
    if (defined(pickEntity)) {
        callback = Cesium.defaultValue(callback, function() { });
        that.renderByType(pickEntity, material);
        var pickEntityCollectionToGeojson = Cesium.CesiumEntityToGeojson.entityCollectionToGeojson(pickEntityCollection);
        callback(pickEntityCollectionToGeojson);
        if (handlers) {
            handlers.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
    }
};

//根据材质类型输出相应的材质
Drawing.prototype.exportMaterial = function(material, lineNum) {
    var exportmaterials;
    switch (material) {
        case 'normal':
            exportmaterials = drawGraphicMaterial.normal;
            break;
        case 'ODline':
            exportmaterials = new PolylineTrailLinkMaterialProperty(new Color(30 / 255, 144 / 255, 255 / 255, 1), lineNum * 800);
            break;
        case 'grid':
            exportmaterials = drawGraphicMaterial.grid;
            break;
        case 'heightLight':
            exportmaterials = drawGraphicMaterial.heightLight;
            break;
    }
    return exportmaterials;
};
export default Drawing;
