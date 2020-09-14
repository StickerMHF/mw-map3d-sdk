const { Cesium } = DC.Namespace

/**
 * A widget for displaying information or a description.
 *
 * @alias CustomInfoBoxStyle
 * @constructor
 *
 * @param {Element|String} container The DOM element or ID that will contain the widget.
 *
 * @exception {DeveloperError} Element with id "container" does not exist in the document.
 */
var defaultOptions = {
    baseLayerPicker: false,//是否显示
    baselayerList: []

}
function CustomBaseLayerPicker(viewer, options) {
    this.options = Cesium.defaultValue(options, defaultOptions);
    console.log('this.options', this.options)
    this.viewer = viewer;
    if (this.options.baseLayerPicker) {
        this.createBaseLayerPicker();
    }
}

Object.defineProperties(CustomBaseLayerPicker.prototype, {

});
CustomBaseLayerPicker.prototype.createBaseLayerPicker = function() {
    var imageryProviderViewModels = this._createImageryProviderModels();
    var baseLayerPicker = new Cesium.BaseLayerPicker(this.viewer._toolbar, {
        globe: this.viewer.scene.globe,
        imageryProviderViewModels: imageryProviderViewModels,
        selectedImageryProviderViewModel: this.options.selectedImageryProviderViewModel,
        terrainProviderViewModels: [],
        selectedTerrainProviderViewModel: this.options.selectedTerrainProviderViewModel
    });


    this.viewer._baseLayerPicker = baseLayerPicker;
    this.options.baseLayerPicker = true;
};
CustomBaseLayerPicker.prototype._createImageryProviderModels = function() {
    var that = this;
    // this.viewer.baseLayerPicker.viewModel.imageryProviderViewModels.removeAll();
    var imageryProviderViewModels = [];
    this.options.baselayerList.forEach(function(layer) {
        imageryProviderViewModels.push(that._createImageryProviderModel(layer));
    });
    return imageryProviderViewModels;
};
CustomBaseLayerPicker.prototype._createImageryProviderModel = function(layer) {
    var imageryProvider = null;
    switch (layer.type) {
        case "ArcGisMapServerImageryProvider":
            imageryProvider = new Cesium.ArcGisMapServerImageryProvider(layer);
            break;
        case "UrlTemplateImageryProvider":
            imageryProvider = new Cesium.UrlTemplateImageryProvider(layer);
            break;
        default:
            break;
    }
    if (imageryProvider) {
        return new Cesium.ProviderViewModel({
            name: layer.name,
            tooltip: layer.desc | '',
            iconUrl: Cesium.buildModuleUrl('Images/ImageryProviders/mapboxSatellite.png'),
            category: '默认',
            creationFunction: function() {
                return imageryProvider;
            }
        });
    }

};
CustomBaseLayerPicker.prototype.createBaseLayerList = function() {
    var that = this;
    this.viewer.baseLayerPicker.viewModel.imageryProviderViewModels.removeAll();
    this.options.baselayerList.forEach(function(layer) {
        that.viewer.baseLayerPicker.viewModel.imageryProviderViewModels.push(that._createImageryProviderModel(layer));
    });
};
CustomBaseLayerPicker.prototype.updateBaseLayers = function() {
    return this.options;
};
CustomBaseLayerPicker.prototype.addBaseLayer = function(layerOpts) {
    this.viewer.baseLayerPicker.viewModel.imageryProviderViewModels.push(this._createImageryProviderModel(layerOpts));
};
CustomBaseLayerPicker.prototype.getOptions = function() {
    return this.options;
};
CustomBaseLayerPicker.prototype.switch = function() {
    if (this.options.baseLayerPicker) {
        this.unDestroyed();
    } else {
        this.destroyed();
    }
};
CustomBaseLayerPicker.prototype.destroy = function() {
    if (this.viewer.baseLayerPicker) {
        this.viewer.baseLayerPicker.destroy();
        this.viewer._baseLayerPicker = null;
        this.options.baseLayerPicker = false;
    }
};
CustomBaseLayerPicker.prototype.openWidget = function() {
    if (!this.viewer.baseLayerPicker) {
        this.createBaseLayerPicker();
        // var baseLayerPicker;
        // var that = this;
        // this.viewer.baseLayerPicker.viewModel.imageryProviderViewModels.removeAll();
        // this.options.baselayerList.forEach(function(layer) {
        //     that.viewer.baseLayerPicker.viewModel.imageryProviderViewModels.push(that._createImageryProviderModel(layer));
        // });
        // this.viewer._baseLayerPicker = baseLayerPicker;
        // this.options.baseLayerPicker = true;
    }
};
export default CustomBaseLayerPicker;
