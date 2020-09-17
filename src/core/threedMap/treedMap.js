const { Cesium } = DC.Namespace

// 非官方的js
import BaseImageryLayers from './Layers/BaseImageryLayers.js';
import GeojsonLayers from './Layers/GeojsonLayers.js';
import Tileset3dLayers from './Layers/Tileset3dLayers.js';
import GltfLayers from './Layers/GltfLayers.js';
import CustomWidgets from './Widgets/CustomWidgets.js';
import FlyLineFactory from './Effect/FlyLineFactory.js';
import Upinggrain from './Effect/Upinggrain.js';
import ODLines from './Effect/ODLines.js';
import LablesFactory from './Effect/LablesFactory.js';
import labeltype1 from './Effect/Label/labeltype1.js';
import labeltype2 from './Effect/Label/labeltype2.js';
import labeltype3 from './Effect/Label/labeltype3.js';
import labeltype4 from './Effect/Label/labeltype4.js';
import labeltype6 from './Effect/Label/labeltype6.js';
import labeltype7 from './Effect/Label/labeltype7.js';
import labeltype8 from './Effect/Label/labeltype8.js';
import labeltype9 from './Effect/Label/labeltype9.js';
import labeltype10 from './Effect/Label/labeltype10.js';

import LabelUtils from './Effect/Label/LabelUtils.js';
import Drawing from './Effect/graphicsDrawing/Drawing.js';
import flashingLight from './Effect/globelEffect/flashingLight.js';
import flyAround from './Effect/globelEffect/flyAround.js';
import defined from './utils/defined.js';
// import Tools from './utils/utils.js';
import PostProcessStageLibrary from './other/PostProcessStageLibrary.js';
import Snow from './Special/Snow.js';
import Rain from './Special/Rain.js';

import DomUtil from './utils/DomUtil.js';
import Util from './utils/Util.js';


import {
  LayerEventType
} from './utils/EventType.js'


var defaultOptions = {
    widgets: {
        baseLayerPicker: true, //是否显示
        baselayerList: [{
            type: 'ArcGisMapServerImageryProvider',
            url:  'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
        }]
    },

    baseImageryLayers: [{
        type: 'ArcGisMapServerImageryProvider',
        url:  'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
    }]
    // tiles3DLayers: [{url : styele:}]
};

var myViewer = null;
var layerCache = {};
var myThis = null;

var chartsFun = null;

