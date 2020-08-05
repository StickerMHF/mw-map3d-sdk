const { Cesium } = DC.Namespace

import Color from '../../utils/Color';
import CesiumUtils from '../../utils/CesiumUtils';
import LabelUtils from './LabelUtils.js';
import defined from '../../utils/defined.js';


function labeltype7(viewer, options, getCreateID) {
    var id = Cesium.defaultValue(options.id, CesiumUtils.getID(10));
    if (id.indexOf('billboard') >= 0) {
        id = id.substring(9);
    }
    var size = Cesium.defaultValue(options.size, 3);
    var position = Cesium.defaultValue(options.position, [108.96108235316069, 34.1431136009656, 30]);
    var isChange = Cesium.defaultValue(options.isChange, true);
    var color = Cesium.defaultValue(options.color, 'rgb(255,255,0)');
    var title = Cesium.defaultValue(options.title, '请输入');
    getCreateID = Cesium.defaultValue(getCreateID, function() { });

    var labelDiv = document.createElement('div');
    labelDiv.style.width = '150px';
    labelDiv.style.height = '220px';
    labelDiv.style.position = 'absolute';
    labelDiv.style.pointerEvents = 'none';
    var labelCanvas = LabelUtils.createHiDPICanvas(150, 220, 2);
    labelDiv.appendChild(labelCanvas);
    var ctx = labelCanvas.getContext('2d');

    ctx.font = '22px console';
    ctx.fillStyle = color;
    ctx.fillText(title, 0, 30);
    ctx.font = '16px console';

    if (defined(options.text)) {
        for (var index = 0; index < options.text.length; index++) {
            var ele = options.text[index];
            var titlecolor = ele.titlecolor;
            var texttitle = ele.texttitle;
            var textcolor = ele.textcolor;
            var text = ele.text;
            ctx.fillStyle = titlecolor;
            ctx.fillText(texttitle, (index % 2 === 0) ? 0 : 90, (Math.ceil((index + 1) / 2) === 0 ? 1 : Math.ceil((index + 1) / 2)) * 60);
            ctx.fillStyle = textcolor;
            ctx.fillText(text, (index % 2 === 0) ? 0 : 90, (Math.ceil((index + 1) / 2) === 0 ? 1 : Math.ceil((index + 1) / 2)) * 60 + 20);
            ctx.fillStyle = titlecolor;
        }
    }

    // ctx.fillStyle = 'rgb(255,255,255)';
    // ctx.fillText("容积率", 0, 60);
    // ctx.fillStyle = 'rgb(255,255,0)';
    // ctx.fillText("0.0", 0, 80);

    // ctx.fillStyle = 'rgb(255,255,255)';
    // ctx.fillText("住宅楼", 90, 60);
    // ctx.fillStyle = 'rgb(255,255,0)';
    // ctx.fillText("0栋", 90, 80);

    // ctx.fillStyle = 'rgb(255,255,255)';
    // ctx.fillText("总户数", 0, 120);
    // ctx.fillStyle = 'rgb(0,255,255)';
    // ctx.fillText("0户", 0, 140);

    // ctx.fillStyle = 'rgb(255,255,255)';
    // ctx.fillText("入住率", 90, 120);
    // ctx.fillStyle = 'rgb(0,255,255)';
    // ctx.fillText("0%", 90, 140);

    // ctx.fillStyle = 'rgb(255,255,255)';
    // ctx.fillText("居住人口", 0, 180);
    // ctx.fillStyle = 'rgb(0,255,255)';
    // ctx.fillText("0人", 0, 200);

    //options.text
    //存放内容的数组
    //格式[{},{},{},{}]

    var entitys = viewer.entities.add({
        description: { heights: position[2], text: defined(options.text) ? options.text : {}, size: size, title: title },
        name: 'billboard' + id,
        id: 'billboard' + id,
        position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
        billboard: {
            image: labelCanvas,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: size,
            width: 50,
            height: 75,
            sizeInMeters: isChange
        },
        cylinder: {
            length: 400,
            topRadius: 180,
            bottomRadius: 180,
            material: new Color(1, 1, 1, 0.01)
        }
    });

    var st = {
        id: entitys.id,
        position: position
    };
    getCreateID(st);
}
export default labeltype7;
