/**
 * Created by grahamclapham on 21/05/2014.
 */

InageCloud = (function(){
    var _scope = function(width, height, gridSize , opt_target, opt_data){

        this._private = {
            _width:width ? width : 600,
            _height:height ? height : 600,
            _gridZize: gridSize ? gridSize : 30,
            _opt_target: opt_target ? opt_target : null,
            _opt_data: opt_data ? opt_data : null,
            _svg:null,
            _data:null,
            _points:null,
            _scale:null
        }
        init.call(this);
    };

    _scope.prototype = {
        setData:function(value){
            this._private._data = value;
            _onDataChanged.call(this);
        }
    }

    //Private functions
    var init = function(){
       if(this._private._opt_target) _drawCanvas.call(this)
    }

    var _drawCanvas = function(){
        this._private._svg = d3.select(this._private._opt_target).append("svg")
            .attr("width", this._private._width)
            .attr("height", this._private._height)
            .append("g")
            .attr("transform", "translate(" + 0 + "," + 0 + ")");
    }

    var _onDataChanged = function(){
        var _this = this
        this._private._points = this._private._svg.selectAll('.out_circle')
            .data(this._private._data)
            .enter()
            .append('g')
            .attr('class', 'out_circle')
            .append("svg:circle")

            .attr('r', function(d,i){return 400})
            .transition()
            .duration(200)
            .attr("r", function(d,i){
                var rad = ( (_this._private._gridZize/2) /100 ) * d.luminosity
                return rad
            })
            .attr('fill', function(d,i){
                col = d.greyscale
                col = "#ffffff"
                return col
            })
            .attr("transform", function(d, i) {
                return "translate("+ (d.position.x* _this._private._gridZize*Math.random()*100)+","+ (d.position.y * _this._private._gridZize*Math.random()*100)+")";
            })
            .transition()
            .delay(20)
            .duration(3000)
                .attr("transform", function(d, i) {
                    return "translate("+ (d.position.x* _this._private._gridZize)+","+ (d.position.y * _this._private._gridZize)+")";
                })


    }

    return _scope;
})();