import React, {useEffect} from 'react';
import {Button} from 'antd';

let amap;
const mapCss = {
    position: 'absolute',
    width: '100%',
    height: '100%',
};
const GisMap = (props) => {

    const {
        mapLoaded,
        mapStyle,
        options
    } = props;
    useEffect( () => {
        const { AMap, AMapUI } = window;

        amap = new AMap.Map('amap-container', {
            center: [114.29658, 22.626985],
            resizeEnable: true,
            zoom: 11,
            zooms: [3,20],
            expandZoomRange: true,
            mapStyle: 'amap://styles/94a1fd0fa5541f225c5f471270efccf3',
            ...options
        });

        // 地图加载完成
        amap.on('complete',function () {
            window.map = amap;
            if(mapLoaded){
                mapLoaded();
            }
        })

        // 组件卸载事件
        return () => {
            delete window.map;
        }

    },[]);

    return (
        <div>
            <div id={'amap-container'} style={mapStyle ? {...mapStyle} : {...mapCss}}/>
        </div>
    )

}

export default GisMap;