var DrawObj;
function Map3D(id, options,callback) {
  console.log(id)
  console.log(options)
  console.log(callback)
    // this.options = Tools.extend(true, options, defaultOptions);
    this.options = Cesium.defaultValue(options, defaultOptions);
    this.cesium = {};
    this.callback=defined(callback,function(){});

    //场景变量
    this.stage1 = null;
    this.stage2 = null;
    this.stage3 = null;

    //使用初始化函数
    this.initMap(id);

    callback(this);

    myThis = this
    console.log('myThis', myThis)
}
//初始化底图
Map3D.prototype.initMap = function(id) {

    this.cesium.viewer = new Cesium.Viewer(id, {
        animation: false, //是否显示动画控件
        geocoder: false,
        homeButton: false, //是否显示home
        timeline: false, //是否显示时间线控件
        fullscreenButton: true, //是否全屏显示
        scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        infoBox: false, //是否显示点击要素之后显示的信息
        sceneModePicker: false, //是否显示投影方式控件  三维/二维
        navigationInstructionsInitiallyVisible: false,
        navigationHelpButton: false, //是否显示帮助信息控件
        selectionIndicator: false, //是否显示指示器组件
        terrainShadows: Cesium.ShadowMode.DISABLED,
        baseLayerPicker: false
    });

    myViewer = this.cesium.viewer

    this._dcContainer = DomUtil.create(
      'div',
      'dc-container',
      document.getElementById(id)
    ) //Register the custom container



    this._layerCache = {}
    layerCache = this._layerCache

    // 地图初始化的时候就创建dom元素
    // var myDiv = document.getElementById(id);
    // var htmlDiv = document.createElement('div');
    // htmlDiv.setAttribute("id", "dc-container")
    // htmlDiv.setAttribute("style","display: block;overflow: hidden;");
    // myDiv.appendChild(htmlDiv)
    // console.log('myElement', myDiv)
    // var myLayer = new DC.HtmlLayer('layers')
    // console.log('666666666666666666666666', myLayer)


    this.cesium.viewer.scene.globe.depthTestAgainstTerrain = true;
    //创建右上角的旋转的按钮
    //判断是否展示
    if(defined(this.options.rotate)){
        if(this.options.rotate.show){
            var viewer=this.cesium.viewer;
            var button=document.createElement('span');
            button.style.height='35px';
            button.style.width='35px';
            button.style.zIndex=999;
            button.style.display='inherit';
            var imgs=document.createElement('img');
            imgs.src='http://db.mapwaycloud.com:10082/oss/c881f5ef5de54f689b4bd0bb66af09ac/file/tb_a8d8e174f7bb4b37acc5d53a350c800f.png';
            imgs.style.height='35px';
            imgs.style.width='35px';
            button.appendChild(imgs);
            var cesiumTool=document.getElementsByClassName('cesium-viewer-toolbar');
            cesiumTool[0].appendChild(button);

            button.onclick=function(){
                // eslint-disable-next-line no-new
                new flyAround(viewer,null).start();
            };
        }
    }

    DrawObj = new Drawing(this.cesium.viewer);
    //去掉商业logo
    this.cesium.viewer._cesiumWidget._creditContainer.style.display = 'none';

    //底图设置
    this.cesium.widgets = new CustomWidgets(this.cesium.viewer, this.options.widgets);
    this.cesium.baseImageryLayers = new BaseImageryLayers(this.cesium.viewer, this.options.baseImageryLayers ? this.options.baseImageryLayers : defaultOptions.baseImageryLayers);

    this.cesium.viewer.scene.globe.showGroundAtmosphere = false;

    //提高分辨率
    this.cesium.viewer._cesiumWidget._supportsImageRenderingPixelated = Cesium.FeatureDetection.supportsImageRenderingPixelated();
    this.cesium.viewer._cesiumWidget._forceResize = true;
    if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
        var PixelRatios = window.devicePixelRatio;
        // 适度降低分辨率
        while (PixelRatios >= 2.0) {
            PixelRatios /= 2.0;
        }
        this.cesium.viewer.resolutionScale = PixelRatios;
    }

    //添加gltf2.0的规范,为了添加倾斜摄影的3dtile模型
    var fixGltf = function(gltf) {
        if (!gltf.extensionsUsed) {
            return;
        }
        var v = gltf.extensionsUsed.indexOf('KHR_technique_webgl');
        var t = gltf.extensionsRequired.indexOf('KHR_technique_webgl');
        if (v !== -1) {
            gltf.extensionsRequired.splice(t, 1, 'KHR_techniques_webgl');
            gltf.extensionsUsed.splice(v, 1, 'KHR_techniques_webgl');
            gltf.extensions = gltf.extensions || {};
            gltf.extensions['KHR_techniques_webgl'] = {};
            gltf.extensions['KHR_techniques_webgl'].programs = gltf.programs;
            gltf.extensions['KHR_techniques_webgl'].shaders = gltf.shaders;
            gltf.extensions['KHR_techniques_webgl'].techniques = gltf.techniques;
            var techniques = gltf.extensions['KHR_techniques_webgl'].techniques;
            gltf.materials.forEach(function(mat, index) {
                gltf.materials[index].extensions['KHR_technique_webgl'].values = gltf.materials[index].values;
                gltf.materials[index].extensions['KHR_techniques_webgl'] = gltf.materials[index].extensions['KHR_technique_webgl'];
                var vtxfMaterialExtension = gltf.materials[index].extensions['KHR_techniques_webgl'];
                // eslint-disable-next-line guard-for-in
                for (var value in vtxfMaterialExtension.values) {
                    var us = techniques[vtxfMaterialExtension.technique].uniforms;
                    for (var key in us) {
                        if (us[key] === value) {
                            vtxfMaterialExtension.values[key] = vtxfMaterialExtension.values[value];
                            delete vtxfMaterialExtension.values[value];
                            break;
                        }
                    }
                }
            });
            techniques.forEach(function(t) {
                // eslint-disable-next-line guard-for-in
                for (var attribute in t.attributes) {
                    // eslint-disable-next-line block-scoped-var
                    var name = t.attributes[attribute];
                    // eslint-disable-next-line block-scoped-var
                    t.attributes[attribute] = t.parameters[name];
                }
                // eslint-disable-next-line guard-for-in
                for (var uniform in t.uniforms) {
                    var name1 = t.uniforms[uniform];
                    // eslint-disable-next-line block-scoped-var
                    t.uniforms[uniform] = t.parameters[name1];
                }
            });
        }
    };

    if(!Cesium.Model.prototype.hasOwnProperty('_cachedGltf')){
        Object.defineProperties(Cesium.Model.prototype, {
            _cachedGltf: {
                set: function(value) {
                    this._vtxf_cachedGltf = value;
                    if (this._vtxf_cachedGltf && this._vtxf_cachedGltf._gltf) {
                        fixGltf(this._vtxf_cachedGltf._gltf);
                    }
                },
                get: function() {
                    return this._vtxf_cachedGltf;
                }
            }
        }, {
            writable: false,
            enumerable: true,
            configurable: true
        });
    }
    //恢复功能
    let thats = this
    setTimeout(function () {
      thats.Renew();
      console.log("3333333333333333333",new Date())
     }, 2000);

};

