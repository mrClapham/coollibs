/**
 * Created by grahamclapham on 21/05/2014.
 */

InageCloud = (function(){
    var _scope = function(width, height, gridSize , opt_target, opt_data){

        this._private = {
            _width:width ? width : 200,
            _height:height ? height : 200,
            _gridZize: gridSize ? gridSize : 10,
            _opt_target: opt_target ? opt_target : null,
            _opt_data: opt_data ? opt_data : null,
            _svg:null,
            _data:null,
            _points:null
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
            .attr("transform", "translate(" + 10 + "," + 10 + ")");
    }

    var _onDataChanged = function(){
        var _this = this
        this._private._points = this._private._svg.selectAll('.out_circle')
            .data(this._private._data[0])
            .enter()
            .append('g')
            .attr('class', 'out_circle')
            .append("svg:circle")
            .attr('r', function(d,i){return 4})
            .attr('fill', "#ff00ff")
            .attr('x', function(d,i){
                console.log(d)
                return _this._private._gridZize * d.position.x
            })
            .attr('y', function(d,i){return _this._private._gridZize * d.position.y})
                .attr("transform", function(d, i) {
                    return "translate("+ d.position.x+","+ d.position.y+")";
                })




    }

    return _scope;
})();