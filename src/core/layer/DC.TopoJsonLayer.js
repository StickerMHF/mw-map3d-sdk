/*
 * @Author: Caven
 * @Date: 2020-03-22 01:12:39
 * @Last Modified by: Caven
 * @Last Modified time: 2020-03-29 13:19:44
 */
import Cesium from '@/namespace'
import Layer from './Layer'

DC.TopoJsonLayer = class extends Layer {
  constructor(id, url, options = {}) {
    if (!url) {
      throw new Error('the url invalid')
    }
    super(id)
    this._delegate = Cesium.GeoJsonDataSource.load(url, options)
    this._state = DC.LayerState.INITIALIZED
    this.type = DC.LayerType.TOPOJSON
  }

  set show(show) {
    this._show = show
    this._delegate &&
      this._delegate.then(dataSource => {
        dataSource.show = this._show
      })
  }

  get show() {
    return this._show
  }

  _createBillboard(entity) {
    if (entity.position && entity.billboard) {
      return DC.Billboard.fromEntity(entity)
    }
  }

  _createPolyline(entity) {
    if (entity.polyline) {
      return DC.Polyline.fromEntity(entity)
    }
  }

  _createPolygon(entity) {
    if (entity.polygon) {
      return DC.Polygon.fromEntity(entity)
    }
  }

  /**
   *
   * @param {*} method
   * @param {*} context
   *
   */
  eachOverlay(method, context) {
    if (this._delegate) {
      this._delegate.then(dataSource => {
        let entities = dataSource.entities.values
        entities.forEach(item => {
          method.call(context, item)
        })
      })
      return this
    }
  }

  toVectorLayer() {
    let layer = new DC.VectorLayer(this._id)
    let self = this
    this.eachOverlay(item => {
      if (item.billboard) {
        layer.addOverlay(self._createBillboard(item))
      } else if (item.polyline) {
        layer.addOverlay(self._createPolyline(item))
      } else if (item.polygon) {
        layer.addOverlay(self._createPolygon(item))
      }
    })
    return layer
  }
}

DC.LayerType.TOPOJSON = 'topojson'