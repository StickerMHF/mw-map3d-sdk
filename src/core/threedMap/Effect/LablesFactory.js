const { Cesium } = DC.Namespace

import defined from '../utils/defined.js';
import CesiumUtils from '../utils/CesiumUtils.js';

import labeltype3 from './Label/labeltype3.js';
import labeltype1 from './Label/labeltype1.js';
import labeltype2 from './Label/labeltype2.js';
import LabelUtils from './Label/LabelUtils.js';
import labeltype4 from './Label/labeltype4.js';
import labeltype5 from './Label/labeltype5.js';
import labeltype6 from './Label/labeltype6.js';
import labeltype7 from './Label/labeltype7.js';
import labeltype8 from './Label/labeltype8.js';
import labeltype9 from './Label/labeltype9.js';
import labeltype10 from './Label/labeltype10.js';

import ElliposidFadeMaterialProperty from '../Material/ElliposidFadeMaterial';

function LablesFactory(viewer, options, isClick) {
    this.viewer = viewer;
    this.options = options;
    this.isClick = Cesium.defaultValue(isClick, false);
}

LablesFactory.prototype.add = function() {
    var isClick = this.isClick;
    var viewer = this.viewer;
    var selectEvents = Cesium.defaultValue(this.options.selectEvents, function() { });
    var createEvents = Cesium.defaultValue(this.options.createEvents, function() { });
    var getPosition = Cesium.defaultValue(this.options.getPosition, function() { });
    var type = Cesium.defaultValue(this.options.type, 'type4');
    var pickEntityName;
    var pointDraged = null;
    var leftDownFlag;

    this.leftClickAction = function(e) {
        if (pointDraged === null && leftDownFlag === false) {
            var pickEntity = viewer.scene.pick(e.position);
            var position = viewer.scene.camera.pickEllipsoid(e.position, viewer.scene.globe.ellipsoid);
            var ellipsoid = viewer.scene.globe.ellipsoid;
            var cartographic = ellipsoid.cartesianToCartographic(position);
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            var lng = Cesium.Math.toDegrees(cartographic.longitude);
            var addoption = {
                position: [lng, lat, 50],
                id: CesiumUtils.getID(10)
            };
            var addoption1 = {
                position: [lng, lat, 0],
                id: CesiumUtils.getID(10)
            };
            if (typeof pickEntity !== 'object' || typeof pickEntity.id !== 'object') {
                switch (type) {
                    case 'type1':
                        // eslint-disable-next-line no-new
                        new labeltype1(viewer, addoption, createEvents);
                        break;
                    case 'type2':
                        // eslint-disable-next-line no-new
                        new labeltype2(viewer, addoption, createEvents);
                        break;
                    case 'type3':
                        // eslint-disable-next-line no-new
                        new labeltype3(viewer, addoption1, createEvents);
                        break;
                    case 'type4':
                        // eslint-disable-next-line no-new
                        new labeltype4(viewer, addoption, createEvents);
                        break;
                    case 'type5':
                        // eslint-disable-next-line no-new
                        new labeltype5(viewer, addoption1, createEvents);
                        break;
                    case 'type6':
                        // eslint-disable-next-line no-new
                        new labeltype6(viewer, addoption, createEvents);
                        break;
                    case 'type7':
                        // eslint-disable-next-line no-new
                        new labeltype7(viewer, addoption, createEvents);
                        break;
                    case 'type8':
                        // eslint-disable-next-line no-new
                        new labeltype8(viewer, addoption, createEvents);
                        break;
                    case 'type9':
                        // eslint-disable-next-line no-new
                        new labeltype9(viewer, addoption1, createEvents);
                        break;
                    case 'type10':
                        // eslint-disable-next-line no-new
                        new labeltype10(viewer, addoption1, createEvents);
                        break;
                    default:
                        // eslint-disable-next-line no-new
                        new labeltype4(viewer, addoption1, createEvents);
                        break;
                }
            }
        }
    };

    this.leftDownAction = function(e) {
        pointDraged = viewer.scene.pick(e.position);
        if (typeof pointDraged === 'object') {
            if (typeof pointDraged.id === 'object') {
                pickEntityName = pointDraged.id.id;
                if (pickEntityName.indexOf('billboard') >= 0) {
                    selectEvents(pickEntityName);
                    leftDownFlag = true;
                    //鼠标无法拖动屏幕
                    viewer.scene.screenSpaceCameraController.enableRotate = false;
                }
            }
        }
    };

    this.leftUpAction = function(e) {
        pointDraged = viewer.scene.pick(e.position);
        if (typeof pointDraged === 'object') {
            if (typeof pointDraged.id === 'object') {
                pickEntityName = pointDraged.id.id;
                var ray = viewer.camera.getPickRay(e.position);
                var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                var ellipsoid = viewer.scene.globe.ellipsoid;
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                var lng = Cesium.Math.toDegrees(cartographic.longitude);
                var height = (LabelUtils.pdValues(pointDraged.id.description) ? pointDraged.id.description.getValue().heights : 0);
                var st = {
                    id: pickEntityName,
                    position: [lng, lat, height]
                };
                getPosition(st);
            }
        }
        leftDownFlag = false;
        pointDraged = null;
        viewer.scene.screenSpaceCameraController.enableRotate = true;
    };

    this.mouseMoveAction = function(e) {
        var cesiumContainer = viewer.container;//document.getElementById('cesiumContainer');
        var moveOverEntity = viewer.scene.pick(e.endPosition);
        if (CesiumUtils.pdValues(moveOverEntity)) {
            if (CesiumUtils.pdValues(moveOverEntity.id) && typeof moveOverEntity.id !== 'string') {
                if (moveOverEntity.id.id.indexOf('billboard') >= 0) {
                    cesiumContainer.style.cursor = 'pointer';
                }
            }
        } else {
            cesiumContainer.style.cursor = 'auto';
        }
        if (leftDownFlag === true && pointDraged !== null && pointDraged.id.id.indexOf('billboard') >= 0) {
            var ray = viewer.camera.getPickRay(e.endPosition);
            var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            var ellipsoid = viewer.scene.globe.ellipsoid;
            var cartographic = ellipsoid.cartesianToCartographic(cartesian);
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            var lng = Cesium.Math.toDegrees(cartographic.longitude);
            var height = (LabelUtils.pdValues(pointDraged.id.description) ? pointDraged.id.description.getValue().heights : 0);
            cartesian = Cesium.Cartesian3.fromDegrees(lng, lat, height, ellipsoid);
            pointDraged.id.position.setValue(cartesian);
        }
    };

    if (isClick) {
        viewer.screenSpaceEventHandler.setInputAction(this.leftDownAction, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        viewer.screenSpaceEventHandler.setInputAction(this.leftUpAction, Cesium.ScreenSpaceEventType.LEFT_UP);
        viewer.screenSpaceEventHandler.setInputAction(this.mouseMoveAction, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        viewer.screenSpaceEventHandler.setInputAction(this.leftClickAction, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    } else {
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
};

LablesFactory.prototype.updatetype1 = function(option) {
    var viewer = this.viewer;
    var cartesian2;
    if (LabelUtils.pdValues(option)) {
        if (LabelUtils.pdValues(option.id)) {
            var entity = viewer.entities.getById(option.id);
            var pictureEntity = viewer.entities.getById('picture' + option.id);
            if (LabelUtils.pdValues(entity)) {
                if (LabelUtils.pdValues(option.color) && LabelUtils.pdValues(option.text)) {
                    var colorcanvas = LabelUtils.updateCanvas(option.text, option.color);
                    entity.billboard._image.setValue(colorcanvas);
                }
                if (LabelUtils.pdValues(option.height)) {
                    var cartesian = entity.position._value;
                    cartesian2 = LabelUtils.transCoordinate(viewer, cartesian, option.height);
                    entity.position.setValue(cartesian2);
                    entity.description = { heights: option.height };
                }
                if (LabelUtils.pdValues(option.size)) {
                    entity.billboard.scale = option.size;
                }
                if (LabelUtils.pdValues(option.isChange)) {
                    entity.billboard.scale = option.isChange;
                }
            }
            if (LabelUtils.pdValues(pictureEntity)) {
                if (LabelUtils.pdValues(option.size)) {
                    pictureEntity.billboard.scale = option.size;
                }
                if (LabelUtils.pdValues(option.height)) {
                    pictureEntity.position._value = cartesian2;
                }
                if (LabelUtils.pdValues(option.panColor)) {
                    option.panColor = LabelUtils.paseRgba(option.panColor, 'GLH');
                    pictureEntity.ellipse._material = new ElliposidFadeMaterialProperty(CesiumUtils.getCesiumColor(option.panColor), 4000);
                }
                if (LabelUtils.pdValues(option.background)) {
                    switch (option.background) {
                        case 'background1':
                            option.background = Cesium.buildModuleUrl('Images/videoBorad.png');
                            break;
                        case 'background2':
                            option.background = Cesium.buildModuleUrl('Images/labelbackground1.png');
                            break;
                        case 'background3':
                            option.background = Cesium.buildModuleUrl('Images/labelbackground2.png');
                            break;
                        default:
                            option.background = Cesium.buildModuleUrl('Images/videoBorad.png');
                            break;
                    }
                    pictureEntity.billboard._image.setValue(option.background);
                }
            }
        }
    }
};

LablesFactory.prototype.updatetype2 = function(option) {
    var viewer = this.viewer;
    if (LabelUtils.pdValues(option)) {
        if (LabelUtils.pdValues(option.id)) {
            var entity = viewer.entities.getById(option.id);
            if (LabelUtils.pdValues(entity)) {
                if (LabelUtils.pdValues(option.text)) {
                    var canvas1 = LabelUtils.updateCanvas2(option.text, null);
                    entity.billboard._image._value = canvas1;
                }
                if (LabelUtils.pdValues(option.color) && LabelUtils.pdValues(option.text)) {
                    var canvas2 = LabelUtils.updateCanvas2(option.text, option.color);
                    entity.billboard._image._value = canvas2;
                }
                if (LabelUtils.pdValues(option.height)) {
                    var cartesian = entity.position._value;
                    var cartesian2 = LabelUtils.transCoordinate(viewer, cartesian, option.height);
                    entity.position._value = cartesian2;
                    entity.description = { heights: option.height };
                }
            }
            if (LabelUtils.pdValues(option.size)) {
                entity.billboard.scale = option.size;
            }
        }
    }
};

LablesFactory.prototype.updatetype3 = function(option) {
    var viewer = this.viewer;
    if (LabelUtils.pdValues(option)) {
        if (LabelUtils.pdValues(option.id)) {
            var entity = viewer.entities.getById(option.id);
            if (LabelUtils.pdValues(entity)) {
                if (LabelUtils.pdValues(option.color) && LabelUtils.pdValues(option.text)) {
                    var canvas2 = LabelUtils.updateCanvas3(option.text, option.color);
                    entity.billboard._image._value = canvas2;
                }
                if (LabelUtils.pdValues(option.height)) {
                    var cartesian = entity.position._value;
                    var cartesian2 = LabelUtils.transCoordinate(viewer, cartesian, option.height);
                    entity.position._value = cartesian2;
                    entity.ellipse.height.setValue(option.height);
                    entity.description = { heights: option.height };
                }
                if (LabelUtils.pdValues(option.size)) {
                    entity.billboard.scale = option.size;
                }
                if (LabelUtils.pdValues(option.panColor)) {
                    option.panColor = LabelUtils.paseRgba(option.panColor, 'GLH');
                    entity.ellipse._material = new ElliposidFadeMaterialProperty(CesiumUtils.getCesiumColor(option.panColor), 4000);
                }
            }
        }
    }
};

LablesFactory.prototype.updatetype4 = function(option) {
    var that = this;
    var viewer = this.viewer;
    var cartesian2;
    var entitys = viewer.entities._entities._array;
    if (LabelUtils.pdValues(option)) {
        if (LabelUtils.pdValues(option.id)) {
            for (var i = 0; i < entitys.length; i++) {
                if (entitys[i].id === option.id) {
                    if (LabelUtils.pdValues(option.color) || LabelUtils.pdValues(option.text) || LabelUtils.pdValues(option.background)) {
                        if (LabelUtils.pdValues(option.text)) {
                            entitys[i].description.getValue().text = option.text;
                        } else {
                            option.text = entitys[i].description.getValue().text;
                        }
                        if (LabelUtils.pdValues(option.color)) {
                            entitys[i].description.getValue().color = option.color;
                        } else {
                            option.color = entitys[i].description.getValue().color;
                        }
                        if (LabelUtils.pdValues(option.background)) {
                            entitys[i].description.getValue().background = option.background;
                        } else {
                            option.background = entitys[i].description.getValue().background;
                        }
                        LabelUtils.updateCanvas4(i, option.text, option.color, option.background, function(s) {
                            if (s) {
                                that.viewer.entities._entities._array[s.id].billboard.image.setValue(s.canvas);
                            }
                        });
                    }
                    if (LabelUtils.pdValues(option.height)) {
                        var cartesian = entitys[i].position._value;
                        var ellipsoid = viewer.scene.globe.ellipsoid;
                        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                        var lat = Cesium.Math.toDegrees(cartographic.latitude);
                        var lng = Cesium.Math.toDegrees(cartographic.longitude);
                        cartesian2 = Cesium.Cartesian3.fromDegrees(lng, lat, option.height, ellipsoid);
                        entitys[i].position._value = cartesian2;
                        entitys[i].description.heights = option.height;
                    }
                    if (LabelUtils.pdValues(option.size)) {
                        entitys[i].billboard.scale = option.size;
                    }
                    if (LabelUtils.pdValues(option.isChange)) {
                        entitys[i].billboard.scale = option.isChange;
                    }
                    if (LabelUtils.pdValues(option.panColor)) {
                        option.panColor = LabelUtils.paseRgba(option.panColor, 'GLH');
                        entitys[i].ellipse._material = new ElliposidFadeMaterialProperty(CesiumUtils.getCesiumColor(option.panColor), 4000);
                    }
                    if (LabelUtils.pdValues(option.picture)) {
                        entitys[i].billboard.image.setValue(option.picture);
                    }
                }
            }
        }
    }
};

LablesFactory.prototype.updatetype6 = function(option) {
    var viewer = this.viewer;
    if (LabelUtils.pdValues(option)) {
        if (LabelUtils.pdValues(option.id)) {
            var entity = viewer.entities.getById(option.id);
            if (LabelUtils.pdValues(entity)) {
                if (LabelUtils.pdValues(option.color)) {
                    var text = option.text ? option.text : entity.description.getValue().text;
                    var canvas2 = LabelUtils.updateCanvas6(text, option.color);
                    entity.billboard.image.setValue(canvas2);
                    entity.description.getValue().color = option.color;
                }
                if (LabelUtils.pdValues(option.text)) {
                    var color = option.color ? option.color : entity.description.getValue().color;
                    var canvas = LabelUtils.updateCanvas6(option.text, color);
                    entity.billboard.image.setValue(canvas);
                    entity.description.getValue().text = option.text;
                }
                if (LabelUtils.pdValues(option.height)) {
                    var cartesian = entity.position._value;
                    var cartesian2 = LabelUtils.transCoordinate(viewer, cartesian, option.height);
                    entity.position._value = cartesian2;
                    entity.description.getValue().heights = option.height;
                }
                if (LabelUtils.pdValues(option.size)) {
                    entity.billboard.scale = option.size;
                    entity.description.getValue().size = option.size;
                }
            }
        }
    }
};

LablesFactory.prototype.updatetype7 = function(option) {
    var viewer = this.viewer;
    if (LabelUtils.pdValues(option)) {
        if (LabelUtils.pdValues(option.id)) {
            var entity = viewer.entities.getById(option.id);
            if (LabelUtils.pdValues(entity)) {
                if (LabelUtils.pdValues(option.text)) {
                    var canvas = LabelUtils.updateCanvas7(entity.description.getValue().title, entity.description.getValue().color, option.text);
                    entity.billboard.image.setValue(canvas);
                    entity.description.getValue().text = option.text;
                }
                if (LabelUtils.pdValues(option.color)) {
                    entity.description.getValue().color = option.color;
                    var colorcanvas = LabelUtils.updateCanvas7(entity.description.getValue().title, option.color, entity.description.getValue().text);
                    entity.billboard.image.setValue(colorcanvas);
                }
                if (LabelUtils.pdValues(option.title)) {
                    entity.description.getValue().title = option.title;
                    var titlecanvas = LabelUtils.updateCanvas7(option.title, entity.description.getValue().color, entity.description.getValue().text);
                    entity.billboard.image.setValue(titlecanvas);
                }
                if (LabelUtils.pdValues(option.height)) {
                    var cartesian = entity.position._value;
                    var cartesian2 = LabelUtils.transCoordinate(viewer, cartesian, option.height);
                    entity.position._value = cartesian2;
                    entity.description.getValue().heights = option.height;
                }
                if (LabelUtils.pdValues(option.size)) {
                    entity.billboard.scale = option.size;
                }
            }
        }
    }
};

LablesFactory.prototype.updatetype8 = function(option) {
    var viewer = this.viewer;
    if (LabelUtils.pdValues(option)) {
        if (LabelUtils.pdValues(option.id)) {
            var entity = viewer.entities.getById(option.id);
            if (LabelUtils.pdValues(entity)) {
                if (LabelUtils.pdValues(option.background)) {
                    entity.description.getValue().background = option.background;
                    LabelUtils.updateCanvas8(entity.description.getValue().text, option.background, function(canvas) {
                        if (defined(canvas)) {
                            entity.billboard.image.setValue(canvas);
                        }
                    }, entity.description.getValue().color);
                }
                if (LabelUtils.pdValues(option.text)) {
                    entity.description.getValue().text = option.text;
                    LabelUtils.updateCanvas8(option.text, entity.description.getValue().background, function(canvas) {
                        if (defined(canvas)) {
                            entity.billboard.image.setValue(canvas);
                        }
                    }, entity.description.getValue().color);
                }

                if (LabelUtils.pdValues(option.color)) {
                    entity.description.getValue().color = option.color;
                    LabelUtils.updateCanvas8(entity.description.getValue().text, entity.description.getValue().background, function(canvas) {
                        if (defined(canvas)) {
                            entity.billboard.image.setValue(canvas);
                        }
                    }, option.color);
                }

                if (LabelUtils.pdValues(option.height)) {
                    var cartesian = entity.position._value;
                    var cartesian2 = LabelUtils.transCoordinate(viewer, cartesian, option.height);
                    entity.position._value = cartesian2;
                    entity.description.getValue().heights = option.height;
                }
                if (LabelUtils.pdValues(option.size)) {
                    entity.billboard.scale = option.size;
                }
            }
        }
    }
};

LablesFactory.prototype.updatetype9 = function(option) {
    var viewer = this.viewer;
    if (LabelUtils.pdValues(option)) {
        if (LabelUtils.pdValues(option.id)) {
            var entity = viewer.entities.getById(option.id);
            if (LabelUtils.pdValues(entity)) {
                if (LabelUtils.pdValues(option.title)) {
                    var canvas = LabelUtils.updateCanvas9(option.title, defined(option.text) ? option.text : entity.description.getValue().text, defined(option.color) ? option.color : entity.description.getValue().color);
                    entity.description.getValue().title = option.title;
                    entity.billboard.image.setValue(canvas);
                }
                if (LabelUtils.pdValues(option.text)) {
                    var textcanvas = LabelUtils.updateCanvas9(defined(option.title) ? option.title : entity.description.getValue().title, option.text, defined(option.color) ? option.color : entity.description.getValue().color);
                    entity.description.getValue().title = option.title;
                    entity.billboard.image.setValue(textcanvas);
                }
                if (LabelUtils.pdValues(option.color)) {
                    var colorcanvas = LabelUtils.updateCanvas9(defined(option.title) ? option.title : entity.description.getValue().title, defined(option.text) ? option.text : entity.description.getValue().text, option.color);
                    entity.description.getValue().color = option.color;
                    entity.billboard.image.setValue(colorcanvas);
                }
                if (LabelUtils.pdValues(option.height)) {
                    var cartesian = entity.position._value;
                    var cartesian2 = LabelUtils.transCoordinate(viewer, cartesian, option.height);
                    entity.position._value = cartesian2;
                    entity.description.getValue().heights = option.height;
                }
                if (LabelUtils.pdValues(option.size)) {
                    entity.billboard.scale = option.size;
                }
            }
        }
    }
};


LablesFactory.prototype.updatetype10 = function(option) {
    var viewer = this.viewer;
    var cartesian2;
    debugger
    if (LabelUtils.pdValues(option)) {
        if (LabelUtils.pdValues(option.id)) {
            var entity = viewer.entities.getById(option.id);
            debugger
            var pictureEntity = viewer.entities.getById('picture' + option.id);
            if (LabelUtils.pdValues(entity)) {
                if (LabelUtils.pdValues(option.color) && LabelUtils.pdValues(option.text)) {
                    var colorcanvas = LabelUtils.updateCanvas(option.text, option.color);
                    entity.billboard._image.setValue(colorcanvas);
                }
                if (LabelUtils.pdValues(option.height)) {
                    var cartesian = entity.position._value;
                    cartesian2 = LabelUtils.transCoordinate(viewer, cartesian, option.height);
                    entity.position.setValue(cartesian2);
                    entity.description = { heights: option.height };
                }
                if (LabelUtils.pdValues(option.size)) {
                    entity.billboard.scale = option.size;
                }
                if (LabelUtils.pdValues(option.isChange)) {
                    entity.billboard.scale = option.isChange;
                }
            }
            if (LabelUtils.pdValues(pictureEntity)) {
                if (LabelUtils.pdValues(option.size)) {
                    pictureEntity.billboard.scale = option.size;
                }
                if (LabelUtils.pdValues(option.height)) {
                    pictureEntity.position._value = cartesian2;
                }
                if (LabelUtils.pdValues(option.panColor)) {
                    option.panColor = LabelUtils.paseRgba(option.panColor, 'GLH');
                    pictureEntity.ellipse._material = new ElliposidFadeMaterialProperty(CesiumUtils.getCesiumColor(option.panColor), 4000);
                }
                if (LabelUtils.pdValues(option.background)) {
                    switch (option.background) {
                        case 'background1':
                            option.background = Cesium.buildModuleUrl('Images/videoBorad.png');
                            break;
                        case 'background2':
                            option.background = Cesium.buildModuleUrl('Images/labelbackground1.png');
                            break;
                        case 'background3':
                            option.background = Cesium.buildModuleUrl('Images/labelbackground2.png');
                            break;
                        default:
                            option.background = Cesium.buildModuleUrl('Images/videoBorad.png');
                            break;
                    }
                    pictureEntity.billboard._image.setValue(option.background);
                }
            }
        }
    }
};


LablesFactory.prototype.update = function() {
    var option = this.options;
    if (LabelUtils.pdValues(option)) {
        if (LabelUtils.pdValues(option.type)) {
            switch (option.type) {
                case 'type1':
                    this.updatetype1(option);
                    break;
                case 'type2':
                    this.updatetype2(option);
                    break;
                case 'type3':
                    this.updatetype3(option);
                    break;
                case 'type4':
                    this.updatetype4(option);
                    break;
                case 'type6':
                    this.updatetype6(option);
                    break;
                case 'type7':
                    this.updatetype7(option);
                    break;
                case 'type8':
                    this.updatetype8(option);
                    break;
                case 'type9':
                    this.updatetype9(option);
                    break;
                case 'type10':
                    this.updatetype10(option);
                    break;
            }
        }
    }
};

LablesFactory.prototype.delete = function(id) {
    var that = this;
    var entity1 = this.viewer.entities.getById(id);
    var entity2 = this.viewer.entities.getById('picture' + id);
    this.viewer.entities.remove(entity1);
    this.viewer.entities.remove(entity2);

    //为了删除下面的实体
    var primitivesArr = new Array();
    for (var index = 0; index < that.viewer.scene.primitives.length; index++) {
        var primitive = that.viewer.scene.primitives.get(index);
        primitivesArr.push(primitive);
    }
    primitivesArr.forEach(function(ele) {
        if (defined(ele._instanceIds)) {
            if (ele._instanceIds[0] === id + 'instance1' || ele._instanceIds[0] === id + 'instance2') {
                that.viewer.scene.primitives.remove(ele);
            }
        }
    });
};

export default LablesFactory;