// 自定义一个添加图层的方法
Map3D.prototype.addLayer = function(layer) {
  if (layer && layer.layerEvent) {
    !layerCache[layer.type] && (layerCache[layer.type] = {})
    if (!Object(layerCache[layer.type]).hasOwnProperty(layer.id)) {
      layer.layerEvent.fire(LayerEventType.ADD, this)
      layerCache[layer.type][layer.id] = layer
    }
  }
  return this
};

// 自定义一个返回视图Viewer的方法
Map3D.prototype.getViewers = function() {
    return myViewer
};

// 自定义一个返回视图Map3D的方法
Map3D.prototype.getMap3D = function() {
    return myThis
};

// 自定义一个保存回调函数的方法
Map3D.prototype.saveChartclick = function(funDiv) {
  chartsFun = funDiv
};

// 自定义一个返回点击事件的触发方法
Map3D.prototype.clickDivChart = function(obj, val) {
  if (chartsFun) {
    chartsFun(obj, val)
  }
};

//销毁
Map3D.prototype.destroy = function() {
    this.cesium.viewer.destroy();
};

//自定义实体
Map3D.prototype.drawGraphic = function(options) {
    if (DrawObj) {
        DrawObj.drawGraphic(options);
    }
};

Map3D.prototype.reDrawGraphic = function(options) {
    if (DrawObj) {
        DrawObj.reDrawGraphic(options);
    }
};

Map3D.prototype.selectGraphic = function(callback) {
    if (DrawObj) {
        DrawObj.Select(callback);
    }
};

Map3D.prototype.selectGraphicById = function(id, callback) {
    if (DrawObj) {
        DrawObj.modifyMaterialById(id, callback);
    }
};

Map3D.prototype.modifyMaterial = function(options, callback) {
    if (DrawObj) {
        DrawObj.modifyMaterial(options, callback);
    }
};

Map3D.prototype.deleteGraphic = function(callback) {
    if (DrawObj) {
        DrawObj.deleteGraphic(callback);
    }
};

//添加Gltf
Map3D.prototype.addGltf = function(options) {
    new GltfLayers(this.cesium.viewer, options).add();
};

