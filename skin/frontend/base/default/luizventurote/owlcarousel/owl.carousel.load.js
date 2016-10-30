function loadCarousel(product_galery, product_thumbnail) {

    var owl = jQuery(product_galery);
    var owl_thumbnails = jQuery(product_thumbnail);

    owl.owlCarousel({
        items: 1,
        pagination: false,
        rewindNav: false,
        navigation: true,
        lazyLoad : true,
        singleItem:true,
        autoHeight : true,
        afterAction : syncPosition,
        responsiveRefreshRate : 200,
        navigationText: [
            '<i class="icon-angle-left"></i>',
            '<i class="icon-angle-right"></i>'
        ]
    });

    // Thumbnails
    owl_thumbnails.owlCarousel({
        items: 4,
        itemsDesktop: [1199,3],
        itemsDesktopSmall: [991,4],
        itemsTablet: [768,4],
        itemsMobile: [449,3],
        itemsMobileSmall: [359,2],
        pagination:false,
        navigation: true,
        responsiveRefreshRate: 100,
        afterInit : function(el){
            el.find(".owl-item").eq(0).addClass("synced");
        },
        navigationText: [
            '<i class="icon-angle-left"></i>',
            '<i class="icon-angle-right"></i>'
        ]
    });

    function syncPosition(el){
        var current = this.currentItem;
        owl_thumbnails
            .find(".owl-item")
            .removeClass("synced")
            .eq(current)
            .addClass("synced")
        if(owl_thumbnails.data("owlCarousel") !== undefined){
            center(current)
        }
    }

    owl_thumbnails.on("click", ".owl-item", function(e){
        e.preventDefault();
        var number = jQuery(this).data("owlItem");
        owl.trigger("owl.goTo",number);
    });

    function center(number){
        var sync2visible = owl_thumbnails.data("owlCarousel").owl.visibleItems;
        var num = number;
        var found = false;
        for(var i in sync2visible){
            if(num === sync2visible[i]){
                var found = true;
            }
        }

        if(found===false){
            if(num>sync2visible[sync2visible.length-1]){
                owl_thumbnails.trigger("owl.goTo", num - sync2visible.length+2)
            }else{
                if(num - 1 === -1){
                    num = 0;
                }
                owl_thumbnails.trigger("owl.goTo", num);
            }
        } else if(num === sync2visible[sync2visible.length-1]){
            owl_thumbnails.trigger("owl.goTo", sync2visible[1])
        } else if(num === sync2visible[0]){
            owl_thumbnails.trigger("owl.goTo", num-1)
        }

    }
}