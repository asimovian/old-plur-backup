var HoneycombHexagon = function(vertices, adjacentHexagons) {
    Hexagon.call(this, vertices);
    this.adjacentHexagons = adjacentHexagons;
    this.boundaryRectangle = Rectangle.boundary(vertices);
    this.fillStyle = null;
};