import {drawMarker, drawPolyline, getMarkerLocation, isPointOnLine} from "./mapUtil";

/**
 * 实现点的拖拽效果
 */

export const getDragMarker = (roads, callback, startPosition, endPosition) => {

    const {map, AMap} = window;
    let path = roads;
    let startMarker, endMarker, polyline, heightLine, startIndex = 0, endIndex = path.length, startPoint, endPoint;
    polyline = drawPolyline({path: roads}, {
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
    bindStartDrag(startMarker, heightLine);
    startMarker.on('dragend', function (e) {

        let flag = isPointOnLine(startMarker, polyline);
        if (flag) {
            startPoint = AMap.GeometryUtil.closestOnLine(startMarker.getPosition(), polyline.getPath());
            startIndex = calculatePosition(startPoint, polyline.getPath());
            drawStartPolyline(startIndex, endIndex, startPoint, endPoint, heightLine, startMarker, endMarker, path, callback);
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
    bindStartDrag(endMarker, heightLine);
    endMarker.on('dragend', function (e) {

        let flag = isPointOnLine(endMarker, polyline);
        if (flag) {
            endPoint = AMap.GeometryUtil.closestOnLine(endMarker.getPosition(), polyline.getPath());
            endIndex = calculatePosition(endPoint, polyline.getPath());
            drawEndPolyline(startIndex, endIndex, startPoint, endPoint, heightLine, startMarker, endMarker, path, callback);
        }
    })
}

/**
 * 开始拖拽事件
 */
const bindStartDrag = (marker, heightLine) => {

    // 开始拖拽时隐藏绘制的矢量线
    marker.on('dragstart', function () {
        heightLine.setOptions({
            strokeOpacity: 0
        })
    })
}

/**
 * 起点绘制结束
 * @param startIndex
 * @param endIndex
 * @param startPoint
 * @param endPoint
 * @param heightLine
 * @param startMarker
 * @param endMarker
 * @param path
 * @param callback
 * @returns {Promise<void>}
 */
const drawStartPolyline = async (startIndex, endIndex, startPoint, endPoint, heightLine, startMarker, endMarker, path, callback) => {

    const {AMap} = window;
    let result = [],obj = {};
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
        result.reverse();
    }
    heightLine.setPath(result);
    heightLine.setOptions({
        strokeOpacity: 1
    })
    // 获取两点之间的距离
    let distance = AMap.GeometryUtil.distance(startPoint, endPoint = endMarker.getPosition());
    obj['distance'] = Number.parseFloat(distance.toFixed(2));
    // 解析两点之间的位置关系
    await getMarkerLocation(startMarker).then(resolve => {
        console.log('startLocation', resolve);
        const address = resolve.result.regeocode.formattedAddress;
        let index = address && address.indexOf('街道');
        obj['startLocation'] = address && address.slice(index + 2);
    });
    await getMarkerLocation(endMarker).then(resolve => {
        console.log('endLocation', resolve);
        const address = resolve.result.regeocode.formattedAddress;
        let index = address && address.indexOf('街道');
        obj['endLocation'] = address && address.slice(index + 2);
    });

    obj['lnglat'] = result;
    console.log('result', obj);
    callback(obj);
}

/**
 * 终点绘制结束
 * @param startIndex
 * @param endIndex
 * @param startPoint
 * @param endPoint
 * @param heightLine
 * @param path
 * @param callback
 */
const drawEndPolyline = async (startIndex, endIndex, startPoint, endPoint, heightLine, startMarker, endMarker, path, callback) => {

    let result = [], obj = {};
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
        result.reverse();
    }
    heightLine.setPath(result);
    heightLine.setOptions({
        strokeOpacity: 1
    })

    // 获取两点之间的距离
    let distance = AMap.GeometryUtil.distance(startPoint = startMarker.getPosition(), endPoint);
    obj['distance'] = Number.parseFloat(distance.toFixed(2));
    // 解析两点之间的位置关系
    await getMarkerLocation(startMarker).then(resolve => {
        console.log('startLocation', resolve);
        const address = resolve.result.regeocode.formattedAddress;
        let index = address && address.indexOf('街道');
        obj['startLocation'] = address && address.slice(index + 2);
    });
    await getMarkerLocation(endMarker).then(resolve => {
        console.log('endLocation', resolve);
        const address = resolve.result.regeocode.formattedAddress;
        let index = address && address.indexOf('街道');
        obj['endLocation'] = address && address.slice(index + 2);
    });
    obj['lnglat'] = result;
    callback(obj);
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
