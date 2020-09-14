const { Cesium } = DC.Namespace


function flyAround(viewer, option) {
    var defaultOption = {
        sts: [108.942337, 34.260978, 15.8],
        speed: 5
    };
    this.viewer = viewer;
    this.option = Cesium.defaultValue(option, defaultOption);
}

flyAround.prototype.start = function() {
    var viewer = this.viewer;
    var rectangle = viewer.camera.computeViewRectangle();
    var west = rectangle.west / Math.PI * 180;
    var north = rectangle.north / Math.PI * 180;
    var east = rectangle.east / Math.PI * 180;
    var south = rectangle.south / Math.PI * 180;
    var centerx = (west + east) / 2;
    var cnetery = (north + south) / 2;

    var position = Cesium.Cartesian3.fromDegrees(centerx, cnetery, this.option.sts[3]);
    // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
    var pitch = Cesium.Math.toRadians(-30);
    // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
    var angle = -this.option.speed;
    // var angle = - 360 / 80;
    // 给定相机距离点多少距离飞行，这里取值为5000m
    var distance = viewer.camera.positionCartographic.height;
    var startTime = Cesium.JulianDate.fromDate(new Date());
    viewer.clock.startTime = startTime.clone();  // 开始时间
    viewer.clock.currentTime = startTime.clone(); // 当前时间
    viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
    // 相机的当前heading
    var initialHeading = viewer.camera.heading;
    var Exection = function TimeExecution() {
        // 当前已经过去的时间，单位s
        var delTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
        var heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
        viewer.scene.camera.setView({
            destination: position, // 点的坐标
            orientation: {
                heading: heading,
                pitch: pitch
            }
        });
        viewer.scene.camera.moveBackward(distance);
        if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
            viewer.clock.onTick.removeEventListener(Exection);
        }
    };

    //鼠标左键的点击事件时
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(click) {
        viewer.clock.onTick.removeEventListener(Exection);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction(function(wheelment) {
        viewer.clock.onTick.removeEventListener(Exection);
    }, Cesium.ScreenSpaceEventType.WHEEL);

    if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
        viewer.clock.onTick.removeEventListener(Exection);
    }
    viewer.clock.onTick.addEventListener(Exection);
};

flyAround.prototype.stop = function() {

};

export default flyAround;
