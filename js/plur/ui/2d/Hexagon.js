var Hexagon = function(vertices) {
    this.vertices = vertices;
    this.size = vertices[2].x - vertices[5].x;
    this.center = new XY(vertices[2].x - (this.size/2), vertices[2].y);
};

Hexagon.calcVertices = function(size, centerXY) {
    var vertices = [];

    var vertex = new XY(
        centerXY.x +  size * Math.cos(0),
        centerXY.y +  size *  Math.sin(0) );

    vertices.push(vertex);

    for (var i = 1; i <= 6; ++i) {
        var vertex = new XY(
            centerXY.x + size * Math.cos(2*Math.PI * i / 6),
            centerXY.y + size * Math.sin(2*Math.PI * i / 6) );

         vertices.push(vertex);
    }

    return vertices;
};


Hexagon.prototype.getFillStyle = function() {
    return this.fillStyle;
};

Hexagon.prototype.setFillStyle = function(fillStyle) {
    this.fillStyle = fillStyle;
};

Hexagon.prototype.contains = function(xy) {
    //todo: check polygon boundries if within boundary rectangle
    return this.boundaryRectangle.contains(xy);
};