//删除Gltf
Map3D.prototype.deleteGltf = function(id) {
    new GltfLayers(this.cesium.viewer, this.options).delete(id);
};

//飞向Gltf
Map3D.prototype.flyToGltf = function(id) {
    new GltfLayers(this.cesium.viewer, this.options).fly(id);
};

//隐藏和显示Gltf
Map3D.prototype.showGltf = function(id) {
    new GltfLayers(this.cesium.viewer, this.options).show(id);
};

//3dtile操作
Map3D.prototype.add3dTileset = function(options) {
    new Tileset3dLayers(this.cesium.viewer, options).add();
};

//飞向3dtile
Map3D.prototype.flyTo3dtileset = function(url) {
    new Tileset3dLayers(this.cesium.viewer, this.options).flyTo(url);
};

//删除3dtile
Map3D.prototype.delete3dtileset = function(url) {
    new Tileset3dLayers(this.cesium.viewer, this.options).delete(url);
};

//显示和隐藏3dtiles
Map3D.prototype.show3dtileset = function(url) {
    new Tileset3dLayers(this.cesium.viewer, this.options).show(url);
};

//添加geojson
Map3D.prototype.addGeoJson = function(options) {
    new GeojsonLayers(this.cesium.viewer, options).add();
};

//修改地图色调
Map3D.prototype.updateBaseImageryLayer = function(index, option) {
    this.cesium.baseImageryLayers.updateBaseImageryLayer(index, option);
};

//添加ALL图层
Map3D.prototype.add3dData = function(type, options) {
    switch (type) {
        case 'gltfLayers':
            this.addGltf(options);
            break;
        case 'tiles3DLayers':
            this.add3dTileset(options);
            break;
        case 'geojsonlayers':
            this.addGeoJson(options);
            break;
        default:
            break;
    }
};

//设置飞行射线
Map3D.prototype.createFlyLine = function(isClick) {
    new FlyLineFactory(this.cesium.viewer, isClick, {}).add();
};

//增删改标签
Map3D.prototype.addBillboard = function(isClick, option) {
    new LablesFactory(this.cesium.viewer, option, isClick).add();
};

Map3D.prototype.deleteBillboard = function(ID) {
    new LablesFactory(this.cesium.viewer).delete(ID);
};

Map3D.prototype.updateBillboard = function(option) {
    new LablesFactory(this.cesium.viewer, option).update();
};

//飞向实体
Map3D.prototype.flyToEntity = function(id) {
    var entity = this.cesium.viewer.entities.getById(id);
    if (LabelUtils.pdValues(entity)) {
        var ellipsoid = this.cesium.viewer.scene.globe.ellipsoid;
        var cartographic = ellipsoid.cartesianToCartographic(entity.position._value);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var newcartesian = Cesium.Cartesian3.fromDegrees(lng, lat - 0.007, (LabelUtils.pdValues(entity.description) ? entity.description.getValue().heights : 0) + 700, ellipsoid);
        this.cesium.viewer.camera.flyTo({
            destination: newcartesian,
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-35.0),
                roll: 0.0
            }
        });
    }
};

