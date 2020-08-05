/*
 * @Author: gex
 * @Date: 2020-04-13 14:07:20
 * @LastEditTime: 2020-04-22 09:17:46
 * @LastEditors: Please set LastEditors
 * @Description: camera uploading to the entity
 * @FilePath: \map3d-designer-sdk\Source\Effect\Label\labeltype5.js
 */

const { Cesium } = DC.Namespace

import CesiumUtils from '../../utils/CesiumUtils';
import LabelUtils from './LabelUtils.js';

function labeltype5(viewer, options, getCreateID) {
    var id = Cesium.defaultValue(options.id, CesiumUtils.getID(10));
    if (id.indexOf('billboard') >= 0) {
        id = id.substring(9);
    }
    var text = Cesium.defaultValue(options.text, '请输入:');
    var height = Cesium.defaultValue(options.height, 150);
    var size = Cesium.defaultValue(options.size, 5);
    var color = Cesium.defaultValue(options.color, 'rgba(94, 170, 241, 1)');
    var panColor = Cesium.defaultValue(options.panColor, 'rgba(94, 170, 241, 1)');
    panColor = LabelUtils.paseRgba(panColor, 'GLH');
    var position = Cesium.defaultValue(options.position, [108.933337, 34.26178, 200]);
    var isChange = Cesium.defaultValue(options.isChange, true);
    getCreateID = Cesium.defaultValue(getCreateID, function() { });

    var canvas = LabelUtils.createHiDPICanvas(500, 500, 25);

    var ctx = canvas.getContext('2d');
    //动画事件
    var events = null;
    //动画速度
    var speed = 0;
    //动画的起始值
    var startPoint = 0;
    //动画倒退初始值
    var endPoint = 1000;
    //鼠标是否点击
    var mouseClick = true;

    lingXing();
    //注册鼠标事件
    canvas.addEventListener('mousedown', mouseDown, false);

    function addAnimation() {
        events = window.requestAnimationFrame(addAnimation);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lingXing();
        startPoint += speed;
        speed += 0.3;
        if (startPoint >= 110 && startPoint < 500) {
            addTile(startPoint);
        } else if (startPoint >= 500 && startPoint < 1000) {
            addTile(500);
            addContext(startPoint);
        } else if (startPoint > 1000) {
            window.cancelAnimationFrame(events);
            addTile(500);
            addContext(1000);
            startPoint = 0;
            speed = 0;
        }
    }

    //菱形
    function lingXing() {
        ctx.beginPath();
        ctx.moveTo(50, 0);
        ctx.lineTo(0, 50);
        ctx.lineTo(50, 100);
        ctx.lineTo(100, 50);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = '#5F9EA0';
        ctx.fill();
    }

    //标题栏
    function addTile(startPoint) {
        ctx.beginPath();
        ctx.moveTo(60, 0);
        ctx.lineTo(110, 50);
        ctx.lineTo(60, 100);
        ctx.lineTo(startPoint, 100);
        ctx.lineTo(startPoint, 0);
        ctx.closePath();
        ctx.stroke();
        var grd = ctx.createLinearGradient(65, 105, 225, 0);
        grd.addColorStop(0, '#191970');
        grd.addColorStop(0.5, '#4169E1');
        grd.addColorStop(1, '#87CEFA');
        ctx.fillStyle = grd;
        ctx.fill();
    }

    //正文
    function addContext(startPoint) {
        ctx.beginPath();
        ctx.fillStyle = '#5F9EA0';
        ctx.fillRect(50, 110, 450, (startPoint - 600) > 0 ? (startPoint - 600) : 0);
        ctx.stroke();
        ctx.fill();
    }

    function addAnimation2() {
        events = window.requestAnimationFrame(addAnimation2);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lingXing();
        endPoint -= speed;
        speed += 0.4;
        console.log(endPoint);
        if (endPoint >= 110 && endPoint < 500) {
            addTile(endPoint);
        } else if (endPoint >= 500 && endPoint < 1000) {
            addTile(500);
            addContext(endPoint);
        } else if (endPoint <= 0) {
            window.cancelAnimationFrame(events);
            endPoint = 1000;
            speed = 0;
        }
    }

    function mouseDown() {
        //获取鼠标在canvas上的坐标
        var x = event.pageX;
        var y = event.pageY;
        var bbox = canvas.getBoundingClientRect();
        x = (x - bbox.left) * (canvas.width / bbox.width);
        y = (y - bbox.top) * (canvas.height / bbox.height);

        //判断是否在菱形的范围内
        if (x > 0 && x < 100 && y > 0 && y < 100) {
            if (mouseClick) {
                addAnimation();
                mouseClick = !mouseClick;
            } else {
                addAnimation2();
                mouseClick = !mouseClick;
            }
        }
    }

    var entitys = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
        name: 'picturebillboard' + id,
        id: 'picturebillboard' + id,
        billboard: {
            image: canvas,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: size,
            width: 100,
            height: 50,
            sizeInMeters: isChange
        }
    });

    var st = {
        id: entitys.id,
        position: position
    };
    getCreateID(st);
}
export default labeltype5;
