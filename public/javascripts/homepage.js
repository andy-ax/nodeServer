$(document).ready(function () {
    var dom = {
        html: document.getElementsByTagName('html')[0],
        hideWindow: $('#login'),
        showWindow: $('#jsLogShow'),
        back: $('#jsBack'),
        floatWindow: $('#jsFloatWindow'),
        slider: $('#jsSlider'),
        login: $('#jsLogin'),
        register: $('#jsRegister'),
        loginTag: $('#jsLoginTag'),
        registerTag: $('#jsRegisterTag'),

        aLogin: $('#jsALogin'),
        aRegister: $('#jsARegister'),
        aLogSubmit: $('#jsLogSubmit'),
        aRegSubmit: $('#jsRegSubmit'),
        aLogMsg: $('#jsLogMsg'),
        aRegMsg: $('#jsRegMsg'),
    };

    var helper = (function () {
        var pushData = function (type,url,data,callback){//传输表单数据
            var request = createXHR();
            type === 'POST' ? request.open('POST',url) : request.open('GET',url + '?' + encodeFormData(data));
            request.onreadystatechange = function(){
                if(request.readyState === 4 && callback) callback(request);
            };
            if(type === 'POST'){
                request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                request.send(encodeFormData(data));
            }else{
                request.send(null);
            }
        };
        //XHR数据传输
        function createXHR() {//适用于ie7之前版本的xhr
            //检测XMLHttpRequest是否可用
            if(typeof  XMLHttpRequest != 'undefined'){
                return new XMLHttpRequest();
            }
            //检测ActiveXObject是否可用
            else if (typeof  ActiveXObject != 'undefined'){
                if (typeof arguments.callee.activeXString != 'string'){
                    var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
                    for (var i = 0, len = versions.length; i < len; i++) {
                        try {
                            new ActiveXObject(versions[i]);
                            arguments.callee.activeXString = versions[i];
                            break;
                        } catch (e) {
                            //
                        }
                    }
                }
                return new ActiveXObject(arguments.callee.activeXString);
            }
            //XHR和ActiveXO均不可用,抛出错误
            else {
                throw  new Error('No XHR object available');
            }
        }
        function encodeFormData(data){//将数据转换为可传输的数据
            if(!data) return '';//如果没有数据则返回空字符串
            var pairs = [];
            for (var name in data){
                //hasOwnProperty检测属性但不包括继承属性
                if(!data.hasOwnProperty(name)) continue;//跳过继承属性
                if(typeof data[name] === 'function')continue;//跳过方法
                var value = data[name].toString();//将值转换为字符串
                name = encodeURIComponent(name.replace('%20','+'));
                value = encodeURIComponent(value.replace('%20','+'));
                pairs.push(name + '=' + value);
            }
            //将数组组合成为字符串
            return pairs.join('&');
        }
        return {
            pushData: pushData
        }
    })();

    var main = function () {
        init();
        controller();
        ajax();
    };

    var controller = function () {
        dom.showWindow.click(() => {
            dom.floatWindow.css('left',
                (dom.html.clientWidth - dom.floatWindow.width()) / 2 + 'px'
            );
            dom.floatWindow.css('top',
                (dom.html.clientHeight - dom.floatWindow.width()) / 2 + 'px'
            );

            dom.hideWindow.css('display','block');
        });
        dom.back.click(() => {
            dom.hideWindow.css('display','none');
        });

        dom.loginTag.mousemove(() => {
            dom.slider.css('left',sliderLeft + 'px');

            dom.loginTag.addClass('active');
            dom.registerTag.removeClass('active');

            dom.login.css('left','0');
            dom.register.css('left','100%');
        });
        dom.registerTag.mousemove(() => {
            dom.slider.css('left',sliderRight + 'px');

            dom.registerTag.addClass('active');
            dom.loginTag.removeClass('active');

            dom.login.css('left','-100%');
            dom.register.css('left','0');
        });


        let sliderLeft = 35,
            sliderRight = 122;
    };

    var ajax = function () {
        //登录
        dom.aLogSubmit.click((e) => {
            e.preventDefault();
            $.get('./login',dom.aLogin.serialize(),function (data) {
                if (data.u_info){
                    changeUser(data.u_info.name);
                } else {
                    dom.aRegMsg.text(data.info);
                }
                dom.hideWindow.css('display','none');
            });
        });
        //注册
        dom.aRegSubmit.click((e) => {
            e.preventDefault();
            $.post('./login',dom.aRegister.serialize(),function (data) {
                if (data.u_info){
                    changeUser(data.u_info.name);
                } else {
                    dom.aRegMsg.text(data.info);
                }
                dom.hideWindow.css('display','none');
            });
        });
        //session_id校验
        $.get('./session', function (data) {
            if (data){
                changeUser(data.name);
            }
        });

        function changeUser(name) {
            var href = 'http://localhost:23000/user/' + name;
            dom.showWindow.text(name).attr('href',href);
            dom.showWindow.unbind('click');
        }
    };

    var init = function () {
        let sliderLeft = 35;

        dom.hideWindow.css('display','none');
        dom.slider.css('left',sliderLeft + 'px');
    };

    main();
});