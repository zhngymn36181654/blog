$(function() {
    var isPhone = $(window).width() < 768;

    init();

    function init() {
        // $('.material-preloader').hide();
        $('.post-content img').on('click',function(){
            window.open($(this).attr('src'));
        });
    }

})
