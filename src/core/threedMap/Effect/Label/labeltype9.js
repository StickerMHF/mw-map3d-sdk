const { Cesium } = DC.Namespace

import CesiumUtils from '../../utils/CesiumUtils';
import LabelUtils from './LabelUtils.js';


function labeltype9(viewer, options, getCreateID) {
    var id = Cesium.defaultValue(options.id, CesiumUtils.getID(10));
    if (id.indexOf('billboard') >= 0) {
        id = id.substring(9);
    }
    var title=Cesium.defaultValue(options.title,'智慧城市');
    var text = Cesium.defaultValue(options.text, '请输入:');
    var size = Cesium.defaultValue(options.size, 5);
    var color = Cesium.defaultValue(options.color, 'rgba(94, 170, 241, 1)');
    var position = Cesium.defaultValue(options.position, [108.933337, 34.26178, 0]);
    var isChange = Cesium.defaultValue(options.isChange, true);
    getCreateID = Cesium.defaultValue(getCreateID, function() {});

    var labelDiv = document.createElement('div');
    labelDiv.style.width = '300px';
    labelDiv.style.height = '200px';
    labelDiv.style.position = 'absolute';
    labelDiv.style.pointerEvents = 'none';
    var labelCanvas = LabelUtils.createHiDPICanvas(300, 200, 2);
    labelDiv.appendChild(labelCanvas);
    var ctx = labelCanvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.lineTo(0, 200);
    ctx.lineTo(100, 100);
    ctx.lineTo(220, 100);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = '20px console';
    // ctx.fillStyle = 'rgb(0,191,255)';
    ctx.fillText(title, 110, 90);

    ctx.font = '12px console';
    // ctx.fillStyle='rgb(192,192,192)';
    ctx.fillText(text,110,130);

    var entitys = viewer.entities.add({
        description: { heights: position[2], size: size ,color:color,title:title,text:text},
        name: 'billboard' + id,
        id: 'billboard' + id,
        position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
        billboard: {
            image: labelCanvas,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: size,
            width: 75,
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
export default labeltype9;
