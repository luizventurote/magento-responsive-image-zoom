function buildPswdHtml(){
    jQuery("body").append([
        '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">',
        '  <div class="pswp__bg"></div>',
        '  <div class="pswp__scroll-wrap">',
        '    <div class="pswp__container">',
        '      <div class="pswp__item"></div>',
        '      <div class="pswp__item"></div>',
        '      <div class="pswp__item"></div>',
        '    </div>',
        '    <div class="pswp__ui pswp__ui--hidden">',
        '      <div class="pswp__top-bar">',
        '          <div class="pswp__counter"></div>',
        '          <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>',
        '          <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>',
        '          <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>',
        '          <div class="pswp__preloader">',
        '            <div class="pswp__preloader__icn">',
        '              <div class="pswp__preloader__cut">',
        '                <div class="pswp__preloader__donut"></div>',
        '              </div>',
        '            </div>',
        '          </div>',
        '      </div>',
        '      <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">',
        '        <div class="pswp__share-tooltip"></div> ',
        '      </div>',
        '      <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>',
        '      <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>',
        '      <div class="pswp__caption">',
        '        <div class="pswp__caption__center"></div>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>'
    ].join(""));
}

function getGalleryItems($gallery) {

    var items = [];

    $gallery.find("a").each(function(){

        var $anchor = jQuery(this),
            size    = $anchor.attr("data-size").split("x"),
            title   = $anchor.attr("data-title"),
            item    = {
                el: $anchor.get(0),
                src: $anchor.attr("href"),
                w: parseInt(size[0]),
                h: parseInt(size[1])
            };

        if( title ) item.title = title;

        items.push(item);
    });

    return items;
}

function openGallery($gallery, index, items, pswpOptions) {

    var $pswp    = jQuery(".pswp"),
        owl      = $gallery.data("owlCarousel"),
        carousel = jQuery(".carousel"),
        gallery,
        slider_cursor,
        slider_qty;

    var options = jQuery.extend(true, {
        index: index,

        getThumbBoundsFn: function(index){
            var $thumbnail  = jQuery(items[index].el).find("img"),
                offset      = $thumbnail.offset();
            return {
                x: offset.left,
                y: offset.top,
                w: $thumbnail.outerWidth()
            };
        }
    }, pswpOptions);

    // Init PhotoSwipe
    gallery = new PhotoSwipe($pswp.get(0), PhotoSwipeUI_Default, items, options);
    gallery.init();

    // Fechar Zoom
    gallery.listen("close", function(){
        this.currItem.initialLayout = options.getThumbBoundsFn(this.getCurrentIndex());
    });

    // Zoom inicial
    gallery.listen('initialZoomInEnd', function() {

        /*
         if(window.innerWidth > 768) {
         gallery.zoomTo(1, {x:gallery.viewportSize.x/2,y:0}, 300, false, function(now) {});
         }
         */

        // Consulta a quantidade de slides
        var counter = jQuery(".pswp__counter").text().split("/");

        // Quantidade de slides
        slider_qty = counter[1].replace(" ", "");

        // Cursor
        slider_cursor = counter[0].replace(" ", "");

    });

    // Clique em pr�ximo item
    gallery.listen('next_item', function() {

        if(slider_cursor == slider_qty) {

            slider_cursor = 1;
            carousel.trigger('to.owl.carousel', [0, 300]);

        } else {

            slider_cursor++;
            carousel.trigger('next.owl.carousel');
        }

        /*
         if(window.innerWidth > 768) {
         gallery.zoomTo(1, {x:gallery.viewportSize.x/2,y:0}, 0, false, function(now) {});
         }
         */

    });

    // Clique em voltar item
    gallery.listen('prev_item', function() {

        if(slider_cursor == 1) {

            carousel.trigger('to.owl.carousel', [slider_qty-1, 300]);
            slider_cursor = slider_qty;

        } else {

            carousel.trigger('prev.owl.carousel');
            slider_cursor--;
        }

        /*
         if(window.innerWidth > 768) {
         gallery.zoomTo(1, {x:gallery.viewportSize.x/2,y:0}, 0, false, function(now) {});
         }
         */

    });
}

function initializeGallery($elem, owlOptions, pswpOptions){

    if( jQuery(".pswp").size() === 0 ){
        buildPswdHtml();
    }

    $elem.each(function(i){
        var $gallery = jQuery(this),
            uid = i + 1,
            items = getGalleryItems($gallery),
            options = jQuery.extend(true, {}, pswpOptions);

        $gallery.owlCarousel(owlOptions);

        options.galleryUID = uid;
        $gallery.attr("data-pswp-uid", uid);

        $gallery.find(".owl-item").on("click", function(e){
            if( !jQuery(e.target).is("img") ) return;

            openGallery($gallery, jQuery(this).index(), items.concat(), options);
            return false;
        });
    });
}