/*
 * @Author: your name
 * @Date: 2020-04-08 19:16:10
 * @LastEditTime: 2020-04-23 13:02:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \map3d-designer-sdk\Source\Effect\Label\labeltype4.js
 */
const { Cesium } = DC.Namespace

import CesiumUtils from '../../utils/CesiumUtils';
import LabelUtils from './LabelUtils.js';
import defined from '../../utils/defined.js';
import ElliposidFadeMaterialProperty from '../../Material/ElliposidFadeMaterial';

function labeltype4(viewer, options, getCreateID) {
    var id = Cesium.defaultValue(options.id, CesiumUtils.getID(10));
    if (id.indexOf('billboard') >= 0) {
        id = id.substring(9);
    }
    var text = Cesium.defaultValue(options.text, '请输入:');
    var height = Cesium.defaultValue(options.height, 150);
    var size = Cesium.defaultValue(options.size, 3);
    var color = Cesium.defaultValue(options.color, 'rgba(94, 170, 241, 1)');
    var panColor = Cesium.defaultValue(options.panColor, 'rgba(94, 170, 241, 1)');
    panColor = LabelUtils.paseRgba(panColor, 'GLH');
    var background = Cesium.defaultValue(options.background, 'background1');
    var position = Cesium.defaultValue(options.position, [108.933337, 34.26178, 200]);
    var isChange = Cesium.defaultValue(options.isChange, true);
    var picture = options.picture;
    getCreateID = Cesium.defaultValue(getCreateID, function() { });

    //设置背景图片
    var backgroundPicture;
    switch (background) {
        case 'background1':
            backgroundPicture = Cesium.buildModuleUrl('Images/videoBorad.png');
            break;
        case 'background2':
            backgroundPicture = Cesium.buildModuleUrl('Images/labelbackground1.png');
            break;
        case 'background3':
            backgroundPicture = Cesium.buildModuleUrl('Images/labelbackground2.png');
            break;
        case 'null':
            backgroundPicture = null;
            break;
        default:
            backgroundPicture = Cesium.buildModuleUrl('Images/videoBorad.png');
            break;
    }

    if (defined(backgroundPicture)) {
        var imgs = new Image();
        imgs.src = backgroundPicture;
        imgs.onload = function() {
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
            ctx.drawImage(imgs, 0, 0, 100, 50);

            var entitys = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
                id: 'billboard' + id,
                description: { heights: position[2], color: color, text: text, background: background },
                billboard: {
                    image: picture || canvas,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    scale: size,
                    width: 100,
                    height: 50,
                    sizeInMeters: isChange
                },
                ellipse: {
                    semiMinorAxis: 50,
                    semiMajorAxis: 50,
                    height: position[2] - 50,
                    material: new ElliposidFadeMaterialProperty(CesiumUtils.getCesiumColor(panColor), 4000)
                }
            });
            var st = {
                id: entitys.id,
                position: position
            };
            getCreateID(st);
        };
    } else {
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

        var entitys = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
            id: 'billboard' + id,
            description: { heights: position[2], color: color, text: text, background: background },
            billboard: {
                image: canvas,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: size,
                width: 100,
                height: 50,
                sizeInMeters: isChange
            },
            ellipse: {
                semiMinorAxis: 50,
                semiMajorAxis: 50,
                height: position[2] - 50,
                material: new ElliposidFadeMaterialProperty(CesiumUtils.getCesiumColor(panColor), 4000)
            }
        });
        var st = {
            id: entitys.id,
            position: position
        };
        getCreateID(st);
    }

	console.log("555555555555",canvas)
}
export default labeltype4;
