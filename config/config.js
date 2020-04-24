export default {
    plugins: [
        ['umi-plugin-react', {
            antd: true
        }],
    ],
    routes: [
        {
            path: '/',
            component: '../layout',
        },
        {
            path: '/amap',
            component: './amap/GisMap'
        },
        {
            path: '/test',
            component: './demo/index'
        }
    ],
}