//全局特效
Map3D.prototype.globalEffects = function(option) {
    if (typeof option.upingGrainOption !== undefined && option.UpinggrainShow) {
        this.UpinggrainShow(true);
    } else if (typeof option.upingGrainOption !== undefined && option.UpinggrainShow === false) {
        this.UpinggrainShow(false);
    }
    if (typeof option.ODlinesShow !== undefined && option.ODlinesShow) {
        this.ODlinesShow(true);
    } else if (typeof option.ODlinesShow !== undefined && option.ODlinesShow === false) {
        this.ODlinesShow(false);
    }
    if (typeof option.snowShow !== undefined && option.snowShow) {
        this.snowShow(true);
    } else if (typeof option.snowShow !== undefined && option.snowShow === false) {
        this.snowShow(false);
    }
    if (typeof option.rainShow !== undefined && option.rainShow) {
        this.rainShow(true);
    } else if (typeof option.rainShow !== undefined && option.rainShow === false) {
        this.rainShow(false);
    }
    if (typeof option.bloomShow !== undefined && option.bloomShow) {
        this.bloomShow(true);
    } else if (typeof option.bloomShow !== undefined && option.bloomShow === false) {
        this.bloomShow(false);
    }
    if (typeof option.skyAtmosphere !== undefined && option.skyAtmosphere) {
        this.skyAtmosphere(true);
    } else if (typeof option.skyAtmosphere !== undefined && option.skyAtmosphere === false) {
        this.skyAtmosphere(false);
    }
    if (typeof option.flashingLight !== undefined && option.flashingLight) {
        this.flashingLight(true);
    } else if (typeof option.flashingLight !== undefined && option.flashingLight === false) {
        this.flashingLight(false);
    }
    // if (typeof option.flyArounds !== undefined && option.flyArounds) {
    //     this.flyArounds(true);
    // } else if (typeof option.flyArounds !== undefined && option.flyArounds === false) {
    //     this.flyArounds(false);
    // }
};

// Map3D.prototype.flyArounds=function(flag,option){
//     if(flag){
//         // eslint-disable-next-line new-cap
//         new flyAround(this.cesium.viewer,option).start();
//     }else{
//         // eslint-disable-next-line new-cap
//         new flyAround(this.cesium.viewer,option).stop();
//     }
// };

//是否开启向上粒子
Map3D.prototype.UpinggrainShow = function(flag) {
    var viewer = this.cesium.viewer;
    if (flag) {
        var upingGrainOption = {
            Points: [
                { 'lon': 108.942337, 'lat': 34.26978 },
                { 'lon': 108.923337, 'lat': 34.26978 },
                { 'lon': 108.962337, 'lat': 34.26978 },
                { 'lon': 108.962337, 'lat': 34.26978 },
                { 'lon': 108.933337, 'lat': 34.26978 },
                { 'lon': 108.944637, 'lat': 34.26978 },
                { 'lon': 108.944637, 'lat': 34.26778 },
                { 'lon': 108.944637, 'lat': 34.26578 },
                { 'lon': 108.944637, 'lat': 34.26378 },
                { 'lon': 108.959937, 'lat': 34.26078 },
                { 'lon': 108.942337, 'lat': 34.25578 },
                { 'lon': 108.924637, 'lat': 34.26778 },
                { 'lon': 108.934637, 'lat': 34.26578 },
                { 'lon': 108.954637, 'lat': 34.26378 },
                { 'lon': 108.969937, 'lat': 34.26078 }
            ],
            color: [0.529, 0.807, 0.980, 1],
            outColor: [0.529, 0.807, 0.980, 0.1],
            timeInterval: 3000
        };
        new Upinggrain(viewer, upingGrainOption).add();
    } else {
        new Upinggrain(viewer, null).delete();
    }

};

//是否开启OD线
Map3D.prototype.ODlinesShow = function(flag) {
    var viewer = this.cesium.viewer;
    if (flag) {
        var ODlineoption = {
            isPlaying: true,
            toPonit: [{ lon: 108.942476, lat: 34.277014 }, { lon: 108.942524, lat: 34.265926 }, { lon: 108.942315, lat: 34.260682 }, { lon: 108.942362, lat: 34.254162 }],
            color: [1, 0, 0, 1],
            outColor: [1, 0.882, 0.678, 0.2],
            timeInterval: 1000,
            height: 0
        };
        new ODLines(viewer, ODlineoption).add();
    } else {
        new ODLines(viewer, null).delete();
    }
};

//是否开始下雪
Map3D.prototype.snowShow = function(flag) {
    var collection = this.cesium.viewer.scene.postProcessStages;
    if (flag) {
        if (this.stage1 === null) {
            var snow = new Cesium.PostProcessStage({
                name: 'czm_snow',
                fragmentShader: Snow
            });
            collection.add(snow);
            var index = collection.length - 1;
            this.stage1 = collection._stages[index];
        }
    } else {
        collection.remove(this.stage1);
        this.stage1 = null;
    }
};

