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
      let divIcon = new DC.DivIcon(
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


    // viewer.addLayer(layer)


    // var myPosition = new DC.Position(position[0], position[1], position[2])
    // // var myPosition = null
    // var divIcon = new DC.DivIcon(myPosition, '<div style="width: 400px;background-color: red;">哈哈哈哈哈哈哈</div>')
    // layer.addOverlay(divIcon)
    // // viewer.imageryLayers.addImageryProvider(layer)
    // var conDiv = document.getElementById('dc-container');
    // var layersDiv = myLayer._delegate;
    // conDiv.appendChild(layersDiv);
    // console.log('99999999999988888888888888', myLayer)
    // console.log('99999999999988888888888888viewer', viewer)

	// 创建图表信息
	// var url =
	//         "http://db.mapwaycloud.com:10082/rest/v1/newdip/platform/charts/673/preview?uid=c881f5ef5de54f689b4bd0bb66af09ac";

	//       var options = {
	//         url,
	//         theme: "aipage",
	//         filter: {
	//           name: "name2004", //筛选字段名称
	//           type: "String", //筛选字段属性
	//           param: {
	//             calc: 0, //固定
	//             type: "exact", //固定
	//             value: ["西安市"], //筛选字段值
	//             targetKeys: [1] //固定
	//           },
	//           aliasname: "NAME2004" //字段别名
	//         }
	//       };
	// var chart = Mapway.DIP.chart.chartBuilder("#abc", options);

    //设置背景图片
    // var backgroundPicture;
    // switch (background) {
    //     case 'background1':
    //         // backgroundPicture = Cesium.buildModuleUrl('Images/videoBorad.png');
    //         backgroundPicture = '';
    //         break;
    //     case 'background2':
    //         // backgroundPicture = Cesium.buildModuleUrl('Images/labelbackground1.png');
    //         backgroundPicture = '';
    //         break;
    //     case 'background3':
    //         // backgroundPicture = Cesium.buildModuleUrl('Images/labelbackground2.png');
    //         backgroundPicture = '';
    //         break;
    //     default:
    //         // backgroundPicture = Cesium.buildModuleUrl('Images/videoBorad.png');
    //         backgroundPicture = '';
    //         break;
    // }
    // var canvas = LabelUtils.createHiDPICanvas(100, 50, 25);
    // var ctx = canvas.getContext('2d');
    // ctx.clearRect(0, 0, 100, 50);
    // ctx.textAlign = 'center';
    // ctx.strokeStyle = color;
    // ctx.font = '6px 微软雅黑';
    // ctx.fillStyle = color;
    // var str = text.length;
    // var roll = Math.ceil(str / 14) <= 3 ? Math.ceil(str / 14) : 3;
    // var rolladd = 1;
    // while (rolladd <= roll) {
    //     ctx.fillText(text.substring((rolladd - 1) * 14, rolladd * 14), 50, 25 + (rolladd - 1) * 7);
    //     rolladd++;
    // }

    // viewer.entities.add({
    //     position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
    //     name: 'picturebillboard' + id,
    //     id: 'picturebillboard' + id,
    //     billboard: {
    //         image: backgroundPicture,
    //         horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    //         verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    //         scale: size,
    //         width: 100,
    //         height: 50,
    //         sizeInMeters: isChange
    //     },
    //     ellipse: {
    //         semiMinorAxis: 150,
    //         semiMajorAxis: 150,
    //         height: position[2] - 100,
    //         material: new ElliposidFadeMaterialProperty(CesiumUtils.getCesiumColor(panColor), 4000)
    //     }
    // });

    // var entitys = viewer.entities.add({
    //     position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
    //     name: 'billboard' + id,
    //     id: 'billboard' + id,
    //     description: { heights: position[2], color: color, text: text },
    //     billboard: {
    //         image: canvas,
    //         horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    //         verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    //         scale: size,
    //         width: 100,
    //         height: 50,
    //         sizeInMeters: isChange
    //     },
    //     cylinder: {
    //         length: 1000 + position[2],
    //         topRadius: 200,
    //         bottomRadius: 200,
    //         material: new Cesium.Color(1, 1, 1, 0.01)
    //     }
    // });
    var st = {
        id: id,
        position: position,
    };
    getCreateID(st);
}





export default labeltype10;
