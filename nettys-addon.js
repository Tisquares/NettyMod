"# NettyMod" 

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

elements.heavenly_ray = {
    color: ["#FFFF00", "#FFFFFF", "#7FFFD4"],
    reactions: {
        "uranium": { elem1: "ultra_uranium", elem2: "bless" },
        "dirt": { elem1: "plasma", elem2: "bless" },
        "sand": { elem1: "plasma", elem2: "bless" },
        "mud": { elem1: "plasma", elem2: "bless" },
        "water": { elem1: "plasma", elem2: "bless" },
    },
    tick: function (pixel) {
        var x = pixel.x;
        for (var y = pixel.y; y < height; y++) {
            if (outOfBounds(x, y)) {
                break;
            }
            if (isEmpty(x, y)) {
                if (Math.random() > 0.05) { continue }
                createPixel("flash", x, y);
                pixelMap[x][y].color = ["#FFFF00", "#FFFFFF", "#7FFFD4"];
                pixelMap[x][y].temp = 3500;
            }
            else {
                if (elements[pixelMap[x][y].element].isGas) { continue }
                if (elements[pixelMap[x][y].element].id === elements.heavenly_ray.id) { break }
                deletePixel(pixel.x, pixel.y - 1);
                pixelTempCheck(pixelMap[x][y]);
                break;
            }
            deletePixel(pixel.x, pixel.y);
        }


    },
    temp: 100000,
    category: "weapons",
    state: "gas",
    density: 1,
    excludeRandom: true,
    noMix: true

};

elements.crawl = {
    color: ["#800080", "#FFA500"],
    behavior: [
        "XX|CH:crawl|XX",
        "CH:crawl|EX:60>plasma,plasma,plasma,plasma,radiation,rad_steam%0.01|CH:crawl",
        "M2|M1 AND CH:crawl|M2",
    ],
    state: "solid",
    temp: 9000,
    reactions: {
        "super_powder": { elem1: "ultra_uranium", elem2: "null" },
    }
};

var placed = false

elements.time_bomb = {
    color: "#f00000",
    behavior: behaviors.STURDYPOWDER,
    state: "solid",
    category: "weapons",
    tick: function (pixel) {
        if (placed == false) {
            placed = true
            start = pixelTicks
        }
        console.log("placed:" + placed)
        console.log("start:" + start)
        console.log("tickslived:" + pixelTicks)
        if (pixelTicks == start + 100) {
            changePixel(pixel, "explosion")
            sleep(1000).then(() => { placed = false })
        }
    }
};

elements.flying_bomber = {
    color: "#8583c9",
    behavior: behaviors.FLY,
    state: "solid",
    tick: function(pixel) {
        if (Math.random() < 0.01) {createPixel("bomb", pixel.x, pixel.y+10);}
    },
    hardness: 1,
    tempHigh: 9000,
    stateHigh: "magma",
    density: 4000,
 };

 elements.bouncy_bomb = {
    color: ["#736F6E", "#625D5D"],
    category: "weapons",
    state: "solid",
    hidden: true,
    tick: function (pixel) {
        // Ask tisqbisque or modding channel with questions
        if (pixel.start === pixelTicks) { // init starting values
            pixel.bounce_y = pixel.y + 10; // by default can't bounce back up to starting
            pixel.bounce = 0; // if even, going down. odd, going up
        }

        if(pixel.bounce_y > 87) { // temporary, in the future bounce_y can change depending on pixel.y and current bounce count
            pixel.bounce_y = 86;
        }

        // Bouncing
        if (pixel.bounce % 2 === 0 && !tryMove(pixel, pixel.x, pixel.y + 1)) { // if unable to keep going down
            pixel.bounce++;
            tryMove(pixel,pixel.x,pixel.y-1); // bounce up
        }

        if (pixel.bounce % 2 === 1 && (!tryMove(pixel, pixel.x, pixel.y - 1) || pixel.y <= pixel.bounce_y) ) { // if unable to keep going up
            pixel.bounce++;
            pixel.bounce_y += 10; // change bounce height..
            tryMove(pixel,pixel.x,pixel.y+1); // bounce down
        }

        // Explode after set # bounces, may explode on peak height if # odd
        if (pixel.bounce > 10) {
            explodeAt(pixel.x, pixel.y, 20, "plasma");
        }
    },
};

elements.super_powder = {
  color: ["#000000", "#C0C0C0"],
	behavior: [
   "XX|DL|XX",
   "DL|EX:20%15>plasma,plasma,radiation,fire,rad_cloud|DL" ,
   "M2|DL AND M1|M2",
  ],
	category: "weapons",
	state: "solid",
    temp: 98000,
};

    elements.crawl = {
    color: ["#800080", "#FFA500"],
behavior: [
    "XX|CH:crawl|XX",
    "CH:crawl|EX:60>plasma,plasma,plasma,plasma,radiation,rad_steam%0.01|CH:crawl",
    "M2|M1 AND CH:crawl|M2",
],
  state: "solid",
  temp: 9000,
  reactions: {
    "super_powder": { elem1: "ultra_uranium", elem2: "null"},
}
    };

elements.ultra_uranium = {
	color: ["#50C878" , "#4F7942"],
	behavior: [
     "XX|XX|XX",
     "XX|DL%5|XX",
     "M2%25|M1%25|M2%25",
],
	category: "weapons",
	state: "solid",
        temp: 9999999999999999,
        hardness: 1,
};

elements.mega_beam = {
    color: ["#DFFF00" , "#00FFFF"],
    tick: function(pixel) {
        var x = pixel.x;
        for (var y = pixel.y; y < height; y++) {
            if (outOfBounds(x, y)) {
                break;
            }
            if (isEmpty(x, y)) {
                if (Math.random() > 0.05) { continue }
                createPixel("flash", x, y);
                pixelMap[x][y].color = "#DFFF00";
                pixelMap[x][y].temp = 9800;
            }
            else {
                if (elements[pixelMap[x][y].element].isGas) { continue }
                if (elements[pixelMap[x][y].element].id === elements.mega_beam.id) { break }
                pixelMap[x][y].temp += 9800;
                pixelTempCheck(pixelMap[x][y]);
                break;
            }
        }
        deletePixel(pixel.x-1, pixel.y-1);
        deletePixel(pixel.x+1, pixel.y+1);
        if ( pixelTicks - pixel.start > 1) {
            deletePixel(pixel.x, pixel.y)
        }
        doHeat(pixel);
    },
    temp: 9800,
    category: "weapons",
    state: "gas",
    density: 1,
    excludeRandom: true,
    noMix: true
};
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
