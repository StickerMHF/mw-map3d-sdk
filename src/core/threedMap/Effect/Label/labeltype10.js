const { Cesium } = DC.Namespace

import CesiumUtils from '../../utils/CesiumUtils';
import LabelUtils from './LabelUtils.js';

import ElliposidFadeMaterialProperty from '../../Material/ElliposidFadeMaterial';

import Map3D from '../../treedMap.js';



//标签一构造函数
function labeltype10(viewer, options, getCreateID) {
    var id = Cesium.defaultValue(options.id, CesiumUtils.getID(10));
    if (id.indexOf('billboard') >= 0) {
        id = id.substring(9);
    }
    var text = Cesium.defaultValue(options.text, '');
    var height = Cesium.defaultValue(options.height, 150);
    var size = Cesium.defaultValue(options.size, 5);
    var color = Cesium.defaultValue(options.color, 'rgba(94, 170, 241, 1)');
    var panColor = Cesium.defaultValue(options.panColor, 'rgba(94, 170, 241, 1)');
    panColor = LabelUtils.paseRgba(panColor, 'GLH');
    var background = Cesium.defaultValue(options.background, 'background1');
    var position = Cesium.defaultValue(options.position, [108.933337, 34.26178, 200]);
    var isChange = Cesium.defaultValue(options.isChange, true);
    getCreateID = Cesium.defaultValue(getCreateID, function() {});

    // 用dc的方法试一试
    let mylayer = new DC.HtmlLayer(id)
    var list = []
    // for (var i = 0; i < 5; i++) {
    //   var lng = 120.38105869 + Math.random() * 0.5
    //   var lat = 31.10115627 + Math.random() * 0.5
      list.push(new DC.Position(position[0], position[1], position[2]))
    // }

    list.forEach((item, index) => {
      let divIcon = new DC.DivBillboard(
        item,
        `<div style="width:100%;position: absolute; top: 0px; left: 0px;line-height: 200px;background-color: rgba(13, 29, 62, 0.7);box-shadow: rgba(33, 132, 216, 0.41) 0px 0px 18px inset;color: #fff;text-align: center;">暂无图表数据</div>`
      )
      mylayer.addOverlay(divIcon)
    })
    console.log(this)
    console.log(Map3D)
    Map3D.prototype.addLayer(mylayer)
    console.log(mylayer)


    // 将方法写在sdk里面
    let divDom = document.getElementById(id)
    divDom.children[0].style = "width:200px;height: 200px;position: absolute; top: 0px; left: 0px;border: 1px solid #2184d5;background-color: rgba(13, 29, 62, 0.7);box-shadow: rgba(33, 132, 216, 0.41) 0px 0px 18px inset;";
    let createId = divDom.children[0].id
    // 给layer添加点击事件(自定义)
    document.getElementById(createId).addEventListener("click", function(){
         Map3D.prototype.clickDivChart(this, createId)
    });
    // divIcon.overlayEvent.on(DC.MouseEventType.CLICK, function(e, ee) {
    //   console.log(e, ee)
    // })


    var st = {
        id: id,
        position: position,
    };
    getCreateID(st);
}





export default labeltype10;
