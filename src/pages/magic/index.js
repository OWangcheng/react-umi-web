import React, {useEffect, useState} from 'react';
import style from './index.less'

const Index = props => {
    const {} = props;

    useEffect(() => {

    }, []);

    return (
        <div className={style['box']}>
            <div className={style['one']}>A</div>
            <div className={style['two']}>B</div>
            <div className={style['three']}>C</div>
            <div className={style['four']}>D</div>
            <div className={style['five']}>E</div>
            <div className={style['six']}>F</div>
        </div>
    );
};

export default Index;