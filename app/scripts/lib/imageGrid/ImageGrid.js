/**
 * Created by grahamclapham on 19/05/2014.
 */
var ImageGrid = (function (){


    var _scope = function(width, height, opt_target){

        //Non public functions
        this._private = {
            _name:null,
            _renderOriginal: false,
            _renderProcessed: true,
            _dispatcher:null,
            _image:null,
            _imageSrc:'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg',
            _ImageData:null,
            _gridSpacing:4,
            _width:width ? width : 200,
            _height:height ? height : 200,
            _imageWidth:null,
            _imageHeight:null,
            _canvas:null,
            _outputCanvas:null,
            _context:null,
            _outputContext:null,
            _opt_target:opt_target ? opt_target : null,
            _grid:[],
            _flatGrid:[],
            _ignoreValue: {r:255, g:255, b:255}  // is there a colour which you do not wish to be added to the array?
        };

        this._private._dispatcher = document.createElement('div');
        this._private._canvas = ImageGrid.makeCanvas(this._private._width, this._private._height, "newCanv");
        this._private._context = this._private._canvas.getContext('2d');
        this._private._outputCanvas = ImageGrid.makeCanvas(this._private._width, this._private._height, "newCanv");
        this._private._outputContext = this._private._outputCanvas.getContext('2d');
        if(this._private._opt_target) init.call(this);
    };

    // private functions
    var  init = function(){
        console.log("intCalled");
    }

    var _onTargetSet = function(){
        if(this._private._opt_target){
           if(this._private._renderOriginal) this._private._opt_target.appendChild(this._private._canvas)
           if(this._private._renderProcessed)  this._private._opt_target.appendChild(this._private._outputCanvas)
        }
    };

    //////////
    var _onGridSpacingChanged = function(){
        // console.log("_onGridSpacingChanged ",this._private._gridSpacing+ " ",  this._private._name, this.getWidth()  )
    }

    var _makeImageGrid = function(){
        this._private._grid = [];
        this._private._flatGrid = []
        var _xDivisions = parseInt(this._private._ImageData.width / this._private._gridSpacing);
        var _yDivisions = parseInt(this._private._ImageData.height / this._private._gridSpacing);
        var step = this._private._gridSpacing;
        for(var i=0; i<_yDivisions; i++){
            this._private._grid.push([])
            for(var n=0; n<_xDivisions; n++){
                var dt =  ImageGrid.getImageData(this._private._context, step*n, step*i, step, step);
                var luminosity = parseInt( (dt.data[0] / 255) * 100);
                var _rgbValue = "rgba("+dt.data[0]+","+ dt.data[1]+","+dt.data[2]+","+dt.data[3]+")";
                var ignore = this._private._ignoreValue;
                if(ignore.r == dt.data[0] && ignore.g == dt.data[1] && ignore.b == dt.data[2]){
                }else{
                    var _pixelObject = {r:dt.data[0], g:dt.data[1], b:dt.data[2], a:dt.data[3], rgba:_rgbValue, greyscale: ImageGrid.rgbToGreyscale(dt.data[0],dt.data[1],dt.data[2]), position:{x:n,y:i}, luminosity:luminosity }
                    this._private._flatGrid.push(_pixelObject)
                }
//                ImageGrid.drawCircle(this._private._outputContext, step*n, step*i,this._private._gridSpacing/2 , ImageGrid.rgbToGreyscale(dt.data[0],dt.data[1],dt.data[2]), true)
//                ImageGrid.drawCircle(this._private._outputContext, step*n, step*i,(this._private._gridSpacing/2) -2 , _rgbValue, false)
            }
        }
        var _event = new CustomEvent(ImageGrid.enums.IMAGE_PARSED, { 'detail': this._private._flatGrid });
        _drawGridImage.call(this);
        this._private._dispatcher.dispatchEvent(_event)
    }

    var _drawGridImage = function(){
        console.log(this._private._flatGrid)
        for(var item in this._private._flatGrid){
            var stepx, stepy, rgba, greyscale, current;
            current = this._private._flatGrid[item];
            stepx = current.position.x * this._private._gridSpacing;
            stepy = current.position.y * this._private._gridSpacing;
            rgba = current.rgba;
            greyscale  = current.greyscale;
            ImageGrid.drawCircle(this._private._outputContext, stepx, stepy,(this._private._gridSpacing/2) -2 , rgba, true);
        }
    }

    var _onImageSet = function(){
        this._private._image = new Image();
        var _this = this
        this._private._image.onload = function() {
            _this._private._context.drawImage(_this._private._image, 0, 0);
            _this._private._ImageData = ImageGrid.getImageData(_this._private._context,0,0, _this._private._width, _this._private._height);
            _makeImageGrid.call(_this);
        };
        this._private._image.src = this._private._imageSrc;
    }

    ///////////

    _scope.prototype = {
            getWidth:function(){
                return this._private._width
            },
            setWidth:function(value){
                this._private._width = value;
            },
            getHeight:function(){
                return this._private._height;
            },
            setHeight:function(value){
                this._private._height = value;
            },
            getGridSpacing:function(){
               return  this._private._gridSpacing;
            },
            setGridSpacing:function(value){
                this._private._gridSpacing = value;
                _onGridSpacingChanged.call(this);
            },
//            setImage:function(value){
//                this._private._image = value
//                _onImageSet.call(this);
//            },
            getTarget:function(){
              return  this._private._opt_target;
            },
            setTarget:function(value){
                this._private._opt_target = value;
                _onTargetSet.call(this);
            },
            getImage:function(){
               return  this._private._imageSrc;
            },
            setImage:function(value){
                this._private._imageSrc = value;
                _onImageSet.call(this);
                this.renderToStage();
            },
            getDispatcher:function(){
               return  this._private._dispatcher
            },

            renderToStage:function(){
                _onTargetSet.call(this);
            },
            listen:function(evt, callback){
                this.getDispatcher().addEventListener(evt, callback)
            },
            setRenderOriginal:function(value ){
                this._private._renderOriginal = value;
            },
            getRenderOriginal:function(){
                return this._private._renderOriginal;
            },
            setRenderProcessed:function(value){
                 this._private._renderProcessed = value;
            },
            getRenderProcessed:function(){
                return this._private._renderProcessed;
            }
    }

    return _scope;

})();

