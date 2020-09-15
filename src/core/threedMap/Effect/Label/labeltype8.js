const { Cesium } = DC.Namespace

import CesiumUtils from '../../utils/CesiumUtils';
import LabelUtils from './LabelUtils.js';


function labeltype8(viewer, options, getCreateID) {
    var id = Cesium.defaultValue(options.id, CesiumUtils.getID(10));
    if (id.indexOf('billboard') >= 0) {
        id = id.substring(9);
    }

    var text = Cesium.defaultValue(options.text, '请输入:');
    var size = Cesium.defaultValue(options.size, 3);
    var position = Cesium.defaultValue(options.position, [108.96108235316069, 34.1431136009656, 0]);
    var isChange = Cesium.defaultValue(options.isChange, true);
    getCreateID = Cesium.defaultValue(getCreateID, function() { });
    var background = Cesium.defaultValue(options.background, 'icon1');
    var color=Cesium.defaultValue(options.color,'rgb(255,255,255)');
    var imgUrl;
    switch (background) {
        case 'icon1':
            imgUrl = Cesium.buildModuleUrl('Images/PublicIcon/1.png');
            break;
        case 'icon2':
            imgUrl = Cesium.buildModuleUrl('Images/PublicIcon/2.png');
            break;
        case 'icon3':
            imgUrl = Cesium.buildModuleUrl('Images/PublicIcon/3.png');
            break;
        case 'icon4':
            imgUrl = Cesium.buildModuleUrl('Images/PublicIcon/4.png');
            break;
        case 'icon5':
            imgUrl = Cesium.buildModuleUrl('Images/PublicIcon/5.png');
            break;
        case 'icon6':
            imgUrl = Cesium.buildModuleUrl('Images/PublicIcon/6.png');
            break;
        default:
            imgUrl = Cesium.buildModuleUrl('Images/PublicIcon/1.png');
            break;
    }
    var imgs = new Image();
    imgs.src = imgUrl;
    imgs.onload = function() {
        var canvas = LabelUtils.createHiDPICanvas(100, 50, 2);
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 100, 50);
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(text, 20, 40);
        ctx.drawImage(this, 0, 0, 50, 25);
        var entitys = viewer.entities.add({
            description: { heights: position[2], size: size, text: text, background: background ,color:color},
            name: 'billboard' + id,
            id: 'billboard' + id,
            position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
            billboard: {
                image: canvas,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: size,
                width: 50,
                height: 50,
                sizeInMeters: isChange
            },
            cylinder: {
                length: 400,
                topRadius: 180,
                bottomRadius: 180,
                material: new Cesium.Color(1, 1, 1, 0.01)
            }
        });
        var st = {
            id: entitys.id,
            position: position
        };
        getCreateID(st);
    };
}

export default labeltype8;
