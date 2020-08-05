const { Cesium } = DC.Namespace

function flashingLightFun() {
}

flashingLightFun.u_scanCenterEC = function(viewer, _Cartesian4Center, _scratchCartesian4Center) {
    return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
};

flashingLightFun.u_scanPlaneNormalEC = function(viewer, _Cartesian4Center, _scratchCartesian4Center, _Cartesian4Center1, _scratchCartesian4Center1, _scratchCartesian3Normal) {
    var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
    var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
    _scratchCartesian3Normal.x = temp1.x - temp.x;
    _scratchCartesian3Normal.y = temp1.y - temp.y;
    _scratchCartesian3Normal.z = temp1.z - temp.z;

    Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
    return _scratchCartesian3Normal;
};

flashingLightFun.u_radius = function(radius, _time, duration) {
    return radius * (((new Date()).getTime() - _time) % duration) / duration;
};
export default flashingLightFun;
