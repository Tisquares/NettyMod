"# NettyMod" 

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

elements.bouncy_bomb = {
    color: "#ff0000",
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
}

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
