document.addEventListener('DOMContentLoaded', function(event){
    initLazyLoad();
});


function initLazyLoad() {
    var images;
    var currentX;
    var currentY;
    var currentW;
    var currentH;
    var cd = false;
    var variance = 200; //Vegrößerung des Viewports in px -> laden kurz bevor es benötigt wird

    images = Array.prototype.slice.call(document.querySelectorAll('[data-img]'));
    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutations) {
            if (mutations.target.tagName="IMG" && !mutations.target.className.includes('loaded')){
                mutations.target.addEventListener('load', function(){
                    mutations.target.className += ' loaded';
                });
            }
            lazyLoad();
        });
    });

    mutationObserver.observe(document.documentElement, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    });

    lazyLoad();

    function getViewData(){
        currentX = window.pageXOffset;
        currentY = window.pageYOffset;
        currentH = window.innerHeight;
        currentW = window.innerWidth;
    }

    function visibleInView(pos){
        var imageXStart = currentX+images[pos].getBoundingClientRect().left;
        var imageXEnd = currentX+images[pos].getBoundingClientRect().left+images[pos].getBoundingClientRect().width;
        var imageYStart = currentY+images[pos].getBoundingClientRect().top;
        var imageYEnd = currentY+images[pos].getBoundingClientRect().top+images[pos].getBoundingClientRect().height;

        var visible = false;
        if (((currentY-variance <= imageYStart) && (currentY+currentH+variance >= imageYStart)) || ((currentY + currentH + variance >= imageYEnd) && (currentY-variance <= imageYEnd))){ // Check Y-Vertikal in Viewport
            if(((currentX-variance <= imageYStart) && (currentX+currentW+variance >= imageXStart))  || ((currentX + currentW + variance >= imageYEnd) && (currentY-variance <= imageXEnd))){ // Check Y-Horizontal in Viewport
                visible = true;
            }
        }
        return visible;
    }

    function setSrc(pos){
        var src=images[pos].getAttribute('src');
        var dataImg=images[pos].getAttribute('data-img');
        var parentElement=images[pos].parentElement;
        var mediaQueries;
        var usedMediaQuerie = false;

        if (parentElement.tagName==='PICTURE'){
            mediaQueries = Array.prototype.slice.call(parentElement.querySelectorAll('source'));
            mediaQueries.forEach(function(item,index){
                if (window.matchMedia(item.getAttribute('media')).matches){
                    dataImg = item.getAttribute('data-img');
                    usedMediaQuerie = true;
                }
            });
        }

        if  (src!=dataImg){
            images[pos].setAttribute('src', dataImg);
        }
    }

    function lazyLoad(){
        if (!cd){
            cd = true;
            setTimeout( function(){
                cd = false;
            }, 50);
            getViewData();
            images.forEach(function (value, i) {
                if (visibleInView(i)) {
                    setSrc(i);
                }
            });
        }
    }

    window.addEventListener('scroll',  function(){
        lazyLoad();
    });
    window.addEventListener('resize',  function() {
        lazyLoad();
    });
}
