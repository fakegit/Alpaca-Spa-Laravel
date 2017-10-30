/* 1 定义Metro模块中的IndexController ,并且定义两个action方法，test3，test4*/
Alpaca.MainModule.ChatController = {

    //webServer配置
    webServer: {
        ws: null,                                    //* web-socket 连接对象 */
        url: "ws://full.tkc8.com"+ ":8082",          //* web-socket 地址 */
    },

    //我的信息
    myInfo:{},

    //onlineList 在线人员数据
    onlineList: {},

    //index-动作
    indexAction: function () {
        var view = new Alpaca.MainModule.View();
        view.ready(function () {
            if (Alpaca.MainModule.ChatController.webServer.ws) {
                return;
            }
            AlpacaAjax({
                url: g_url + API['user_shake_token'],
                data: {},
                newSuccess: function (data) {

                    if (data.code == "112") {
                        var redirect = encodeURIComponent(window.location.href);
                        Alpaca.to("#/main/auth/testLoginView/"+redirect);
                        return false;
                    }

                    if (data.code != 9900) {
                        return;
                    }

                    //请求正确,开启webSocket
                    var ws_url = Alpaca.MainModule.ChatController.webServer.url;
                    var ws     = new WebSocket(ws_url);

                    //onOpen
                    console.log(data);
                    ws.onopen = function () {
                        // 连接成功,登录webSocket
                        var request    = {};
                        request.action = API['ws_chat_user_login'];
                        request.data   = {token: data.data};
                        ws.send(JSON.stringify(request));
                    };

                    //onMessage
                    ws.onmessage = function (event) {
                        Alpaca.to('#/main/chat/router', event);
                    };

                    //设置ws
                    Alpaca.MainModule.ChatController.webServer.ws = ws;
                },
            });

        });
        return view;
    },

    // 处理 ws 路由
    routerAction: function (event) {
        var acceptData = JSON.parse(event.data);
        console.log(acceptData);
        var action = acceptData.action;
        switch (action) {
            case 'chat/userLogin':
                Alpaca.to('#/main/chat/loginBack', acceptData);
                break;
            case 'chat/notifyOnline':
                Alpaca.to('#/main/chat/notifyOnline', acceptData);
                break;
            case 'chat/notifyOffline':
                Alpaca.to('#/main/chat/notifyOffline', acceptData);
                break;
            case 'chat/online':
                Alpaca.to('#/main/chat/onlineBack', acceptData);
                break;
            case 'chat/notifyMsg':
                Alpaca.to('#/main/chat/notifyMsg', acceptData);
                break;
        }
    },

    // 用户上线
    loginBackAction: function (data) {
        this.myInfo = data.data.member;
    },

    // 在线用户
    onlineBackAction: function (data) {

        for (var i in data.data) {
            var uid = data.data[i].type + '_' + data.data[i].id;
            if (Alpaca.MainModule.WsController.onlineList[uid]) {
                continue;
            }
            Alpaca.MainModule.WsController.onlineList[uid] = data.data[i];
            Alpaca.to('#/main/ws/addOnline', data.data[i]);
        }
    },

    // 用户上线
    notifyOnlineAction: function (data) {
        return;
        var uid = data.data.member.type + '_' + data.data.member.id;
        if (Alpaca.MainModule.WsController.onlineList[uid]) {
            return;
        }
        Alpaca.MainModule.WsController.onlineList[uid] = data.data.member;
        Alpaca.to('#/main/ws/addOnline', data.data.member);
    },

    // 用户下线
    notifyOfflineAction: function (data) {
        return;
        var uid = data.data.member.type + '_' + data.data.member.id;
        delete Alpaca.MainModule.WsController.onlineList[uid];
        var itemClass = ".user-list-item-" + uid;
        $(itemClass).remove();
    },

    // 收到消息
    notifyMsgAction: function (data) {
        Alpaca.to('#/main/chat/addChat', data.data);
    },

    // 发送消息
    sendAction: function (data) {
        var ws         = Alpaca.MainModule.ChatController.webServer.ws;
        var request    = {};
        request.action = API['ws_chat_send'];
        request.data   = {msg: data.msg};
        ws.send(JSON.stringify(request));
    },

    // 收到上线
    addOnlineAction: function (data) {

        if (!data.avatar) {
            data.avatar = g_baseUrl + 'main/assets/images/placeholder.jpg"';
        }

        var view  = Alpaca.View({data: data, to: "#online-user-list"});
        view.show = function (to, html) {
            var that = this;
            $(to).append(html);
            that.onLoad();
        };
        view.display();
    },

    // 收到消息
    addChatAction: function (data) {
        if (!data.member.avatar) {
            data.member.avatar = "http://gqianniu.alicdn.com/bao/uploaded/i4//tfscom/i3/TB10LfcHFXXXXXKXpXXXXXXXXXX_!!0-item_pic.jpg_250x250q60.jpg";
        }

        if(this.myInfo.id==data.member.id && this.myInfo.type==data.member.type ){
            data.member.isMy = true;
        }

        var view  = Alpaca.View({data: data, to: "#ws-chat-list"});
        view.ready(function(){
            $('#msg_end')[0].scrollIntoView();
        });

        view.show = function (to, html) {
            var that = this;
            $(to).append(html);
            that.onLoad();
        };
        view.display();
    },

    videoAction:function(){

        var view = new Alpaca.MainModule.View();

        view.ready(function(){

            var image = document.getElementById('receiver');

            AlpacaAjax({
                url: g_url + API['user_shake_token'],
                data: {},
                newSuccess: function (data) {

                    if (data.code == "112") {
                        var redirect = encodeURIComponent(window.location.href);
                        Alpaca.to("#/main/auth/testLoginView/"+redirect);
                        return false;
                    }

                    if (data.code != 9900) {
                        return;
                    }

                    //请求正确,开启webSocket
                    var ws_url = Alpaca.MainModule.ChatController.webServer.url;
                    var ws     = new WebSocket(ws_url);

                    //onOpen
                    console.log(data);
                    ws.onopen = function () {
                        // 连接成功,登录webSocket
                        var request    = {};
                        request.action = API['ws_chat_user_login'];
                        request.data   = {token: data.data};
                        ws.send(JSON.stringify(request));
                    };

                    //onMessage
                    ws.onmessage = function (event) {
                        var acceptData = JSON.parse(event.data);
                        console.log(acceptData);
                        var action = acceptData.action;
                        switch (action) {
                            case 'chat/video':
                                draw(acceptData);
                                break;
                        }
                    };

                    var p_data= [];

                    var is_showing= false;

                    var draw = function (data) {
                        p_data.push(data.data);

                        if(is_showing){
                            return;
                        }

                        is_showing = true;
                        var show = function(imgs){

                            if(imgs.length<=0){
                                is_showing =false;
                                return;
                            }

                            var img =  imgs.shift();

                            image.src=img;

                            setTimeout(function(){
                                show(imgs);
                            },100);
                        };
                        var v_data = p_data.shift();

                        show(v_data);

                    };
                },
            });


        });

        return view;
    },

    cameraAction:function(){

        var view = new Alpaca.MainModule.View();

        view.ready(function(){

            var capture = document.getElementById("capture");
            var video = document.getElementById("video");
            var canvas = document.getElementById("canvas");
            var context = canvas.getContext("2d");
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            window.URL = window.URL || window.webkitURL;

            navigator.getUserMedia({video:true}, onSuccess, onError); //调用摄像头捕捉视频信息

            function onSuccess(stream){
                video.src = window.URL.createObjectURL(stream);
            }
            function onError(e){
                console.log(e);
                alert('获取视频出错');
            }


            AlpacaAjax({
                url: g_url + API['user_shake_token'],
                data: {},
                newSuccess: function (data) {

                    if (data.code == "112") {
                        var redirect = encodeURIComponent(window.location.href);
                        Alpaca.to("#/main/auth/testLoginView/"+redirect);
                        return false;
                    }

                    if (data.code != 9900) {
                        return;
                    }

                    //请求正确,开启webSocket
                    var ws_url = Alpaca.MainModule.ChatController.webServer.url;
                    var ws     = new WebSocket(ws_url);

                    //onOpen
                    console.log(data);
                    ws.onopen = function () {
                        // 连接成功,登录webSocket
                        var request    = {};
                        request.action = API['ws_chat_user_login'];
                        request.data   = {token: data.data};
                        ws.send(JSON.stringify(request));
                    };

                    //onMessage
                    ws.onmessage = function (event) {
                        var acceptData = JSON.parse(event.data);
                        console.log(acceptData);
                        var action = acceptData.action;
                        switch (action) {
                            case 'chat/userLogin':
                                draw();
                                break;
                        }
                    };

                    var p_data = [];
                    var n = 0;

                    var draw = function () {
                        try {
                            context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        } catch (e) {
                            if (e.name == "NS_ERROR_NOT_AVAILABLE") {
                                return setTimeout(draw, 100);
                            } else {
                                throw e;
                            }
                        }
                        if (video.src) {

                            p_data[n++]=canvas.toDataURL("image/jpeg", 0.1);
                            if(n>=30){
                                var request    = {};
                                request.action =  'chat/camera';
                                request.data   = p_data;
                                ws.send(JSON.stringify(request));
                                n=0;
                                p_data = [];
                            }

                        }
                        setTimeout(draw, 100);
                    };
                },
            });


        });
        return view;
    },

};