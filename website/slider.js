document.addEventListener("DOMContentLoaded", function(event){
    next = document.getElementById('sliderNext');
    prev = document.getElementById('sliderPrevious');
    slider = document.getElementById('sliderSlides');
    var maxslides=5;
    var currentSlide=0;

    next.addEventListener("click",  function(){
        if (currentSlide+1<maxslides) {
            currentSlide++;
            console.log(currentSlide);
            slider.style.transform = "translateX(-" + (100 / maxslides) * currentSlide + "%)";
        }
    });
    prev.addEventListener("click",  function(){
        if (currentSlide-1>=0){
            currentSlide--;
            console.log(currentSlide);
            slider.style.transform = "translateX(-"+(100/maxslides)*currentSlide+"%)";
        }
    });
});