//是否开启下雨
Map3D.prototype.rainShow = function(flag) {
    var collection = this.cesium.viewer.scene.postProcessStages;
    if (flag) {
        if (this.stage2 === null) {
            var rain = new Cesium.PostProcessStage({
                name: 'czm_rain',
                fragmentShader: Rain
            });
            rain = PostProcessStageLibrary.createRainStage();
            collection.add(rain);
            var index = collection.length - 1;
            this.stage2 = collection._stages[index];
        }
    } else {
        collection.remove(this.stage2);
        this.stage2 = null;
    }
};

//环形扫光
Map3D.prototype.flashingLight = function(flag) {
    var collection = this.cesium.viewer.scene.postProcessStages;
    // this.cesium.viewer.scene.globe.depthTestAgainstTerrain = flag;
    if(flag){
        if(this.stage3===null){
            // eslint-disable-next-line new-cap
            var flash = new flashingLight(this.cesium.viewer).create(flag);
            collection.add(flash);
        }
        var index=collection.length-1;
        this.stage3=collection._stages[index];
    }else{
        collection.remove(this.stage3);
        this.stage3=null;
    }
};

//是否开启泛光
Map3D.prototype.bloomShow = function(flag) {
    var bloom = this.cesium.viewer.scene.postProcessStages.bloom;
    if (flag) {
        bloom.enabled = Boolean(true);
        bloom.uniforms.brightness = Number(0.2);
        bloom.uniforms.delta = Number(1);
        bloom.uniforms.sigma = Number(3.78);
        bloom.uniforms.stepSize = Number(5);
        bloom.uniforms.glowOnly = Boolean(false);
        bloom.uniforms.contrast = Number(137);
    } else {
        bloom.enabled = Boolean(false);
    }
};

//显示的天空盒的格式
Map3D.prototype.skyAtmosphere = function(flag) {
    this.cesium.viewer.scene.skyAtmosphere.brightnessShift = (flag ? 0 : -1);
};

//恢复功能
Map3D.prototype.Renew = function() {
    var viewer = this.cesium.viewer;
    var options = this.options;
    if (LabelUtils.pdValues(options)) {
        if (LabelUtils.pdValues(options.gltfLayers)) {
            this.addGltf(options);
        }
        if (LabelUtils.pdValues(options.tiles3DLayers)) {
            this.add3dTileset(options);
        }
        if (LabelUtils.pdValues(options.geojsonLayers)) {
            this.addGeoJson(options);
        }
        if (LabelUtils.pdValues(options.Labels)) {
            if (options.Labels.length !== 0) {
                options.Labels.forEach(function(Label) {
                    if (LabelUtils.pdValues(Label.type)) {
                        switch (Label.type) {
                            case 'type1':
                                new labeltype1(viewer, Label, null);
                                break;
                            case 'type2':
                                new labeltype2(viewer, Label, null);
                                break;
                            case 'type3':
                                new labeltype3(viewer, Label, null);
                                break;
                            case 'type4':
                                new labeltype4(viewer, Label, null);
                                break;
                            case 'type6':
                                new labeltype6(viewer, Label, null);
                                break;
                            case 'type7':
                                new labeltype7(viewer, Label, null);
                                break;
                            case 'type8':
                                new labeltype8(viewer, Label, null);
                                break;
                            case 'type9':
                                new labeltype9(viewer, Label, null);
                                break;
                            case 'type10':
                                new labeltype10(viewer, Label, null);
                                break;
                            default:
                                break;
                        }
                    }

                });
            }
        }
        if (LabelUtils.pdValues(options.globalEffects)) {
            this.globalEffects(options.globalEffects);
        }
        if (LabelUtils.pdValues(options.EntityCollection)) {
            this.reDrawGraphic(options.EntityCollection);
        }
    }
};
export default Map3D;
