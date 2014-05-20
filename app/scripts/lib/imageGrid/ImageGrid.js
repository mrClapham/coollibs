/**
 * Created by grahamclapham on 19/05/2014.
 */
var ImageGrid = (function (name){
        //Non public functions
        var _private = {
            _name:name,
            _image:null,
            _imageSrc:'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg',
            _ImageData:null,
            _gridSpacing:10,
            _width:200,
            _height:200,
            _imageWidth:null,
            _imageHeight:null,
            _canvas:null,
            _context:null,
            _opt_target:null,
            _grid:[],
            _onGridSpacingChanged:function(){
            // console.log("_onGridSpacingChanged ",_private._gridSpacing+ " ",  _private._name, this.getWidth()  )
            },
            _onImageSet:function(){
                _private._image = new Image();
                _private._image.onload = function() {
                    _private._context.drawImage(_private._image, 0, 0);
                    _private._ImageData = ImageGrid.getImageData(_private._context,0,0, _private._width, _private._height);
                    //console.log(_private._ImageData)
                    //console.log(_private._ImageData)

                    _private._makeImageGrid()

                };
                console.log(_private._context);
                _private._image.src = _private._imageSrc;
            },
            _makeImageGrid:function(){
                _private._grid = [];
                var _xDivisions = parseInt(_private._ImageData.width / _private._gridSpacing);
                var _yDivisions = parseInt(_private._ImageData.height / _private._gridSpacing);
                    console.log("Width ",_private._ImageData.width)
                    console.log("height",_private._ImageData.width)
                console.log("DIVISIONS    ",_xDivisions, _yDivisions);
                var step = _private._gridSpacing;
                for(var i=0; i<_yDivisions; i++){
                    _private._grid.push([])
                    for(var n=0; n<_xDivisions; n++){
                        var dt =  ImageGrid.getImageData(_private._context, step*i, step*n, step, step);
                        var _pixelObject = {r:dt.data[0], g:dt.data[1], b:dt.data[2], a:dt.data[3] }
                        _private._grid[i].push( _pixelObject );
                           // console.log(_pixelObject );
                        //ImageGrid.setPixel(_private._ImageData,30,30, dt.data[0], dt.data[1], dt.data[2], dt.data[3] )
                       // _private._context.putImageData(dt, step*i, 30);

                        _private._context.fillStyle="#FF0000";
                        _private._context.fillRect(step*i, step*n,_private._gridSpacing-1,_private._gridSpacing-1);
                    }
                }
                console.log(_private._grid)
            },
            _onTargetSet:function(){
                if(_private._opt_target){
                    _private._opt_target.appendChild(_private._canvas)
                }
            }
    };

    var _scope = function(n, width, height, opt_target){
        _private._name = n;
        _private._width = width;
        _private._height = height;
        console.log(opt_target)
        if(opt_target) _private._opt_target = opt_target;

   // private functions
   var  init = function(){
       console.log("W H ",_private._width, _private._height)
       _private._canvas = ImageGrid.makeCanvas(_private._width, _private._height, "newCanv");
       _private._context = _private._canvas.getContext('2d');
       }
        init.call(this);
    };

    _scope.prototype = {
            getWidth:function(){
                return _private._width
            },
            setWidth:function(value){
                _private._width = value;
            },
            getHeight:function(){
                return _private._height;
            },
            setHeight:function(value){
                _private._height = value;
            },
            getGridSpacing:function(){
               return  _private._gridSpacing;
            },
            setGridSpacing:function(value){
                _private._gridSpacing = value;
                _private._onGridSpacingChanged.call(this);
            },
            setImage:function(value){
                _private._image = value
                _private._onImageSet.call(this);
            },
            getTarget:function(){
              return  _private._opt_target;
            },
            setTarget:function(value){
                _private._opt_target = value;
                _private._onTargetSet.call(this);
            },
            getImage:function(){
               return  _private._imageSrc;
            },
            setImage:function(value){
                _private._imageSrc = value;
                _private._onImageSet();
                this.renderToStage();
            },
            renderToStage:function(){
                _private._onTargetSet.call(this);
            }
    }

    return _scope;

})();

// static functions
ImageGrid.makeCanvas = function(width, height, id){
    var canvas = document.createElement("canvas");
    canvas.className        = "myClass";
    canvas.width            = width;
    canvas.height           = height;
    canvas.style.position   = 'absolute';
    canvas.style.top        = '0';
    canvas.style.left       = '0';

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
