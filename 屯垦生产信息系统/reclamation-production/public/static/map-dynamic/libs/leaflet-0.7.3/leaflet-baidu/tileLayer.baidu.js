window.config = {
    imgUrl: 'http://192.168.150.42:9000/local/baidu/', // 图片查看地址
    imgUrl: 'http://192.168.150.42:8080/', // 图片查看地址
    fileUrl: 'http://192.168.150.42:8080/', // 文件地址
};
L.CRS.Baidu = new L.Proj.CRS('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=1440 +y_0=255 +datum=WGS84 +units=m +no_defs', {
    resolutions: function () {
        level = 19
        var res = [];
        res[0] = Math.pow(2, 18);
        for (var i = 1; i < level; i++) {
            res[i] = Math.pow(2, (18 - i))
        }
        return res;
    }(),
    origin: [0, 0],
    bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
});

L.tileLayer.baidu = function (option) {
    option = option || {};

    var layer;
    var subdomains = '0123456789';
    switch (option.layer) {
        case "vec":
        default:
            layer = L.tileLayer('http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'ph' : 'pl') + '&scaler=1&p=1', {
                name: option.name, subdomains: subdomains, tms: true
            });
            // layer = L.tileLayer(window.config.imgUrl + 'white-offline-map-tiles/baidumaps/satellite/{z}/{x}/{y}.jpg', {
            //     name: option.name,
            //     subdomains: subdomains,
            //     tms: true
            // });
            break;
        case "img_d":
            layer = L.tileLayer('http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46', {
                name: option.name, subdomains: subdomains, tms: true
            });
            // layer = L.tileLayer(window.config.imgUrl + 'white-offline-map-tiles/baidumaps/satellite/{z}/{x}/{y}.jpg', {
            //     name: option.name,
            //     subdomains: subdomains,
            //     tms: true,
            // })
            break;
        case "img_z":
            layer = L.tileLayer('http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'sh' : 'sl') + '&v=020', {
                name: option.name, subdomains: subdomains, tms: true
            });
            // layer = L.tileLayer(window.config.imgUrl + 'white-offline-map-tiles/baidumaps/overlay/{z}/{x}/{y}.png', {
            //     name: option.name,
            //     subdomains: subdomains,
            //     tms: true
            // });
            break;

        case "custom":
            option.customid = option.customid || 'midnight';
            layer = L.tileLayer('http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=' + option.customid, {
                name: option.name, subdomains: "012", tms: true
            });
            // layer = L.tileLayer('http://192.168.150.23:8099/bd-offline-map-tiles/{z}/{x}/{y}.png', {
            //     name: option.name,
            //     subdomains: "012",
            //     tms: true
            // });
            break;

        case "time":
            var time = new Date().getTime();
            layer = L.tileLayer('http://its.map.baidu.com:8002/traffic/TrafficTileService?x={x}&y={y}&level={z}&time=' + time + '&label=web2D&v=017', {
                name: option.name,
                subdomains: subdomains,
                tms: true
            });
            break;
        case "img":
            layer = L.layerGroup([
                L.tileLayer.baidu({
                    name: "µ×Í¼",
                    layer: 'img_d',
                    bigfont: option.bigfont
                }),
                L.tileLayer.baidu({
                    name: "×¢¼Ç",
                    layer: 'img_z',
                    bigfont: option.bigfont
                })
            ]);
            break;
    }
    return layer;
};