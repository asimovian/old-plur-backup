var GridView = function(grid, boundaryRectangle) {
    this.grid = grid;
    this.boundaryRectangle = boundaryRectangle;
};

GridView.prototype.offsetX = function(x) {
    return this.boundaryRectangle.vertices[0].x + ( typeof x === 'undefined' ? 0 : x );
};

GridView.prototype.offsetY = function(y) {
    return this.boundaryRectangle.vertices[1].y + ( typeof x === 'undefined' ? 0 : y );
};