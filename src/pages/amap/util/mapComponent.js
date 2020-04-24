import {drawMarker, drawPolyline, getMarkerLocation, isPointOnLine} from "./mapUtil";

/**
 * 实现点的拖拽效果
 */
let startMarker, endMarker, polyline, heightLine, startIndex = 0, endIndex = 0, startPoint, endPoint;
export let dragData={};
export const getDragMarker = (path,startPosition,endPosition) => {

    const {map, AMap} = window;
    endIndex = path.length;
    polyline = drawPolyline({path: path}, {
        strokeWeight: 6
    });
    heightLine = drawPolyline({}, {
        strokeWeight: 6,
        strokeColor: '#109618'
    });

    // 起点坐标
    startMarker = drawMarker({
        imageUrl: require('@/asset/images/startPoint.png'),
        position: startPosition ? startPosition : path[0]
    }, {
        draggable: true,
        cursor: 'move',
        raiseOnDrag: true
    });
    bindStartDrag(startMarker);
    startMarker.on('dragend', function (e) {

        let flag = isPointOnLine(startMarker, polyline);
        if (flag) {
            startPoint = AMap.GeometryUtil.closestOnLine(startMarker.getPosition(), polyline.getPath());
            startIndex = calculatePosition(startPoint, polyline.getPath());
            drawStartPolyline(path);
        }
    })

    // 终点坐标
    endMarker = drawMarker({
        imageUrl: require('@/asset/images/endPoint.png'),
        position: endPosition ? endPosition : path[path.length - 1]
    }, {
        draggable: true,
        cursor: 'move',
        raiseOnDrag: true
    });
    bindStartDrag(endMarker);
    endMarker.on('dragend', function (e) {

        let flag = isPointOnLine(endMarker, polyline);
        if (flag) {
            endPoint = AMap.GeometryUtil.closestOnLine(endMarker.getPosition(), polyline.getPath());
            endIndex = calculatePosition(endPoint, polyline.getPath());
            drawEndPolyline(path);
        }
    })
}

/**
 * 开始拖拽事件
 */
const bindStartDrag = (marker) => {

    // 开始拖拽时隐藏绘制的矢量线
    marker.on('dragstart', function () {
        heightLine.setOptions({
            strokeOpacity: 0
        })
    })
}

/**
 * 起点绘制结束
 */
const drawStartPolyline = (path) => {

    const {AMap} = window;
    let result = [], obj = {};
    if (startIndex < endIndex) {
        let arr = path.slice(startIndex + 1, endIndex);
        result.push(startPoint);
        result.push(...arr)
        endPoint && result.push(endPoint);
    } else {
        let arr = path.slice(endIndex + 1, startIndex);
        endPoint && result.push(endPoint);
        result.push(...arr);
        result.push(startPoint);
    }
    heightLine.setPath(result);
    heightLine.setOptions({
        strokeOpacity: 1
    })
    // 获取两点之间的距离
    let distance = AMap.GeometryUtil.distance(startPoint, endPoint = endMarker.getPosition());
    dragData['distance'] = Number.parseFloat(distance.toFixed(2));
    // 解析两点之间的位置关系
    getMarkerLocation(startMarker, (status, result) => {
        let index = result.regeocode.formattedAddress.indexOf('街道');
        dragData['startLocation'] = result.regeocode.formattedAddress.slice(index+2);
    })
    getMarkerLocation(endMarker, (status, result) => {
        let index = result.regeocode.formattedAddress.indexOf('街道');
        dragData['endLocation'] = result.regeocode.formattedAddress.slice(index+2);
    })
    dragData['lnglat'] = result;
}

/**
 * 终点绘制结束
 * @param point
 * @param path
 */
const drawEndPolyline = (path) => {

    let result = [];
    if (startIndex < endIndex) {
        startPoint && result.push(startPoint);
        let arr = path.slice(startIndex + 1, endIndex);
        result.push(...arr)
        result.push(endPoint);

    } else {
        let arr = path.slice(endIndex + 1, startIndex);
        result.push(endPoint);
        result.push(...arr);
        startPoint && result.push(startPoint);

    }
    heightLine.setPath(result);
    heightLine.setOptions({
        strokeOpacity: 1
    })

    // 获取两点之间的距离
    let distance = AMap.GeometryUtil.distance(startPoint = startMarker.getPosition(), endPoint);
    dragData['distance'] = Number.parseFloat(distance.toFixed(2));
    // 解析两点之间的位置关系
    getMarkerLocation(startMarker, (status, result) => {
        let index = result.regeocode.formattedAddress.indexOf('街道');
        dragData['startLocation'] = result.regeocode.formattedAddress.slice(index+2);
    })
    getMarkerLocation(endMarker, (status, result) => {
        let index = result.regeocode.formattedAddress.indexOf('街道');
        dragData['endLocation'] = result.regeocode.formattedAddress.slice(index+2);
    })
    dragData['lnglat'] = result;
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
