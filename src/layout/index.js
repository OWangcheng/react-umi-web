import React from 'react';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import Index from '../pages/index'
import style from './index.less';

const BasicLayout = (props) => {

    return (
        <Layout>
            <Sider width={256} style={{ minHeight: '100vh', color: 'white' }}>
                Sider
            </Sider>
            <Layout >
                <Header style={{ background: '#fff', position: 'relative' }}>
                    <div>
                        <ul className={style.nav}>
                            <li className={style['list-item']}>
                                <a href={'#'}>天猫</a>
                            </li>
                            <li className={style['list-item']}>
                                <a href={'#'}>聚划算</a>
                            </li>
                            <li className={style['list-item']}>
                                <a href={'#'}>天猫超市</a>
                            </li>
                        </ul>
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 'calc(100vh - 88px)' }}>
                        <Index/>
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}


export default BasicLayout;