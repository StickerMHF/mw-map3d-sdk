/*
 * @Author: Caven
 * @Date: 2020-02-12 21:43:33
 * @Last Modified by: Caven
 * @Last Modified time: 2020-05-12 10:44:26
 */

import { DomUtil } from '../utils'
import Layer from './Layer'
import State from '../state/State'
import Transform from '../transform/Transform'

const { Cesium } = DC.Namespace

class HtmlLayer extends Layer {
  constructor(id) {
    super(id)
    this._delegate = DomUtil.create('div', 'html-layer')
    this._delegate.setAttribute('id', this._id)
    this._renderRemoveCallback = undefined
    this.type = Layer.getLayerType('html')
    this._state = State.INITIALIZED
  }

  set show(show) {
    this._show = show
    this._delegate.style.visibility = this._show ? 'visible' : 'hidden'
  }

  get show() {
    return this._show
  }
  /**
   *
   * @param {*} veiwer
   * the layer added handler function
   * subclasses need to be overridden
   */
  _addHandler(viewer) {
    this._viewer = viewer
    if (this._viewer.dcContainer) {
      this._viewer.dcContainer.appendChild(this._delegate)
    } else {
      // 获取Viewer(自定义)
      this._viewer = viewer.getViewers();
      this._viewer.dcDiv = viewer.getMap3D();
      this._viewer.dcDiv._dcContainer.appendChild(this._delegate)
    }
    let scene = this._viewer.scene
    this._renderRemoveCallback = scene.postRender.addEventListener(() => {
      let cameraPosition = this._viewer.camera.positionWC
      this.eachOverlay(item => {
        if (item && item.position) {
          let position = Transform.transformWGS84ToCartesian(item.position)
          let windowCoord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            scene,
            position
          )
          let distance = Cesium.Cartesian3.distance(position, cameraPosition)
          item._updateStyle({ transform: windowCoord }, distance)
        }
      })
    }, this)
    this._state = State.ADDED
  }

  /**
   * the layer removed handler function
   * subclasses need to be overridden
   */
  _removeHandler() {
    this._renderRemoveCallback && this._renderRemoveCallback()
    this._viewer.dcContainer.removeChild(this._delegate)

    // 删除掉已经添加的div(自定义)
    if (this._viewer.dcDiv) {
      this._viewer.dcDiv.removeChild(this._delegate)
    }

    this._state = State.REMOVED
  }

  /**
   *
   */
  clear() {
    let childs = this._delegate.childNodes
    for (let i = childs.length - 1; i >= 0; i--) {
      this._delegate.removeChild(childs[i])
    }
    this._cache = {}
    this._state = State.CLEARED
    return this
  }
}

Layer.registerType('html')

export default HtmlLayer
