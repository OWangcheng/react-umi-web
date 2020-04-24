import GisMap from "../amap/GisMap";
import React, {useEffect} from "react";
import {drawMarker, drawPolyline, isPointOnLine, getMarkerLocation} from "../amap/util/mapUtil";
import {roadPath} from "../data";
import {Button, Message} from 'antd';
import MarkerDrag from "../component/MakerDrag";
import {dragData, getDragMarker} from "../amap/util/mapComponent";

let marker;


let polyline, heightLine;
const mapLoaded = () => {
    const {map, AMap} = window;

    polyline = drawPolyline({path: roadPath}, {
        strokeWeight: 6
    })

    heightLine = drawPolyline({}, {
        strokeWeight: 6,
        strokeColor: '#109618'
    })
}
let startMarker,
    endMarker,
    startIndex = 0,
    endIndex = roadPath.length,
    startPoint,
    endPoint;
const handelStart = () => {
    /*polyline.setOptions({
        strokeOpacity: 0.2
    });*/
    startMarker = drawMarker({
        imageUrl: require('@/asset/images/startPoint.png'),
        position: roadPath[0]
    }, {
        draggable: true,
        cursor: 'move',
        raiseOnDrag: true
    });

    startMarker.on('dragend', function (e) {

        let flag = dragEvent(startMarker, polyline);
        if (flag) {
            startPoint = AMap.GeometryUtil.closestOnLine(startMarker.getPosition(), polyline.getPath());
            startIndex = calculatePosition(startPoint, polyline.getPath());
            drawStartPolyline(roadPath);
        }
    })

    startMarker.on('dragstart', function () {
        heightLine.setOptions({
            strokeOpacity: 0
        })
    })

    endMarker = drawMarker({
        imageUrl: require('@/asset/images/endPoint.png'),
        position: roadPath[roadPath.length - 1]
    }, {
        draggable: true,
        cursor: 'move',
        raiseOnDrag: true
    });

    endMarker.on('dragstart', function () {
        heightLine.setOptions({
            strokeOpacity: 0
        })
    })
    endMarker.on('dragend', function (e) {
        let flag = dragEvent(endMarker, polyline);
        if (flag) {
            endPoint = AMap.GeometryUtil.closestOnLine(endMarker.getPosition(), polyline.getPath());
            endIndex = calculatePosition(endPoint, polyline.getPath());
            drawEndPolyline(roadPath);
        }

    })


};

/**
 * 点标记拖拽结束事件
 */
const dragEvent = (marker, polyline) => {
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
    dragData['distance'] = AMap.GeometryUtil.distance(startPoint, endPoint = endMarker.getPosition());
    // 解析两点之间的位置关系
    getMarkerLocation(startMarker, (status, result) => {
        dragData['startLocation'] = result;
    })
    getMarkerLocation(endMarker, (status, result) => {
        dragData['endLocation'] = result;
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

    return result;
}


/**
 * 热力图
 */
/*const mapLoaded = () => {
    const {map, AMap} = window;
    let heatmap;
    let points =[
        {"lng":116.191031,"lat":39.988585,"count":10},
        {"lng":116.389275,"lat":39.925818,"count":11},
        {"lng":116.287444,"lat":39.810742,"count":12},
        {"lng":116.481707,"lat":39.940089,"count":13},
        {"lng":116.410588,"lat":39.880172,"count":14},
        {"lng":116.394816,"lat":39.91181,"count":15},
        {"lng":116.416002,"lat":39.952917,"count":16}
    ];
    map.plugin(["AMap.Heatmap"],function() {      //加载热力图插件
        heatmap = new AMap.Heatmap({map:map});    //在地图对象叠加热力图
        heatmap.setDataSet({data:points,max:100}); //设置热力图数据集
    });
}*/

const handleBack = (param) => {
    console.log('dragEnd', param);
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

const drawDragMarker = (path) => {
    getDragMarker(path);
}

const getDragResult = () => {
    console.log(dragData);
}


const MapTest = () => {
    return (
        <div>
            <Button onClick={() => drawDragMarker(roadPath)}>绘制拖拽图标</Button>
            <Button onClick={getDragResult}>结果</Button>
            <GisMap/>
        </div>
    )
}

export default MapTest;
