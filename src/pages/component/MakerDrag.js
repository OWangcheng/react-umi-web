import React, {useEffect} from "react";
import GisMap from "../amap/GisMap";
import {calculatePosition, drawMarker, drawPolyline, getMarkerLocation, isPointOnLine} from "../amap/util/mapUtil";
import {roadPath} from "../data";

let startMarker, endMarker, polyline, heightLine, startIndex = 0, endIndex = 0, startPoint, endPoint;

/**
 * 高德地图实现两点拖拽效果
 * @param props
 * @returns {*}
 * @constructor
 */
const MarkerDrag = (props) => {

    const {
        handleDataCallback,
        startPosition,
        path,
        mapStyle,
        options
    } = props;


    useEffect(() => {

    }, []);

    /**
     * 绘制初始化的起点、终点和矢量线
     */
    const mapLoaded = () => {
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
            position: path[0]
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
            position: path[path.length - 1]
        }, {
            draggable: true,
            cursor: 'move',
            raiseOnDrag: true
        });
        bindStartDrag(endMarker);

    };


    /**
     * 起点绘制结束
     */
    const drawStartPolyline = async (path) => {

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
        obj['distance'] = AMap.GeometryUtil.distance(startPoint, endPoint = endMarker.getPosition());
        // 解析两点之间的位置关系
        await getMarkerLocation(startMarker,  (status, result) => {
            obj['startLocation'] = result;
        })
        await getMarkerLocation(endMarker,  (status, result) => {
            obj['endLocation'] = result;
        })
        obj['lnglat'] = result;
        handleDataCallback(obj);
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


    return (
        <div>
            <GisMap mapLoaded={mapLoaded}/>
        </div>
    )

};

export default MarkerDrag;
