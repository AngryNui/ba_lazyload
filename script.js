document.addEventListener('DOMContentLoaded', function(event){
    init();
});


function init() {
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
            console.log(mutations);
            mutations.target.addEventListener('load', function(){
                mutations.target.className += ' loaded';
            });
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

        //console.log((currentY <= imageYStart), (currentY + currentH >= imageYStart), (currentY + currentH >= imageYEnd), (currentY <= imageYEnd));
        //console.log(images[pos].getAttribute('data-img'), ': ', currentY, '<=', imageYStart, ' && ', currentY + currentH, '>=', imageYStart, ' || ', currentY, '>=', imageYEnd, ' && ', currentY, '<=', imageYEnd);

        var visible = false;
        if (((currentY-variance <= imageYStart) && (currentY+currentH+variance >= imageYStart)) || ((currentY + currentH + variance >= imageYEnd) && (currentY-variance <= imageYEnd))){ // Check Y-Vertikal in Viewport
            if(((currentX-variance <= imageYStart) && (currentX+currentW+variance >= imageXStart))  || ((currentX + currentW + variance >= imageYEnd) && (currentY-variance <= imageXEnd))){ // Check Y-Horizontal in Viewport
                visible = true;
            }
        }
        return visible;
    }

    function getMediaQueries(el){
        var mediaQueries = Array.prototype.slice.call(el.querySelectorAll('source'));
        return mediaQueries;
    }

    function setSrc(pos){
        var src=images[pos].getAttribute('src');
        var dataImg=images[pos].getAttribute('data-img');
        var parentElement=images[pos].parentElement;
        var mediaQueries;
        var usedMediaQuerie = false;

        if (parentElement.tagName==='PICTURE'){
            mediaQueries = getMediaQueries(parentElement);
            mediaQueries.forEach(function(item,index){
                //window.matchMedia(Array.prototype.slice.call(Array.prototype.slice.call(document.querySelectorAll('[data-img]'))[4].parentElement.querySelectorAll('source'))[0].getAttribute('media')).matches
                if (window.matchMedia(item.getAttribute('media')).matches){
                    dataImg = item.getAttribute('srcset');
                    usedMediaQuerie = true;
                }
            });
        }

        if  (src!=dataImg){
            console.log(images[pos]);
            images[pos].setAttribute('src', dataImg);
            console.log('BildNr: '+dataImg+' geladen!');
        }
    }

    function lazyLoad(){
        if (!cd){
            cd = true;
            setTimeout( function(){
                cd = false;
            }, 50);
            images.forEach(function (value, i) {
                getViewData();
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
