/**
 * Created by grahamclapham on 04/10/2013.
 */

var _model = {};
var _step = 2;
var _offset = 200



$(document).ready(function(){
    intCanvas()
})


intCanvas = function(){
    _model._stage = new createjs.Stage("mainCanv");
    _model.container = new createjs.Container()
    _model.circle = new createjs.Shape();
    _model.circle.graphics.beginFill("#ff00ff").drawCircle(0, 0, 50);
    _model.circle.x = _offset;
    _model.circle.y = _offset;

    var blurFilter = new createjs.BlurFilter(15, 15, 1);
    _model.circle.filters = [blurFilter];
    var bounds = blurFilter.getBounds();

    _model.circle.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height);


    _model.container.addChild(_model.circle);

    _model.bitmap = addBitmap( _model.container, "images/star.png")

    _model._stage.addChild(_model.container)
    _model._stage.update();


    _model.circle.addEventListener('click', onClick)


    _model.container.alpha = 0;
    var __tween = createjs.Tween.get(_model.container).to({alpha:1}, 6000).call(handleComplete);
    function handleComplete() {
        //Tween complete
    }


    createjs.Ticker.setFPS( 60 );
    createjs.Ticker.addEventListener("tick", animtick);
}


function addBitmap(targ, path){
    var contain = new createjs.Container()
    var bitmap = new createjs.Bitmap(path);
    contain.x= 200
    contain.y=200
    contain.addChild(bitmap)
    targ.addChild(contain)
    return contain
}

function onClick(e){
    console.log(e)
    addCircles()
}

function addCircles(){
    var _width = Math.random()*90
    var newCirc = new createjs.Shape();
    newCirc.x = _offset;
    newCirc.y = _offset;
    //_model.bitmap.y -= 1
    newCirc.graphics.beginStroke("black").drawCircle(0, 0, _width);
    _model.container.addChild(newCirc)
    newCirc.alpha=0
    var __Ctween = createjs.Tween.get(newCirc).to({alpha:1}, 1000);
}

function animtick() {
    if(_model.container.x> 300 || _model.container.x < 0){
        _step = -_step
    }
   _model.container.x += _step;
    _model.bitmap.rotation += 2
    _model._stage.update();

}






