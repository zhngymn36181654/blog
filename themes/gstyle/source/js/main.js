$(function() {
    var isPhone = $(window).width() < 768;

    init();

    function init() {
        // $('.material-preloader').hide();
        setupRipple();
        slidingBorder();
        toc();

        $('.post-content img').on('click',function(){
            window.open($(this).attr('src'));
        });
    }

    function slidingBorder() {
        // sliding border
        var $activeState = $('.nav-indicator', 'nav'),
            $navParent = $('.menu-wrapper', 'nav'),
            overNav = false,
            $hoveredLink,
            $activeLink = $("ul.menus li.active a"),
            activeHideTimeout;
        setActiveLink(true);
        $('.menu-wrapper ul.menus li').on('mousemove', onLinkHover);
        $('.menu-wrapper').on('mouseleave', onLinksLeave);

        function onLinkHover(e) {
            if (!isPhone) {
                $hoveredLink = e.target ? $(e.target) : e;
                if (!$hoveredLink.is('li')) {
                    $hoveredLink = $hoveredLink.parent('li');
                }
                var left = $hoveredLink.offset().left - $navParent.offset().left,
                    width = $hoveredLink.width();
                if (0 != $activeLink.length || overNav) {
                    $activeState.css({
                        transform: "translate3d(" + left + "px, 0, 0) scaleX(" + width / 100 + ")"
                    });
                } else {
                    clearTimeout(activeHideTimeout),
                        $activeState.css({
                            transform: "translate3d(" + (left + width / 2) + "px, 0, 0) scaleX(0.001)"
                        });
                    setTimeout(function() {
                        $activeState.addClass("animate-indicator").css({
                            transform: "translate3d(" + left + "px, 0, 0) scaleX(" + width / 100 + ")"
                        })
                    }, 10);
                }
                overNav = true;
            }
        }

        function onLinksLeave(e) {
            if (!isPhone) {
                if (0 == $activeLink.length) {
                    var left = $hoveredLink.offset().left - $navParent.offset().left,
                        width = $hoveredLink.width();
                    $activeState.css({
                        'transform': "translate3d(" + (left + width / 2) + "px, 0, 0) scaleX(0.001)"
                    });
                    activeHideTimeout = setTimeout(function() {
                        $activeState.removeClass("animate-indicator")
                    }, 200);
                } else {
                    onLinkHover($activeLink);
                }
                overNav = false;
            }
        }

        function setActiveLink(load) {
            if ($activeLink.length > 0) {
                var left = $activeLink.offset().left - $navParent.offset().left;
                $activeState.css({
                    'transform': "translate3d(" + (left + $activeLink.width() / 2) + "px, 0, 0) scaleX(0.001)"
                });
                setTimeout(function() {
                    $activeState.addClass("animate-indicator"),
                        onLinkHover($activeLink)
                }, 100);
            }
        }
    }

    function toc() {
        if (!isPhone) {
            //toc
            $('#toc').html('');
            $('#toc').tocify({
                'selectors': 'h2,h3',
                'extendPage': false,
                'theme': 'none',
                'scrollHistory':false
            });
        }
    }

    function setupRipple() {
        // ripple click http://fian.my.id/Waves/#start
        var rippleTargets = [
            '.wave',
            '.main.index article',
            '.main.index .post-header.with-cover',
            '.main.index .post-info .post-date',
            '.main.index .post-info .post-category a',
            '.main.index .read-more a',
            '.pagination a',
            '.pager .pager-item',
            '.btn',
            'nav .menus a'
        ];
        rippleTargets.forEach(function(selector){
            if ($(selector).length) {
                Waves.attach(selector, ['waves-light']);
            }
        });
        Waves.init();
    }

})
