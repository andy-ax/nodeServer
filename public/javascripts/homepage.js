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
        aRegSubmit: $('#jsRegSubmit')
    };

    var main = function () {
        init();
    };

    var controller = (function () {
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
    })();

    var init = function () {
        let sliderLeft = 35;

        dom.hideWindow.css('display','none');
        dom.slider.css('left',sliderLeft + 'px');
    };

    main();
});