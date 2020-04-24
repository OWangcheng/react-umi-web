import { Message } from 'antd';

/**
 * 绘制轨迹线
 * @param data
 * @param option
 * @returns {AMap.Polyline}
 */
export function drawPolyline(data,option={}) {
    const { map, AMap } = window;
    let polyline = new AMap.Polyline({
        path: data.path,
        strokeColor: "#3366FF",
        strokeOpacity: 1,
        strokeWeight: 4,
        lineJoin: 'round',
        lineCap: 'round',
        zIndex: 100,
        ...option
    })
    polyline.setMap(map)
    // 缩放地图到合适的视野级别
    map.setFitView([ polyline ])

    return polyline;
}

export function drawMarker(point,option={}) {
    const { map, AMap } = window;
    let marker = new AMap.Marker({
        icon: new AMap.Icon({
            image: point.imageUrl,
            size: [point.imageWidth || 30, point.imageHeight || 30],
            imageSize: [point.imageWidth || 30, point.imageHeight || 30]
        }),
        position: point.position,
        offset: new AMap.Pixel(-15, -30),
        ...option
    });
    marker.setMap(map)

    return marker;
}

/**
 * 判断点是否在线上
 */
export const isPointOnLine = (marker, polyline) => {
    const {map, AMap} = window;
    // 判断点是否在线上
    let pos = marker.getPosition();
    // mp = getResolution() 获取指定位置的地图分辨率，单位：米/像素
    let mp = map.getResolution();
    // m 为Polyline宽度的米数
    let m = 6 * mp;
    // 判断 marker 是否在线段上，最后一个参数为 m米 的误差
    let inLine = AMap.GeometryUtil.isPointOnLine(pos, polyline.getPath(), m);

    if (!inLine) {
        Message.error('点不在轨迹上！')
    }

    return inLine;

}
/**
 * 取出起终点之间原始数据
 */
export const calculatePosition = (position, path) => {
    const {map, AMap} = window;
    let obj = {};
    for (let i = 0; i < path.length; i++) {
        let d1 = AMap.GeometryUtil.distance(position, path[i]);
        let d2 = AMap.GeometryUtil.distance(position, path[i + 1]);
        if (d1 < d2) {
            return i;
        }
    }
}

/**
 * 获取点的位置信息
 */
export const getMarkerLocation = async (maker) => {
    const {map, AMap} = window;
    let geocoder = new AMap.Geocoder({});
    return new Promise(resolve => {
        geocoder.getAddress(maker.getPosition(),(status,result) => resolve({status,result}));
    })
    /*await geocoder.getAddress(maker.getPosition(), (status,result) => {
        let index = result.regeocode.formattedAddress.indexOf('街道');
        result.regeocode.formattedAddress.slice(index + 2);
        console.log('location',result.regeocode.formattedAddress.slice(index + 2));
    })*/
}


