/*
 * @Author: your name
 * @Date: 2020-04-02 14:42:34
 * @LastEditTime: 2020-04-23 13:02:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \map3d-designer-sdk\Source\Effect\Label\labeltype3.js
 */

const { Cesium } = DC.Namespace

import CesiumUtils from '../../utils/CesiumUtils';
import LabelUtils from './LabelUtils.js';

import ElliposidFadeMaterialProperty from '../../Material/ElliposidFadeMaterial';

function labeltype3(viewer, options, getCreateID) {
    var id = Cesium.defaultValue(options.id, CesiumUtils.getID(10));
    if (id.indexOf('billboard') >= 0) {
        id = id.substring(9);
    }
    var size = Cesium.defaultValue(options.size, 3);
    var position = Cesium.defaultValue(options.position, [108.933337, 34.26178, 0]);
    var text = Cesium.defaultValue(options.text, '90%');
    var color = Cesium.defaultValue(options.color, 'rgba(94, 170, 241, 1)');
    var panColor = Cesium.defaultValue(options.panColor, 'rgba(94, 170, 241, 1)');
    var isChange = Cesium.defaultValue(options.isChange, true);
    panColor = LabelUtils.paseRgba(panColor, 'GLH');
    getCreateID = Cesium.defaultValue(getCreateID, function() { });

    var canvas = LabelUtils.createHiDPICanvas(100, 500, 2);
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.lineTo(50, 500);
    ctx.lineTo(50, 400);
    ctx.arc(50, 150, 48, 0.5 * Math.PI, 2.5 * Math.PI);
    ctx.stroke();
    ctx.font = '20px console';
    ctx.fillStyle = color;
    ctx.fillText(text, 25, 155);
    ctx.textAlign = 'center';
    var entitys = viewer.entities.add({
        description: { heights: position[2], color: color, text: text },
        name: 'billboard' + id,
        id: 'billboard' + id,
        position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
        billboard: {
            image: canvas,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: size,
            width: 20,
            height: 100,
            sizeInMeters: isChange
        },
        cylinder: {
            length: 400,
            topRadius: 180,
            bottomRadius: 180,
            material: new Cesium.Color(1, 1, 1, 0.01)
        }, ellipse: {
            semiMinorAxis: 50,
            semiMajorAxis: 50,
            height: position[2],
            material: new ElliposidFadeMaterialProperty(CesiumUtils.getCesiumColor(panColor), 4000)
        }
    });
    var st = {
        id: entitys.id,
        position: options.position
    };
    getCreateID(st);
}

export default labeltype3;
