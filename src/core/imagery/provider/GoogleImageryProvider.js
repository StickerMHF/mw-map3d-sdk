/*
 * @Author: Caven
 * @Date: 2020-01-21 16:06:14
 * @Last Modified by: Caven
 * @Last Modified time: 2020-06-18 19:44:22
 */

import ImageryType from '../ImageryType'

const { Cesium } = DC.Namespace

const ELEC_URL =
  'http://mt{s}.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile'

const IMG_URL =
  'http://mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'

const TER_URL =
  'http://mt{s}.google.cn/vt/lyrs=t@131,r@227000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galile'

class GoogleImageryProvider extends Cesium.UrlTemplateImageryProvider {
  constructor(options = {}) {
    options['url'] =
      options.style === 'img'
        ? IMG_URL
        : options.style === 'ter'
        ? TER_URL
        : ELEC_URL
    if (!options.subdomains || !options.subdomains.length) {
      options['subdomains'] = ['1', '2', '3']
    }
    super(options)
  }
}

ImageryType.GOOGLE = 'google'

export default GoogleImageryProvider
