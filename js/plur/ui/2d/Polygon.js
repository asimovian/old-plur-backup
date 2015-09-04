var Polygon = function(vertices) {
    Shape.call(this);
    this.vertices = vertices;
};

Polygon.prototype = Object.create(Polygon.prototype, Shape);