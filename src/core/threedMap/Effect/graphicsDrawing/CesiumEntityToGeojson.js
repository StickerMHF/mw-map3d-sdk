const { Cesium } = DC.Namespace


//用于将cesium中的entity转换成符合OGC标准格式的geojson
function CesiumEntityToGeojson() {
}

//处理单个实体
CesiumEntityToGeojson.entityToGeojson = function(entity) {
    var returnGeojson = {};
    switch (entity.type) {
        case 'point':
            returnGeojson = this.featureGeojson('point', entity.position.getValue(0), entity.description.getValue().style, entity.id);
            break;
        case 'polyline':
            returnGeojson = this.featureGeojson('polyline', entity.polyline.positions.getValue(0), entity.description.getValue().style, entity.id);
            break;
        case 'polygon':
            returnGeojson = this.featureGeojson('polygon', entity.polygon.hierarchy.getValue().positions, entity.description.getValue().style, entity.id);
            break;
        case 'circle':
            //圆形多获取一个半径的属性
            returnGeojson = this.featureGeojson('circle', entity.position.getValue(0), entity.description.getValue().style, entity.id, entity.ellipse.semiMinorAxis.getValue());
            break;
        case 'rectangle':
            returnGeojson = this.featureGeojson('rectangle', entity.rectangle.coordinates.getValue(), entity.description.getValue().style, entity.id);
            break;
    }
    return returnGeojson;
};

//处理实体数组
CesiumEntityToGeojson.entityCollectionToGeojson = function(entityCollection) {
    var returnGeojson = {};
    //存放feature的json
    var featureCollection = [];
    entityCollection.forEach(function(entity) {
        featureCollection.push(CesiumEntityToGeojson.entityToGeojson(entity));
    });
    returnGeojson=CesiumEntityToGeojson.allGeojson(featureCollection);
    return returnGeojson;
};

//创建geojson的feature
CesiumEntityToGeojson.featureGeojson = function(type, coordinates, style, id, otherproperties) {
    Cesium.defaultValue(otherproperties, 'null');
    return {
        type: 'Feature',
        geometry: {
            type: type,
            coordinates: coordinates
        },
        properties: {
            style: style,
            otherproperties: otherproperties,
            id: id
        }
    };
};

//创建所有的geojson
CesiumEntityToGeojson.allGeojson = function(featureCollection) {
    return {
        'type': 'FeatureCollection',
        'features': featureCollection
    };
};

export default CesiumEntityToGeojson;
