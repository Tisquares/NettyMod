elements.fire_tornado = {
    color: ["#FF8C00","#FFDF00","#E41B17"],
    tick: function(pixel) {
        if (pixel.stage) {
            var coords = circleCoords(pixel.x,pixel.y,pixel.stage);
            var coords = rectCoords(Math.floor(pixel.x-pixel.stage/2),pixel.y-pixel.stage,Math.floor(pixel.x+pixel.stage/2),pixel.y);
            if (pixel.stage >= pixel.mag) {
                deletePixel(pixel.x,pixel.y);
                return;
            }
            coords.forEach(function(coord){
                var x = coord.x;
                var y = coord.y;
                if (!isEmpty(x,y,true)) {
                    var p = pixelMap[x][y];
                    if (p.element === "fire_tornado") { return }
                    if (elements[p.element].breakInto) {
                        if (Math.random() < (elements[p.element].hardness || 1) * 0.1) {
                            breakPixel(p);
                        }
                    }
                    if (!elements[p.element].movable) { return }
                    if (!p.del && Math.random() < 0.1) { tryMove(p,p.x,p.y-1); }
                }
                else if (isEmpty(x,y)) {
                    createPixel(pixel.clone,x,y);
                }
            })
            pixel.stage++;
        }
        else if (!tryMove(pixel,pixel.x,pixel.y+1)) {
            if (!isEmpty(pixel.x,pixel.y+1,true)) {
                var elem = pixelMap[pixel.x][pixel.y+1].element;
                if (elem === "fire_tornado") { return }
                if (elements[elem].state !== "gas") { pixel.clone = "fire"; }
                else { pixel.clone = elem; }
            }
            else {
                pixel.clone = "fire";
            }
            // random 10 to 20
            pixel.mag = Math.floor(Math.random() * 10) + 20;
            pixel.stage = 1;
        }
    },
    category: "weapons",
    state: "liquid",
    maxSize: 1,
    density: 997,
    cooldown: defaultCooldown,
    excludeRandom: true,
};
