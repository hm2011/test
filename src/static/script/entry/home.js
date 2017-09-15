require([
    'jquery',
    'swiper'
],function(
    $,
    Swiper
){

    // header
    var $pageHeader = $('#page-header');
    $(window).on('scroll.pageHeader',function(){
        if($(document).scrollTop() >= 220){
            $pageHeader.find('input').blur(); // 隐藏搜索时，如果光标出现在输入框里，应同时将光标移除
            $pageHeader.removeClass('transparent');
        }else{
            $pageHeader.addClass('transparent');
        }
    });
    $(window).trigger('scroll.pageHeader');


    // banner
    new Swiper('.banner',{
        setWrapperSize: true,
        loop: true,
        autoplay: 5000,
        nextButton: '.banner-next',
        prevButton: '.banner-prev',
        pagination: '.banner-pagination',
        bulletClass: 'banner-pagination-item',
        bulletActiveClass: 'active',
        paginationClickable: true
    });


    $.ajax({
        url: '/api/v1/ajaxRequest',
        success: function(data){
            console.log(data);
        },
        error: function(err){
            console.log(err);
        }
    });

});
