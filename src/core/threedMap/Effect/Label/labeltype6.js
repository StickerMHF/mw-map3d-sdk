const { Cesium } = DC.Namespace

import Color from '../../utils/Color';
import CesiumUtils from '../../utils/CesiumUtils';
import LabelUtils from './LabelUtils.js';


function labeltype6(viewer, options, getCreateID) {
    var id = Cesium.defaultValue(options.id, CesiumUtils.getID(10));
    if (id.indexOf('billboard') >= 0) {
        id = id.substring(9);
    }
    var text = Cesium.defaultValue(options.text, '请输入:');
    var size = Cesium.defaultValue(options.size, 3);
    var color = Cesium.defaultValue(options.color, 'rgba(94, 170, 241, 1)');
    var position = Cesium.defaultValue(options.position, [108.933337, 34.26178, 200]);
    var isChange = Cesium.defaultValue(options.isChange, true);
    getCreateID = Cesium.defaultValue(getCreateID, function() { });

    var scene = viewer.scene;
    var ellipsoid = viewer.scene.globe.ellipsoid;

    //添加标签6的canvas
    var canvas = LabelUtils.createHiDPICanvas(100, 50, 25);
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 100, 50);
    ctx.strokeStyle = color;
    ctx.font = '6px 微软雅黑';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    var str = text.length;
    var roll = Math.ceil(str / 14) <= 3 ? Math.ceil(str / 14) : 3;
    var rolladd = 1;
    while (rolladd <= roll) {
        ctx.fillText(text.substring((rolladd - 1) * 14, rolladd * 14), 50, 25 + (rolladd - 1) * 7);
        rolladd++;
    }

    //添加billboard
    var entitys = viewer.entities.add({
        description: { heights: position[2], color: color, text: text, size: size },
        id: 'billboard' + id,
        position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
        billboard: {
            image: canvas,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: size,
            width: 50,
            height: 25,
            sizeInMeters: isChange
        },
        cylinder: {
            length: 600 + position[2],
            topRadius: 200,
            bottomRadius: 200,
            material: new Color(1, 1, 1, 0.005),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
    });

    //添加实体1
    var instance = new Cesium.GeometryInstance({
        id: 'billboard' + id + 'instance1',
        geometry: new Cesium.CustomElements(),
        modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(position[0], position[1], position[2]))),
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Color(0.5, 0.8, 1, 0.5))
        }
    });

    //添加实体2
    var instance2 = new Cesium.GeometryInstance({
        id: 'billboard' + id + 'instance2',
        geometry: Cesium.GeometryPipeline.toWireframe(new Cesium.CustomElements()),
        modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(position[0], position[1], position[2]))),
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Color(1.0, 1.0, 0.0, 1))
        }
    });

    //添加实体
    var testPrimitive = new Cesium.Primitive({
        geometryInstances: instance,
        appearance: new Cesium.PerInstanceColorAppearance({
            flat: true,
            fabric: {
                type: 'Wood',
                uniforms: {
                    lightWoodColor: new Color(0.7, 0.4, 0.1, 1.0),
                    darkWoodColor: new Color(0.3, 0.1, 0.0, 1.0),
                    ringFrequency: 4.0,
                    grainFrequency: 18.0
                }
            }
        }),
        asynchronous: false
    });

    //添加实体的边框
    var testPrimitive2 = new Cesium.Primitive({
        geometryInstances: instance2,
        appearance: new Cesium.PerInstanceColorAppearance({
            flat: true
        }),
        asynchronous: false
    });

    scene.primitives.add(testPrimitive);
    scene.primitives.add(testPrimitive2);

    var testPrimitiveRotate = 0;
    scene.postRender.addEventListener(function() {
        testPrimitiveRotate += 2;
        if (testPrimitiveRotate > 360) {
            testPrimitiveRotate = 0;
        }

        //将billboard的position动态给旋转的实体
        var newPosition = LabelUtils.transCoordinate(viewer, entitys.position.getValue(0), entitys.description.getValue(0).heights - 10 >= 50 ? entitys.description.getValue(0).heights - 10 : 50);

        var m = Cesium.Transforms.eastNorthUpToFixedFrame(newPosition);

        Cesium.Matrix4.multiplyByUniformScale(m, (entitys.description.getValue(0).size * 1.0 / 3.0) || 1.0, m);
        //RotateX为旋转角度，转为弧度再参与运算
        var m1 = Cesium.Matrix3.fromRotationZ(Cesium.Maths.toRadians(testPrimitiveRotate));

        //矩阵计算m
        Cesium.Matrix4.multiplyByMatrix3(m, m1, m);

        //赋值
        testPrimitive.modelMatrix = m;
        testPrimitive2.modelMatrix = m;
    });

    var st = {
        id: entitys.id,
        position: position
    };
    getCreateID(st);
}

export default labeltype6;
