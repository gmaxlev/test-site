new WOW().init();

window._breakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
};
const breakpoint = window.matchMedia( '(max-width:768px)' );

let mySwiper;
const breakpointChecker = function() {
    if ( breakpoint.matches === true ) {
        return enableSwiper();
    } else if ( breakpoint.matches === false ) {
        if ( mySwiper !== undefined ) mySwiper.destroy( true, true );
        // or/and do nothing
        return;
    }
};
const enableSwiper = function() {
    mySwiper = new Swiper ('#services-slider', {
        loop: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        a11y: true,
        keyboardControl: true,
        grabCursor: true,
        // pagination
        paginationClickable: true,
        spaceBetween: 16,
        pagination: {
            el: '#services-slider-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>';
            },
        },
        breakpoints: {
            [_breakpoints['sm']]: {
                spaceBetween: 20
            },
        }
    });
};
breakpoint.addListener(breakpointChecker);
breakpointChecker();

new Swiper ('#coaches-slider', {
    slidesPerView: 1,
    a11y: true,
    keyboardControl: true,
    grabCursor: true,
    paginationClickable: true,
    spaceBetween: 16,
    breakpoints: {
        [_breakpoints['sm']]: {
            spaceBetween: 20,
            slidesPerView: 2,
        },
    },
    pagination: {
        el: '#coaches-slider-pagination',
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '"></span>';
        },
    },
    navigation: {
        nextEl: '#coaches-slider-pagination-next',
        prevEl: '#coaches-slider-pagination-prev',
    },
    on: {
        activeIndexChange: function (swiper) {
            $('#coaches-slider-pagination-active').text(Number(swiper.activeIndex+1))
        }
    }

});