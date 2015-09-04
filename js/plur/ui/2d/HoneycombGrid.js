var HoneycombGrid = function(boundaryRectangle) {
    this.boundaryRectangle = boundaryRectangle;
};

HoneycombGrid.prototype = Object.create(HoneycombGrid.prototype, Grid);