/*
 Static functions
*/
ImageGrid.makeCanvas = function(width, height, id){
    var canvas = document.createElement("canvas");
    canvas.className        = "myClass";
    canvas.width            = width;
    canvas.height           = height;
//    canvas.style.position   = 'absolute';
//    canvas.style.top        = '0';
//    canvas.style.left       = '0';

    return canvas
}

ImageGrid.getImageData = function(ctx, leftOffset, topOffset, width, height){
    return ctx.getImageData(leftOffset,topOffset,width, height);
}

ImageGrid.setPixel = function(imageData, x, y, r, g, b, a) {
    var index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

ImageGrid.rgbToGreyscale = function(r,g,b){
    // just return black if is NaN - to prevent errors.

    var pixelSum =  !isNaN(  (0.21*r) + (0.72*g) + (0.07*b) ) ?  (0.21*r) + (0.72*g) + (0.07*b) : 000000 ;
    var pixelSum =  r+g+b ;
    var third = String(parseInt( (pixelSum/3) ));
    //console.log("third ",third)
    var grey = parseFloat(third+third+third)
    var greyRGBA = String("rgba("+third+","+third+","+third+",1)")
    //console.log("greyRGBA ",greyRGBA)

    return greyRGBA;
}

ImageGrid.drawCircle = function(ctx,x ,y,r, colour, border ){
    ctx.fillStyle = colour;
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.setLineWidth(this.guideThickness)
    !border ? ctx.fill() : ctx.stroke();
    ctx.closePath();
}

ImageGrid.enums = {
    IMAGE_PARSED:"imageParsed"
}


