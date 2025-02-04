/*
 * @Author: Caven
 * @Date: 2020-01-09 09:10:37
 * @Last Modified by: Caven
 * @Last Modified time: 2020-06-25 08:59:51
 */

import { Util } from '../../utils'
import { center, area } from '../../math'
import Transform from '../../transform/Transform'
import Parse from '../../parse/Parse'
import State from '../../state/State'
import Overlay from '../Overlay'

const { Cesium } = DC.Namespace

class Polygon extends Overlay {
  constructor(positions) {
    super()
    this._delegate = new Cesium.Entity({ polygon: {} })
    this._positions = Parse.parsePositions(positions)
    this._holes = []
    this.type = Overlay.getOverlayType('polygon')
    this._state = State.INITIALIZED
  }

  set positions(positions) {
    this._positions = Parse.parsePositions(positions)
    this._delegate.polygon.hierarchy = this._prepareHierarchy()
    return this
  }

  get positions() {
    return this._positions
  }

  set holes(holes) {
    if (holes && holes.length) {
      this._holes = holes.map(item => Parse.parsePositions(item))
      this._delegate.polygon.hierarchy = this._prepareHierarchy()
    }
    return this
  }

  get holes() {
    return this._holes
  }

  get center() {
    return center(this._positions)
  }

  get area() {
    return area(this._positions)
  }

  /**
   *
   */
  _prepareHierarchy() {
    let result = new Cesium.PolygonHierarchy()
    result.positions = Transform.transformWGS84ArrayToCartesianArray(
      this._positions
    )
    result.holes = this._holes.map(
      item =>
        new Cesium.PolygonHierarchy(
          Transform.transformWGS84ArrayToCartesianArray(item)
        )
    )
    return result
  }

  _mountedHook() {
    /**
     *  initialize the Overlay parameter
     */
    this.positions = this._positions
  }

  /**
   *
   * @param {*} text
   * @param {*} textStyle
   */
  setLabel(text, textStyle) {
    this._delegate.position = Transform.transformWGS84ToCartesian(this.center)
    this._delegate.label = {
      text: text,
      ...textStyle
    }
    return this
  }

  /**
   *
   * @param {*} style
   */
  setStyle(style) {
    if (!style || Object.keys(style).length === 0) {
      return this
    }
    delete style['positions']
    this._style = style
    Util.merge(this._delegate.polygon, this._style)
    return this
  }

  /**
   *
   * @param {*} entity
   */
  static fromEntity(entity) {
    let polygon = undefined
    let now = Cesium.JulianDate.now()
    if (entity.polygon) {
      let positions = T.transformCartesianArrayToWGS84Array(
        item.polygon.hierarchy.getValue(now).positions
      )
      polygon = new Polygon(positions)
      polygon.attr = {
        ...entity.properties.getValue(now)
      }
    }
    return polygon
  }
}

Overlay.registerType('polygon')

export default Polygon
