const { Cesium } = DC.Namespace

import CustomBaseLayerPicker from './CustomBaseLayerPicker.js';

var defaultOptions = []
function CustomWidgets(viewer, options) {
    this.options = Cesium.defaultValue(options, defaultOptions);
    this.viewer = viewer;
    this.baseLayerPicker = new CustomBaseLayerPicker(this.viewer, this.options);
}
CustomWidgets.prototype.openWidget = function(type) {
    var that = this;
    switch (type) {
        case 'BaseLayerPicker':
            this.baseLayerPicker.openWidget();
            break
        default:
            break
    }
};
CustomWidgets.prototype.closeWidget = function(type) {
    var that = this;
    switch (type) {
        case 'BaseLayerPicker':
            that.baseLayerPicker.destroy();
            break
        default:
            break
    }
};
CustomWidgets.prototype.updateWidget = function(type, option) {
    var that = this;
    switch (type) {
        case 'BaseLayerPicker':
            // that.baseLayerPicker.updateBaseLayers();
            break
        default:
            break
    }
};
CustomWidgets.prototype.updateWidgets = function(options) {
    // return this.options;
};
CustomWidgets.prototype.getOptions = function() {
    return this.options;
};
export default CustomWidgets;
