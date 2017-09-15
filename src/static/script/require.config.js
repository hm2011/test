requirejs.config({
    // baseUrl 配置在 view/_unit/base.pug 模板中
    waitSeconds: 30,
    paths: {
        // 注意：以下js文件路径没有遵循requirejs路径配置规定，其中包含了“.js”扩展名（requirejs规定不能带扩展名），目的是为了保证hash替换时不产生错误

        //plugins
        'css': 'plugin/css/css.js',
        'text': 'plugin/text/text.js',

        //lib
        'jquery': '//static.fuwo.com/common/jquery/1.12.4/jquery.min',
        'jquery.lazyload': '//static.fuwo.com/common/jquery.lazyload/1.9.7/jquery.lazyload.min',
        'swiper': '//static.fuwo.com/common/swiper/3.4.2/swiper.jquery.umd.min',
        'jquery.superslide': 'module/public/jquery.superslide.js',

        //template engine
        'mustache': '//static.fuwo.com/common/mustache/2.3.0/mustache.min'
    },
    shim: {
        'jquery.lazyload': ['jquery'],
        'jquery.superslide': ['jquery']
    }
});
